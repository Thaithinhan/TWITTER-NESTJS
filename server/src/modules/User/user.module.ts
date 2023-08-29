import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './user.controller';
import { UserService } from './user.service';
import { EmailUniqueGuard } from './Guard/EmailUniqueGuard ';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UserService, EmailUniqueGuard],
})
export class UserModule {}
