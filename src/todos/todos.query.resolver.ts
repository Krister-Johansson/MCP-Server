import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Tag, Todo, User } from '@prisma/client';
import { Tag as TagType } from 'src/tags/entities/tag.entity';
import { TagsService } from 'src/tags/tags.service';
import { User as UserType } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Todo as TodoType } from './entities/todo.entity';
import { TodosService } from './todos.service';

@Resolver(() => TodoType)
export class TodosQueryResolver {
  constructor(
    private readonly todosService: TodosService,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  @Query(() => [TodoType], {
    name: 'todos',
    description: 'Get all todos',
  })
  async todos(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Query(() => TodoType, {
    name: 'todo',
    description: 'Get a todo by ID',
  })
  async todo(@Args('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @ResolveField(() => UserType)
  async user(@Parent() todo: Todo): Promise<User> {
    return await this.usersService.findOne(todo.userId);
  }

  @ResolveField(() => [TagType])
  async tags(@Parent() todo: Todo): Promise<Tag[]> {
    return await this.tagsService.findByTodoId(todo.id);
  }
}
