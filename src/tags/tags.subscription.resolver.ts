import { Inject } from '@nestjs/common';
import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Tag } from './entities/tag.entity';

export const TAGS_ADDED = 'tagsAdded';
export const TAGS_UPDATED = 'tagsUpdated';
export const TAGS_DELETED = 'tagsDeleted';

@Resolver(() => Tag)
export class TagsSubscriptionResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {}

  @Subscription(() => Tag, {
    name: 'tagCreated',
    description: 'A new tag was created',
  })
  tagCreated() {
    return this.pubSub.asyncIterableIterator(TAGS_ADDED);
  }

  @Subscription(() => Tag, {
    name: 'tagUpdated',
    description: 'A tag was updated',
  })
  tagUpdated() {
    return this.pubSub.asyncIterableIterator(TAGS_UPDATED);
  }

  @Subscription(() => Tag, {
    name: 'tagRemoved',
    description: 'A tag was deleted',
  })
  tagRemoved() {
    return this.pubSub.asyncIterableIterator(TAGS_DELETED);
  }
}
