require('dotenv').config();
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersController } from './modules/User/user.controller';
import { UserModule } from './modules/User/user.module';
const dbName = process.env.DB_NAME;

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '../public') }),
    MongooseModule.forRoot(`mongodb://localhost:27017/${dbName}`),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
