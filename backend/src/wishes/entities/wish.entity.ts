import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import {
  Length,
  IsUrl,
  Min,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  @IsNumber()
  @Min(1)
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes, {
    nullable: false,
  })
  owner: User;

  @Column({
    length: 1024,
  })
  @IsString()
  @Length(1, 2024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item, {
    onDelete: 'CASCADE',
  })
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  @JoinTable()
  wishlists: Wishlist[];

  @Column({
    type: 'int',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  copied: number;
}
