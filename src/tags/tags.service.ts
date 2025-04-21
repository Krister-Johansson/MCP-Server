import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Tag } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import {
  TAGS_ADDED,
  TAGS_DELETED,
  TAGS_UPDATED,
} from './tags.subscription.resolver';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);
  constructor(
    private prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async create(createTagInput: CreateTagInput): Promise<Tag> {
    this.logger.log(`Creating new tag with name: ${createTagInput.name}`);

    const tag = await this.prisma.tag.create({
      data: createTagInput,
      include: {
        todos: true,
      },
    });
    this.logger.log(`Successfully created tag with ID: ${tag.id}`);

    await this.pubSub.publish(TAGS_ADDED, { [TAGS_ADDED]: tag });
    this.logger.debug(`Published ${TAGS_ADDED} event for tag ID: ${tag.id}`);

    return tag;
  }

  async findByTodoId(todoId: string): Promise<Tag[]> {
    this.logger.log(`Fetching tags for todo ID: ${todoId}`);

    const tags = await this.prisma.tag.findMany({
      where: {
        todos: {
          some: {
            id: todoId,
          },
        },
      },
    });

    this.logger.debug(`Found ${tags.length} tags`);

    return tags;
  }

  async findAll(): Promise<Tag[]> {
    this.logger.log('Fetching all tags');

    const tags = await this.prisma.tag.findMany();
    this.logger.debug(`Found ${tags.length} tags`);

    return tags;
  }

  async findOne(id: string): Promise<Tag> {
    this.logger.log(`Fetching tag with ID: ${id}`);

    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagInput: UpdateTagInput): Promise<Tag> {
    this.logger.log(`Updating tag with ID: ${id}`);

    const tag = await this.prisma.tag.update({
      where: { id },
      data: updateTagInput,
    });
    this.logger.log(`Successfully updated tag with ID: ${id}`);

    await this.pubSub.publish(TAGS_UPDATED, { [TAGS_UPDATED]: tag });
    this.logger.debug(`Published ${TAGS_UPDATED} event for tag ID: ${id}`);

    return tag;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`Deleting tag with ID: ${id}`);

    const tag = await this.prisma.tag.delete({
      where: { id },
    });
    this.logger.log(`Successfully deleted tag with ID: ${id}`);

    await this.pubSub.publish(TAGS_DELETED, { [TAGS_DELETED]: tag });
    this.logger.debug(`Published ${TAGS_DELETED} event for tag ID: ${id}`);

    return true;
  }
}
