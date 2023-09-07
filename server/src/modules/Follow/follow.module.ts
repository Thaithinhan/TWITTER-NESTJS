import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../User/schemas/user.schema';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Follow, FollowSchema } from './Schemas/follow.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
