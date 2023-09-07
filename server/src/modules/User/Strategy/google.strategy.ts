import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { UserService } from '../Service/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    try {
      const dataResponse = await this.userService.validateOAuthLogin(profile);
      done(null, dataResponse);
    } catch (error) {
      console.error('Error in Google Strategy validate:', error); // Đây sẽ log lỗi nếu có
      done(error, null);
    }
  }
}
