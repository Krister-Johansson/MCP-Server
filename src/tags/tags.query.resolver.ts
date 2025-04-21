import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { TodosService } from 'src/todos/todos.service';
import { Todo } from '@prisma/client';
import { Todo as TodoType } from 'src/todos/entities/todo.entity';

@Resolver(() => Tag)
export class TagsQueryResolver {
  constructor(
    private readonly tagsService: TagsService,
    private readonly todosService: TodosService,
  ) {}

  @Query(() => [Tag], {
    name: 'tags',
    description: 'Retrieve all tags',
  })
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Query(() => Tag, {
    name: 'tag',
    description: 'Retrieve a single tag by ID',
  })
  async findOne(
    @Args('id', {
      type: () => ID,
      description: 'The ID of the tag to retrieve',
    })
    id: string,
  ) {
    return await this.tagsService.findOne(id);
  }

  @ResolveField(() => [TodoType])
  async todos(@Parent() tag: Tag): Promise<Todo[]> {
    return await this.todosService.findByTagId(tag.id);
  }
}
