import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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

    return {
      accessToken,
      refreshToken,
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
}
