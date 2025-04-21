import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { CreateTagInput } from './dto/create-tag.input';
import { UpdateTagInput } from './dto/update-tag.input';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';

@Resolver(() => Tag)
export class TagsMutationResolver {
  constructor(private readonly tagsService: TagsService) {}

  @Mutation(() => Tag, {
    name: 'createTag',
    description: 'Create a new tag with the given name and optional color',
  })
  async createTag(
    @Args('createTagInput', {
      description: 'The input data for creating a tag',
    })
    createTagInput: CreateTagInput,
  ) {
    return await this.tagsService.create(createTagInput);
  }

  @Mutation(() => Tag, {
    name: 'updateTag',
    description: 'Update an existing tag by ID',
  })
  async updateTag(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTagInput', {
      description: 'The input data for updating a tag',
    })
    updateTagInput: UpdateTagInput,
  ) {
    return await this.tagsService.update(id, updateTagInput);
  }

  @Mutation(() => Tag, {
    name: 'removeTag',
    description: 'Remove a tag by ID',
  })
  async removeTag(
    @Args('id', {
      type: () => ID,
      description: 'The ID of the tag to remove',
    })
    id: string,
  ) {
    return await this.tagsService.remove(id);
  }
}
