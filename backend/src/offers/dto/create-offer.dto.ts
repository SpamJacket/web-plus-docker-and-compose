import { PickType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { Offer } from '../entities/offer.entity';

export class CreateOfferDto extends PickType(Offer, [
  'amount',
  'hidden',
] as const) {
  @IsNumber()
  itemId: number;
}
