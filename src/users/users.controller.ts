import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/whoami')
  // whoami(@Session() session: any) {
  //   return this.usersService.findOne(session.userid);
  // }

  @Get('/whoami')
  whoAmI(@CurrentUser() user: string) {
    return user;
  }
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() Session: any) {
    const user = await this.authService.signup(body.email, body.password);
    Session.userid = user.id;
    return user;
  }

  @Post('/sigin')
  async sigin(@Body() body: CreateUserDto, @Session() Session: any) {
    const user = await this.authService.sigin(body.email, body.password);
    Session.userid = user.id;
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userid = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
