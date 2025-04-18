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
  async todo(@Args('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }
}
