import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { ERR_MSG, relations } from '../utils/consts';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async findOne(query: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistsRepository.findOne(query);
  }

  async findOneById(id: number): Promise<Wishlist> {
    return this.findOne({ where: { id }, relations: relations.wishlists });
  }

  async findMany(query: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistsRepository.find(query);
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const wishes: Wish[] = [];

    for (const id of createWishlistDto.itemsId) {
      wishes.push(await this.wishesService.findOneById(id));
    }

    delete createWishlistDto.itemsId;

    return await this.wishlistsRepository.save({
      ...createWishlistDto,
      wishes,
      owner,
    });
  }

  async update(
    wishId: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.findOneById(wishId);

    if (!wishlist) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND);
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(ERR_MSG.WISHLIST.UPDATE_SOMEONE_WISHLIST);
    }

    const wishes: Wish[] = [];

    if (updateWishlistDto.itemsId) {
      for (const id of updateWishlistDto.itemsId) {
        wishes.push(await this.wishesService.findOneById(id));
      }
    }

    return this.wishlistsRepository.save({
      id: wishId,
      name: updateWishlistDto.name ? updateWishlistDto.name : wishlist.name,
      description: updateWishlistDto.description
        ? updateWishlistDto.description
        : wishlist.description,
      image: updateWishlistDto.image ? updateWishlistDto.image : wishlist.image,
      items: updateWishlistDto.itemsId ? wishes : wishlist.items,
      owner: wishlist.owner,
    });
  }

  async delete(wishId: number, userId: number): Promise<Wishlist> {
    const wishlist = await this.findOneById(wishId);

    if (!wishlist) {
      throw new NotFoundException(ERR_MSG.WISHLIST.NOT_FOUND);
    }
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException(ERR_MSG.WISHLIST.DELETE_SOMEONE_WISHLIST);
    }

    this.wishlistsRepository.delete(wishId);

    return wishlist;
  }
}
