import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { WishesService } from './wishes.service';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { Public } from '../utils/decorators/public.decorator';
import { relations } from '../utils/consts';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async createWish(
    @Body() createWishDto: CreateWishDto,
    @AuthUser() user: User,
  ) {
    this.wishesService.create(user, createWishDto);
  }

  @Public()
  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: relations.wishes,
    });
  }

  @Public()
  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findMany({
      order: { copied: 'DESC' },
      take: 20,
      relations: relations.wishes,
    });
  }

  @Get(':id')
  async findWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOneById(id);
  }

  @Patch(':id')
  async updateWishById(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    this.wishesService.update(id, updateWishDto, user.id);
  }

  @Delete(':id')
  async deleteWishById(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.delete(id, user.id);
  }

  @Post(':id/copy')
  async copyWishById(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copy(id, user);
  }
}
