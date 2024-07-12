import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), forwardRef(() => WishesModule)],
  controllers: [OffersController],
  providers: [OffersService],
  exports: [OffersService],
})
export class OffersModule {}
