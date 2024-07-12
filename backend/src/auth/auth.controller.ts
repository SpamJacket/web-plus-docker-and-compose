import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { Public } from '../utils/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@AuthUser() user: User): Promise<any> {
    return this.authService.signin(user);
  }

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.signup(createUserDto);

    return user;
  }
}
