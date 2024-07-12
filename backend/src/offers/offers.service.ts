import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { ERR_MSG, relations } from '../utils/consts';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async findOne(query: FindOneOptions<Offer>): Promise<Offer> {
    return this.offersRepository.findOne(query);
  }

  async findOneById(id: number): Promise<Offer> {
    const offer = await this.findOne({
      where: { id },
      relations: relations.allOffers,
    });

    if (!offer) throw new NotFoundException(ERR_MSG.OFFER.NOT_FOUND);

    return offer;
  }

  async findMany(query: FindManyOptions<Offer>): Promise<Offer[]> {
    return this.offersRepository.find(query);
  }

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const wish = await this.wishesService.findOneById(createOfferDto.itemId);

    if (!wish) throw new NotFoundException(ERR_MSG.OFFER.NOT_FOUND_WISH);

    if (wish.owner.id === user.id)
      throw new ForbiddenException(ERR_MSG.OFFER.SUPPORT_MYSELF);

    if (
      createOfferDto.amount > wish.price ||
      createOfferDto.amount > wish.price - wish.raised
    )
      throw new ForbiddenException(ERR_MSG.OFFER.TOO_MUCH);

    if (wish.price === wish.raised)
      throw new ForbiddenException(ERR_MSG.OFFER.COLLECTED);

    await this.wishesService.updateWishRaise(
      wish.id,
      wish.raised + createOfferDto.amount,
    );

    return await this.offersRepository.save({
      ...createOfferDto,
      owner: user,
      item: wish,
    });
  }
}
