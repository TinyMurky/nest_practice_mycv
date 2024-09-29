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
} from '@nestjs/common';
import { CreateUserDto } from '@/users/dtos/create-user.dto';
import { UsersService } from '@/users/users.service';
import { UpdateUserDto } from '@/users/dtos/update-user.dto';
import { Serialize } from '@/inteceptors/serialize.interceptor';
import { UserDto } from '@/users/dtos/user.dto';
import { AuthService } from '@/users/auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private _userService: UsersService,
    private _authService: AuthService,
  ) {}

  @Post('/signup')
  public signUp(@Body() body: CreateUserDto) {
    return this._authService.signUp({
      email: body.email,
      password: body.password,
    });
  }

  @Post('/signin')
  public signIn(@Body() body: CreateUserDto) {
    return this._authService.signIn({
      email: body.email,
      password: body.password,
    });
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

  @Get()
  public find(@Query('email') email: string) {
    return this._userService.findByEmail(email);
  }

  @Patch('/:id')
  public update(@Body() body: UpdateUserDto, @Param('id') id: string) {
    const userId = parseInt(id);

    return this._userService.update(userId, body);
  }

  @Delete('/:id')
  public remove(@Param('id') id: string) {
    const userId = parseInt(id);

    return this._userService.remove(userId);
  }
}
