import * as bcrypt from 'bcrypt';
import { classToPlain } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from './schemas/user.schema';
import { CreateUserDTO, LoginUserDTO } from './UserDTO/user.dto';

const JWT_ACCESS_TOKEN_KEY = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_KEY = process.env.JWT_REFRESH_TOKEN_SECRET;

@Injectable()
export class UserService {
  private refreshTokens: string[] = [];
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  //CHECK EMAIL IS EXISTENT
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !user;
  }

  //REGISTER
  async createUser(user: CreateUserDTO): Promise<{ message: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      const newUser = new this.userModel(user);
      newUser.save();
      return { message: 'User created successfully' };
    } catch (error) {
      return error;
    }
  }

  //CHECK EMAIL PASSWORD
  async checkLogin(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  //LOGIN
  async login(user: LoginUserDTO) {
    const payload = { userRole: user.role, userId: user._id };
    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);
    this.storeRefreshToken(refreshToken);
    // const responseUser = classToPlain(user);
    const { password, ...responseUser } = user;
    return {
      accessToken,
      refreshToken,
      user: responseUser,
    };
  }
  getAccessToken(payload: any): string {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_KEY, { expiresIn: '2d' });
  }
  getRefreshToken(payload: any): string {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_KEY, { expiresIn: '7d' });
  }

  //LƯU VÀO MẢNG REFRESH TOKEN
  storeRefreshToken(token: string) {
    this.refreshTokens.push(token);
  }

  //XÓA REFRESH TOKEN
  removeRefreshToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  }

  //CHECK REFRESH TOKEN
  isRefreshTokenValid(token: string): boolean {
    return this.refreshTokens.includes(token);
  }

  //tạo thêm method để tạo mới accesstoken dựa vào refresh token

  // GET ALL USERS
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; maxPages: number }> {
    try {
      const skip = (page - 1) * limit;

      const totalCount = await this.userModel.countDocuments().exec();
      const users = await this.userModel.find().skip(skip).limit(limit).exec();
      const maxPages = Math.ceil(totalCount / limit);

      return { users, maxPages };
    } catch (error) {
      throw new Error('Error fetching users.');
    }
  }
  // GET USER BY ID
  async findUserById(userId: string): Promise<Partial<User>> {
    // const id = new Types.ObjectId(userId);
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new Error('User not found.');
      }
      const { password, ...resUser } = user.toObject();
      return resUser;
    } catch (error) {
      throw error;
    }
  }

  //UPDATE USER INFO
  async updateUser(
    userId: string,
    updateData: any,
  ): Promise<User | { message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    // console.log(updateData);

    // Cập nhật các trường của người dùng nếu chúng được cung cấp
    if (updateData.username && updateData.username.length > 6) {
      user.username = updateData.username;
    } else {
      return { message: 'Please enter a username with at least 6 characters' };
    }

    if (updateData.fullname && updateData.fullname.length > 6) {
      user.fullname = updateData.fullname;
    } else {
      return { message: 'Please enter a fullname with at least 6 characters' };
    }

    if (updateData.avatar) {
      user.avatar = updateData.avatar;
    }

    if (updateData.cover_photo) {
      user.cover_photo = updateData.cover_photo;
    }

    // Lưu lại người dùng và trả về
    await user.save();
    return user;
  }
}
