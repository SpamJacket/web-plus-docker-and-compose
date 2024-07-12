import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { IsString, Length, IsUrl, IsEmail, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

import { Offer } from '../../offers/entities/offer.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    length: 64,
    unique: true,
  })
  @IsString()
  @Length(1, 64)
  username: string;

  @Column({
    length: 200,
    default: 'Пока ничего не рассказал о себе',
  })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  about: string;

  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsOptional()
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
    select: false,
  })
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @Column({
    select: false,
  })
  @IsString()
  @Length(2, 64)
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner, {
    onDelete: 'CASCADE',
  })
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user, {
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner, {
    onDelete: 'CASCADE',
  })
  wishlists: Wishlist[];
}
