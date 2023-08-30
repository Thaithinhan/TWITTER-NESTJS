import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateUserDTO {
  @IsNotEmpty()
  @MinLength(6)
  fullname: string;
  @IsNotEmpty()
  @MinLength(6)
  username: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(8)
  password: string;
  status?: number;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify?: number;
  role?: number;
  avatar?: string;
  cover_photo?: string;
}

export class LoginUserDTO {
  _id: ObjectId;
  fullname: string;
  username: string;
  email: string;
  password: string;
  status?: number;
  email_verify_token?: string;
  forgot_password_token?: string;
  verify?: number;
  role?: number;
  avatar?: string;
  cover_photo?: string;
}

export class DataLoginDTO {
  email: string;
  password: string;
}

export class UpdateUserDto {
  fullname?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}
