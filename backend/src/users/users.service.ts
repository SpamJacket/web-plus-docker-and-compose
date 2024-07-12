import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { createHash } from '../utils/hash';
import { ERR_MSG, relations, selects } from '../utils/consts';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(query: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(query);
  }

  async findById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  async findMany(query: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(query);
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.findOne({
      where: {
        username: username,
      },
    });

    if (!user) throw new NotFoundException(ERR_MSG.USER.NOT_FOUND);

    return user;
  }

  async getUserWishes(
    username: string,
    isCurrentUser: boolean,
  ): Promise<Wish[]> {
    const user = await this.findOne({
      where: { username },
      relations: isCurrentUser
        ? relations.currentUserWishes
        : relations.userWishes,
    });

    if (!user) throw new NotFoundException(ERR_MSG.USER.NOT_FOUND);

    return user.wishes;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    const isSameEmail = user.email === updateUserDto.email;
    const isSameUsername = user.username === updateUserDto.username;

    if (
      updateUserDto.email &&
      !isSameEmail &&
      (await this.findOne({ where: { email: updateUserDto.email } }))
    )
      throw new ConflictException(ERR_MSG.USER.EMAIL_CONFLICT);

    if (
      updateUserDto.username &&
      !isSameUsername &&
      (await this.findOne({ where: { username: updateUserDto.username } }))
    )
      throw new ConflictException(ERR_MSG.USER.USERNAME_CONFLICT);

    const { password } = updateUserDto;

    if (password) updateUserDto.password = await createHash(password);

    return this.usersRepository
      .save({ ...user, ...updateUserDto })
      .then((updatedUser) =>
        this.findOne({
          where: { id: updatedUser.id },
          select: selects.userWithEmail,
        }),
      );
  }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    if (
      (await this.findOne({ where: { email: createUserDto.email } })) ||
      (await this.findOne({ where: { username: createUserDto.username } }))
    )
      throw new ConflictException(ERR_MSG.USER.SIGNUP_CONFLICT);

    const { password } = createUserDto;
    const user = this.usersRepository.create({
      ...createUserDto,
      password: await createHash(password),
    });

    return this.usersRepository.save(user).then((newUser) =>
      this.findOne({
        where: { id: newUser.id },
        select: selects.userWithEmail,
      }),
    );
  }
}
