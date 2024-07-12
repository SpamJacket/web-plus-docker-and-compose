import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Min, IsNumber, IsBoolean, IsOptional } from 'class-validator';

import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers, {
    nullable: false,
  })
  item: Wish;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hidden: boolean;
}
