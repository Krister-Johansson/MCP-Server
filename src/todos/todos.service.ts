import { Injectable, Inject } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import {
  TODOS_ADDED,
  TODOS_UPDATED,
  TODOS_DELETED,
} from './todos.subscription.resolver';

@Injectable()
export class TodosService {
  constructor(
    readonly prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async create(createTodoDto: CreateTodoInput): Promise<Todo> {
    const todo = await this.prisma.todo.create({
      data: createTodoDto,
    });
    await this.pubSub.publish(TODOS_ADDED, { [TODOS_ADDED]: todo });
    return todo;
  }

  findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  findOne(id: string): Promise<Todo | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoInput): Promise<Todo> {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    const updatedTodo = await this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
    await this.pubSub.publish(TODOS_UPDATED, { [TODOS_UPDATED]: updatedTodo });
    return updatedTodo;
  }

  async remove(id: string): Promise<Todo> {
    const todo = await this.findOne(id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found`);
    }
    const deletedTodo = await this.prisma.todo.delete({
      where: { id },
    });
    await this.pubSub.publish(TODOS_DELETED, { [TODOS_DELETED]: deletedTodo });
    return deletedTodo;
  }
}
