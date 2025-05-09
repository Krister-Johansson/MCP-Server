import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TodosService } from './todos.service';

import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo as TodoType } from './entities/todo.entity';
import { Todo } from '@prisma/client';

@Resolver(() => TodoType)
export class TodosMutationResolver {
  constructor(private readonly todosService: TodosService) {}

  @Mutation(() => TodoType, {
    name: 'createTodo',
    description: 'Create a new todo',
  })
  async createTodo(
    @Args('createTodoInput') createTodoInput: CreateTodoInput,
  ): Promise<Todo> {
    return this.todosService.create(createTodoInput);
  }

  @Mutation(() => TodoType, {
    name: 'updateTodo',
    description: 'Update a todo by ID',
  })
  async updateTodo(
    @Args('id') id: string,
    @Args('updateTodoInput') updateTodoInput: UpdateTodoInput,
  ): Promise<Todo> {
    return this.todosService.update(id, updateTodoInput);
  }

  @Mutation(() => Boolean, {
    name: 'deleteTodo',
    description: 'Delete a todo by ID',
  })
  async deleteTodo(@Args('id') id: string): Promise<boolean> {
    const todo = await this.todosService.findOne(id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    return this.todosService.remove(id);
  }
}
