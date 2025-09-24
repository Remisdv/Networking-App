import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const normalizedEmail = createUserDto.email;

    const existingUser = await this.usersRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Un compte existe déjà avec cette adresse e-mail.');
    }

    const passwordHash = await argon2.hash(createUserDto.password, {
      type: argon2.argon2id,
    });

    const user = this.usersRepository.create({
      email: normalizedEmail,
      passwordHash,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      termsAcceptedAt: new Date(),
    });

    const savedUser = await this.usersRepository.save(user);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: false,
    });
  }
}
