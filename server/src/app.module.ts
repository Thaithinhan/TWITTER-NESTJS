require('dotenv').config();
import { join } from 'path';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { FollowModule } from './modules/Follow/follow.module';
import { TweetModule } from './modules/Tweet/tweet.module';
import { UserModule } from './modules/User/user.module';

const dbName = process.env.DB_NAME;
@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '../public') }),
    MongooseModule.forRoot(`mongodb://localhost:27017/${dbName}`),
    UserModule,
    FollowModule,
    TweetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
