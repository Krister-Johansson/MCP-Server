import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User } from './entities/user.entity';

const pubSub = new PubSub();

export const USERS_ADDED = 'usersAdded';
export const USERS_UPDATED = 'usersUpdated';
export const USERS_DELETED = 'usersDeleted';

@Resolver(() => User)
export class UsersSubscriptionResolver {
  @Subscription(() => User, {
    name: 'userCreated',
    description: 'A new user was created',
  })
  userCreated() {
    return pubSub.asyncIterableIterator(USERS_ADDED);
  }

  @Subscription(() => User, {
    name: 'userUpdated',
    description: 'A user was updated',
  })
  userUpdated() {
    return pubSub.asyncIterableIterator(USERS_UPDATED);
  }

  @Subscription(() => User, {
    name: 'userRemoved',
    description: 'A user was deleted',
  })
  userRemoved() {
    return pubSub.asyncIterableIterator(USERS_DELETED);
  }
}
