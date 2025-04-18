import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Todo } from './entities/todo.entity';

export const TODOS_ADDED = 'todosAdded';
export const TODOS_UPDATED = 'todosUpdated';
export const TODOS_DELETED = 'todosDeleted';

@Resolver()
export class TodosSubscriptionResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}

  @Subscription(() => Todo, {
    name: TODOS_ADDED,
  })
  todoAdded() {
    return this.pubSub.asyncIterableIterator(TODOS_ADDED);
  }

  @Subscription(() => Todo, {
    name: TODOS_UPDATED,
  })
  todoUpdated() {
    return this.pubSub.asyncIterableIterator(TODOS_UPDATED);
  }

  @Subscription(() => Todo, {
    name: TODOS_DELETED,
  })
  todoDeleted() {
    return this.pubSub.asyncIterableIterator(TODOS_DELETED);
  }
}
