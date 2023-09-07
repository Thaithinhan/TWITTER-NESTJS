import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Follow, FollowSchema } from '../Follow/Schemas/follow.schemas';
import { Tweet, TweetSchema } from './Schemas/tweet.schemas';
import { TweetController } from './tweet.controller';
import { TweetService } from './Tweet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tweet.name, schema: TweetSchema },
      { name: Follow.name, schema: FollowSchema },
    ]),
    // Thêm bất kỳ module nào khác mà TweetModule phụ thuộc vào
  ],
  controllers: [TweetController],
  providers: [TweetService],
  exports: [TweetService], // Export TweetService nếu bạn muốn sử dụng nó ở module khác
})
export class TweetModule {}
