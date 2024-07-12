import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { ERR_MSG, relations } from '../utils/consts';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishesRepository.findOne(query);
  }

  async findOneById(id: number): Promise<Wish> {
    return this.findOne({ where: { id }, relations: relations.wishes });
  }

  async findMany(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(query);
  }

  async create(owner: User, createWishDto: CreateWishDto): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner,
    });

    return this.wishesRepository.save(wish);
  }

  async update(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<Wish> {
    const wish = await this.findOneById(wishId);

    if (!wish) throw new NotFoundException(ERR_MSG.WISH.NOT_FOUND_FOR_UPDATE);

    if (wish.owner.id !== userId)
      throw new ForbiddenException(ERR_MSG.WISH.UPDATE_SOMEONE_GIFT);

    if (updateWishDto.price && wish.offers.length > 0) {
      throw new ForbiddenException(ERR_MSG.WISH.UPDATE_RAISED_GIFT);
    }

    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async updateWishRaise(id: number, amount: number): Promise<UpdateResult> {
    return this.wishesRepository.update({ id }, { raised: amount });
  }

  async delete(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findOneById(wishId);

    if (!wish) {
      throw new NotFoundException(ERR_MSG.WISH.ALREADY_DELETED);
    }
    if (wish.owner.id != userId) {
      throw new ForbiddenException(ERR_MSG.WISH.DELETE_SOMEONE_GIFT);
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }

  async copy(wishId: number, user: User) {
    const wish = await this.findOneById(wishId);

    if (!wish) {
      throw new NotFoundException(ERR_MSG.WISH.EMPTY_COPIED);
    }

    const copiedWish = await this.findOne({
      where: {
        owner: { id: user.id },
        name: wish.name,
      },
    });

    if (copiedWish) {
      throw new ConflictException(ERR_MSG.WISH.ALREADY_COPIED);
    }

    const wishCopy: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    return this.create(user, wishCopy).then(() => {
      return this.wishesRepository.save({ ...wish, copied: wish.copied + 1 });
    });
  }
}
