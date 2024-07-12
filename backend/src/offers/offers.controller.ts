import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../utils/decorators/auth-user.decorator';
import { relations } from '../utils/consts';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getOffers(): Promise<Offer[]> {
    return this.offersService.findMany({
      relations: relations.allOffers,
    });
  }

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ) {
    this.offersService.create(createOfferDto, user);
  }

  @Get(':id')
  async findOfferById(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOneById(id);
  }
}
