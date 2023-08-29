// email-unique.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class EmailUniqueGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;

    const isEmailUnique = await this.userService.isEmailUnique(email);
    if (!isEmailUnique) {
      throw new ForbiddenException('Email is already registered');
    }
    return true;
  }
}
