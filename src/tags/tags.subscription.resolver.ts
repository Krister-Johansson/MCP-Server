import { Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Tag } from './entities/tag.entity';

const pubSub = new PubSub();

export const TAGS_ADDED = 'tagsAdded';
export const TAGS_UPDATED = 'tagsUpdated';
export const TAGS_DELETED = 'tagsDeleted';

@Resolver(() => Tag)
export class TagsSubscriptionResolver {
  @Subscription(() => Tag, {
    name: 'tagCreated',
    description: 'A new tag was created',
  })
  tagCreated() {
    return pubSub.asyncIterableIterator(TAGS_ADDED);
  }

  @Subscription(() => Tag, {
    name: 'tagUpdated',
    description: 'A tag was updated',
  })
  tagUpdated() {
    return pubSub.asyncIterableIterator(TAGS_UPDATED);
  }

  @Subscription(() => Tag, {
    name: 'tagRemoved',
    description: 'A tag was deleted',
  })
  tagRemoved() {
    return pubSub.asyncIterableIterator(TAGS_DELETED);
  }
}
