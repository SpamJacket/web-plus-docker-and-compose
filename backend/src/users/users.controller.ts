import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { selects } from '../utils/consts';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findCurrentUser(@AuthUser() user: User): Promise<User> {
    return this.usersService.findOne({
      where: { id: user.id },
      select: selects.userWithEmail,
    });
  }

  @Get('me/wishes')
  async getCurrentUserWishes(@AuthUser() user: User): Promise<Wish[]> {
    return this.usersService.getUserWishes(user.username, true);
  }

  @Patch('me')
  async updateCurrentUser(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user, updateUserDto);
  }

  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return this.usersService.getUserWishes(username, false);
  }

  @Post('find')
  async findManyUsers(@Body('query') query: string): Promise<User[]> {
    return this.usersService.findMany({
      where: [{ email: query }, { username: query }],
      select: selects.userWithEmail,
    });
  }
}
