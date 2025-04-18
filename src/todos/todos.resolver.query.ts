import { Args, Query, Resolver } from '@nestjs/graphql';
import { TodosService } from './todos.service';

import { Todo } from './entities/todo.entity';

@Resolver(() => Todo)
export class TodosQueryResolver {
  constructor(private readonly todosService: TodosService) {}

  @Query(() => [Todo])
  async todos(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Query(() => Todo)
  async todo(@Args('id') id: string): Promise<Todo | null> {
    return this.todosService.findOne(id);
  }

  // @Mutation(() => Todo)
  // async createTodo(
  //   @Args('createTodoInput') createTodoInput: CreateTodoInput,
  // ): Promise<Todo> {
  //   return this.todosService.create(createTodoInput);
  // }

  // @Mutation(() => Todo)
  // async updateTodo(
  //   @Args('id') id: string,
  //   @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
  // ): Promise<Todo> {
  //   return this.todosService.update(id, updateTodoInput);
  // }

  // @Mutation(() => Todo)
  // async deleteTodo(@Args('id') id: string): Promise<Todo> {
  //   return this.todosService.remove(id);
  // }
}
