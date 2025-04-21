import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  USERS_ADDED,
  USERS_DELETED,
  USERS_UPDATED,
} from './users.subscription.resolver';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    this.logger.log(`Creating new user with email: ${createUserInput.email}`);

    const user = await this.prisma.user.create({
      data: createUserInput,
    });
    this.logger.log(`Successfully created user with ID: ${user.id}`);

    await this.pubSub.publish(USERS_ADDED, { [USERS_ADDED]: user });
    this.logger.debug(`Published ${USERS_ADDED} event for user ID: ${user.id}`);

    return user;
  }

  async findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');

    const users = await this.prisma.user.findMany();
    this.logger.debug(`Found ${users.length} users`);

    return users;
  }

  async findOne(id: string): Promise<User> {
    this.logger.log(`Fetching user with ID: ${id}`);

    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.debug(`Found user: ${JSON.stringify(user)}`);
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserInput,
    });
    this.logger.log(`Successfully updated user with ID: ${id}`);

    await this.pubSub.publish(USERS_UPDATED, { [USERS_UPDATED]: user });
    this.logger.debug(`Published ${USERS_UPDATED} event for user ID: ${id}`);

    return user;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`Deleting user with ID: ${id}`);

    const user = await this.prisma.user.delete({
      where: { id },
    });
    this.logger.log(`Successfully deleted user with ID: ${id}`);

    await this.pubSub.publish(USERS_DELETED, { [USERS_DELETED]: user });
    this.logger.debug(`Published ${USERS_DELETED} event for user ID: ${id}`);

    return true;
  }
}
