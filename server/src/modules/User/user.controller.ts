import { Response } from 'express';

import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import { EmailUniqueGuard } from './Guard/EmailUniqueGuard ';
import { UserService } from './user.service';
import { CreateUserDTO, DataLoginDTO, LoginUserDTO } from './UserDTO/user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UserService) {}

  //REGISTER
  @Post()
  @UseGuards(EmailUniqueGuard)
  async createUser(@Body() newUser: CreateUserDTO) {
    return this.usersService.createUser(newUser);
  }

  @Post('login')
  async login(@Body() data: DataLoginDTO, @Res() res: Response) {
    const user = await this.usersService
      .checkLogin(data.email, data.password)
      .then((user) => user?._doc);

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = await this.usersService.login(user);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Bạn chỉ nên sử dụng option này khi ứng dụng chạy trên HTTPS
      sameSite: 'none',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set thời gian hết hạn cho cookie = 7 ngày
    });
    return res.status(200).json({ accessToken, user });
  }

  // ... thêm các endpoints khác như đăng xuất, làm mới token, v.v. ...
}
