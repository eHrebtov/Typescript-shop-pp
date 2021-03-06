import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { PaginatedUsers, UserDTO } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      const activationLink = dto.strategy === 'local' ? v4() : null;

      const newUser = new User();
      newUser.email = dto.email;
      newUser.name = dto.name;
      newUser.strategy = dto.strategy;
      if (dto.password) newUser.password = dto.password;
      newUser.activationLink = activationLink;
      newUser.isActivated = dto.strategy === 'local' ? false : true;

      const savedUser = await this.userRepository.save(newUser);
      return savedUser;
    }
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Email must be unique.',
      error: 'Bad Request',
    });
  }

  async updateUser(dto: UpdateUserDto, userId: number, isAdmin: boolean) {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: dto.email,
      },
    });
    const user = await this.userRepository.findOne(userId, {
      select: [
        'password',
        'name',
        'email',
        'isActivated',
        'activationLink',
        'isAdmin',
      ],
    });
    if (userByEmail && userByEmail.email && userByEmail.email !== user.email) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Email must be uniqe.'],
        error: 'Bad Request',
      });
    } else {
      if (dto.password) user.password = await bcrypt.hash(dto.password, 10);
      if (dto.name) user.name = dto.name;
      if (dto.email && user.email !== dto.email) {
        user.email = dto.email;
        user.isActivated = false;
        user.activationLink = v4();
      }
      if (dto.refresh_token) user.refresh_token = dto.refresh_token;
      if (isAdmin) {
        if (dto.isAdmin !== undefined) {
          user.isAdmin = dto.isAdmin;
        }
        if (dto.isActivated !== undefined) {
          user.isActivated = dto.isActivated;
        }
      }

      await this.userRepository.update(userId, user);
    }
  }

  async getAllUsers(
    pageNumber: number | 'undefined' | '',
    keyword: string,
  ): Promise<PaginatedUsers> {
    const pageSize = 12;
    const page =
      pageNumber === 'undefined' || pageNumber === '' ? 1 : pageNumber;
    keyword = keyword === 'undefined' ? '' : keyword;

    const [users, count] = await this.userRepository
      .createQueryBuilder()
      .where('LOWER(name) LIKE :name', {
        name: `%${keyword.toLowerCase()}%`,
      })
      .take(pageSize)
      .skip(pageSize * (page - 1))
      .orderBy('id')
      .getManyAndCount();

    return { page, pages: Math.ceil(count / pageSize), users };
  }

  async getUserById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserByActivationLink(activationLink: string): Promise<User> {
    return await this.userRepository.findOne({ where: { activationLink } });
  }

  async deleteMe(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  async getUserByRefreshToken(refresh_token: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        refresh_token,
      },
    });
  }

  async getCurrentUser(userId: number): Promise<UserDTO> {
    const user = await this.userRepository.findOne(userId);
    return new UserDTO(user);
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
