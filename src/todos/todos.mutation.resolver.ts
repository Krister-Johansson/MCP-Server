import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TodosService } from './todos.service';

import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from './entities/todo.entity';

@Resolver(() => Todo)
export class TodosMutationResolver {
  constructor(private readonly todosService: TodosService) {}

  @Mutation(() => Todo)
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
  ): Promise<Todo> {
    return this.todosService.create(createTodoInput);
  }

  @Mutation(() => Todo)
  async updateTodo(
    @Args('id') id: string,
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
  ): Promise<Todo | null> {
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    return this.todosService.update(id, updateTodoInput);
  }

  @Mutation(() => Todo)
  async deleteTodo(@Args('id') id: string): Promise<Todo | null> {
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    return this.todosService.remove(id);
  }
}
