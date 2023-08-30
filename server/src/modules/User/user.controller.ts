import { Response } from 'express';
import { AuthGuard } from 'src/Auth/auth.guard';
import { multerUpload } from 'src/config/multer.config';
import { ExtendedRequest } from 'src/Types/Types';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { EmailUniqueGuard } from './Guard/EmailUniqueGuard ';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';
import {
  CreateUserDTO,
  DataLoginDTO,
  LoginUserDTO,
  UpdateUserDto,
} from './UserDTO/user.dto';

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
    const resData = await this.usersService
      .checkLogin(data.email, data.password)
      .then((user) => user?._doc);

    if (!resData) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken, user } =
      await this.usersService.login(resData);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Bạn chỉ nên sử dụng option này khi ứng dụng chạy trên HTTPS
      sameSite: 'none',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set thời gian hết hạn cho cookie = 7 ngày
    });

    return res.status(200).json({ accessToken, user });
  }

  // ... thêm các endpoints khác như đăng xuất, làm mới token, v.v. ...

  //GET ALL USERS
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      if (limit > 50)
        throw new BadRequestException('Limit should not exceed 50');

      const { users, maxPages } = await this.usersService.getAllUsers(
        page,
        limit,
      );

      if (page > maxPages && maxPages !== 0) {
        throw new BadRequestException('Page exceeds maximum limit');
      }

      return {
        data: users,
        currentPage: Number(page),
        maxPages,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while processing your request.',
        );
      }
    }
  }
  //GET USER CURRENT LOGIN
  @Get('current-user')
  @UseGuards(AuthGuard)
  async getMe(@Req() request: ExtendedRequest) {
    const user = await this.usersService.findUserById(request.userId);
    return user; // Trả về thông tin người dùng sau khi loại bỏ trường password
  }

  //GET USER BY ID
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    return user;
  }

  // UPDATE USER
  @Patch('update-user')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'cover_photo', maxCount: 1 },
      ],
      multerUpload,
    ),
  )
  async updateUser(
    @Req() request: ExtendedRequest,
    @Body() updateDataDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      cover_photo?: Express.Multer.File[];
    },
  ): Promise<User | { message: string }> {
    const userId = request.userId;

    if (files.avatar) {
      updateDataDto.avatar = files.avatar[0].path;
    }

    if (files.cover_photo) {
      updateDataDto.cover_photo = files.cover_photo[0].path;
    }

    return this.usersService.updateUser(userId, updateDataDto);
  }
}
