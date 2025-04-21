import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Todo } from '@prisma/client';
import { Todo as TodoType } from 'src/todos/entities/todo.entity';
import { TodosService } from 'src/todos/todos.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersQueryResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly todosService: TodosService,
  ) {}

  @Query(() => [User], {
    name: 'users',
    description: 'Get all users',
  })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Query(() => User, {
    name: 'user',
    description: 'Get a user by ID',
  })
  async findOne(@Args('id', { type: () => ID }) id: string) {
    return await this.usersService.findOne(id);
  }

  @ResolveField(() => [TodoType])
  async todos(@Parent() user: User): Promise<Todo[]> {
    return await this.todosService.findByUserId(user.id);
  }
}
