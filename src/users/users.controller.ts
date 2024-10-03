import {
  Body,
  // ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { UserDto } from '@/users/dtos/user.dto';
import { AuthService } from '@/users/auth.service';
import { SetCookieInterceptor } from '@/interceptors/set-cookies.interceptor';
import { ClearCookies } from '@/interceptors/clear-cookies.interceptor';
// import { CurrentUserInterceptor } from '@/users/interceptors/current-user.interceptor';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@/users/users.entity';
import { AuthGuard } from '@/guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(
    private _userService: UsersService,
    private _authService: AuthService,
  ) {}

  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  @Post('/signup')
  public signUp(@Body() body: CreateUserDto) {
    return this._authService.signUp({
      email: body.email,
      password: body.password,
    });
  }

  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  @Post('/signin')
  public signIn(@Body() body: CreateUserDto) {
    return this._authService.signIn({
      email: body.email,
      password: body.password,
    });
  }

  @ClearCookies(['id', 'email'])
  @Post('/signout')
  public signOut() {}

  // @UseInterceptors(CurrentUserInterceptor)
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  @Get('/whoami')
  public async whoAmI(
    // @Cookies('id') id: string,
    // @Cookies('email') email: string,
    @CurrentUser() user: User,
  ) {
    return user;
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  public async findOne(@Param('id') id: string) {
    console.log('Route start running');
    const userId = parseInt(id);

    // Info: (20240928 - Murky) Nest會自己等待 Promise所以不用主動await
    const user = await this._userService.findOneById(userId);

    if (!user) {
      // Info: (20240928 - Murky) NotFoundException => 只有http error有 websocket和gRPC不能兼容
      throw new NotFoundException(`User not found, id: ${id}`);
    }

    return user;
  }

  @Serialize(UserDto)
  @Get()
  public find(@Query('email') email: string) {
    return this._userService.findByEmail(email);
  }

  @Serialize(UserDto)
  @Patch('/:id')
  public update(@Body() body: UpdateUserDto, @Param('id') id: string) {
    const userId = parseInt(id);

    return this._userService.update(userId, body);
  }

  @Serialize(UserDto)
  @Delete('/:id')
  public remove(@Param('id') id: string) {
    const userId = parseInt(id);

    return this._userService.remove(userId);
  }
}
