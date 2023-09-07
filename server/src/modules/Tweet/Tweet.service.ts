import { Model, Types } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Follow } from '../Follow/Schemas/follow.schemas';
import { Tweet, TweetDocument } from './Schemas/tweet.schemas';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
  ) {}
  //CREATE TWEET
  async createTweet(
    author: string,
    content: string,
    mediaUrls: string[],
  ): Promise<TweetDocument> {
    const tweet = new this.tweetModel({
      content,
      medias: mediaUrls,
      author: new Types.ObjectId(author),
    });
    return tweet.save();
  }
  //UPDATE TWEET BY TWEET ID
  async updateTweet(
    tweetId: string,
    content: string,
    mediaUrls: string[],
  ): Promise<TweetDocument | { success: boolean; message: string }> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) return { success: false, message: 'Tweet not found' };

    if (content) tweet.content = content;
    if (mediaUrls.length > 0) tweet.medias = mediaUrls;
    return tweet.save();
  }
  //DELETE TWEET
  async deleteTweet(tweetId: string): Promise<boolean> {
    const result = await this.tweetModel.findByIdAndDelete(
      new Types.ObjectId(tweetId),
    );
    return !!result;
  }

  //GET ALL RELEVANT TWEETS WITH CURRENT USER
  async getRelevantTweets(userId: string): Promise<TweetDocument[]> {
    const followingRecords = await this.followModel.find({
      current_userId: new Types.ObjectId(userId),
    });
    const followingIds = followingRecords.map(
      (record) => record.followed_userId,
    );
    return this.tweetModel
      .find({
        type: 'tweet',
        $or: [
          { 'likes.length': { $gte: 5 } },
          { author: new Types.ObjectId(userId) },
          { author: { $in: followingIds } },
        ],
      })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();
  }

  //GET ALL TWEETS FOR ADMINPAGE
  async getAllTweets(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ tweets: TweetDocument[]; totalPages: number }> {
    const totalTweets = await this.tweetModel.countDocuments();
    const totalPages = Math.ceil(totalTweets / perPage);

    const tweets = await this.tweetModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('author')
      .exec();

    return { tweets, totalPages };
  }
  //GET TWEET BY ID TWEET
  async getTweetById(tweetId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel
      .findById(tweetId)
      .populate('author')
      .exec();
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet;
  }
  //GET TWEET BY ID USER
  async getTweetsByUserId(userId: string): Promise<TweetDocument[]> {
    const tweets = await this.tweetModel
      .find({ author: new Types.ObjectId(userId), type: 'tweet' })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();

    return tweets;
  }
  //ADD LIKE TWEET
  async likeTweet(tweetId: string, userId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel.findById(tweetId);

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    // Kiểm tra xem người dùng đã like bài tweet này chưa
    if (!tweet.likes.includes(new Types.ObjectId(userId))) {
      tweet.likes.push(new Types.ObjectId(userId));
      await tweet.save();
    }
    return tweet;
  }
  //UNLIKE TWEET
  async unlikeTweet(tweetId: string, userId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    const index = tweet.likes.indexOf(new Types.ObjectId(userId));
    if (index !== -1) {
      tweet.likes.splice(index, 1);
      await tweet.save();
    }
    return tweet;
  }
  //GET USER LIKE TWEET
  async getUsersWhoLikedTweet(tweetId: string): Promise<Types.ObjectId[]> {
    const tweet = await this.tweetModel.findById(tweetId).populate('likes');

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet.likes;
  }
  //CREATE COMMENT
  async createComment(
    author: string,
    content: string,
    mediaUrls: string[],
    parentId: Types.ObjectId,
  ): Promise<TweetDocument> {
    const comment = new this.tweetModel({
      content,
      medias: mediaUrls,
      author: new Types.ObjectId(author),
      type: 'comment',
      parentId,
    });
    await comment.save();
    return comment;
  }
  // GET LIST COMMENT OF PARENT TWEET ID
  async getCommentsByParentId(parentId: string): Promise<TweetDocument[]> {
    const listComments = await this.tweetModel
      .find({ type: 'comment', parentId: parentId })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();
    return listComments;
  }
}
