import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Todo } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import {
  TODOS_ADDED,
  TODOS_DELETED,
  TODOS_UPDATED,
} from './todos.subscription.resolver';

@Injectable()
export class TodosService {
  private readonly logger = new Logger(TodosService.name);

  constructor(
    readonly prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async create(createTodoInput: CreateTodoInput): Promise<Todo> {
    this.logger.log(`Creating new todo with title: ${createTodoInput.title}`);

    const { tagIds, ...rest } = createTodoInput;

    const todo = await this.prisma.todo.create({
      data: {
        ...rest,
        tags:
          tagIds && tagIds.length > 0
            ? {
                connect: tagIds.map((id) => ({ id })),
              }
            : undefined,
      },
    });
    this.logger.log(`Successfully created todo with ID: ${todo.id}`);

    await this.pubSub.publish(TODOS_ADDED, { [TODOS_ADDED]: todo });
    this.logger.debug(`Published ${TODOS_ADDED} event for todo ID: ${todo.id}`);

    return todo;
  }

  async findAll(): Promise<Todo[]> {
    this.logger.log('Fetching all todos');

    const todos = await this.prisma.todo.findMany();
    this.logger.debug(`Found ${todos.length} todos`);

    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    this.logger.log(`Fetching todo with ID: ${id}`);

    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    this.logger.debug(`Found todo with ID: ${id}`);
    return todo;
  }

  async findByTagId(tagId: string): Promise<Todo[]> {
    this.logger.log(`Fetching todos by tag ID: ${tagId}`);

    const todos = await this.prisma.todo.findMany({
      where: {
        tags: {
          some: {
            id: tagId,
          },
        },
      },
    });

    this.logger.debug(`Found ${todos.length} todos by tag ID: ${tagId}`);

    return todos;
  }

  async findByUserId(userId: string): Promise<Todo[]> {
    this.logger.log(`Fetching todos by user ID: ${userId}`);

    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });

    this.logger.debug(`Found ${todos.length} todos by user ID: ${userId}`);

    return todos;
  }

  async update(id: string, updateTodoDto: UpdateTodoInput): Promise<Todo> {
    this.logger.log(`Updating todo with ID: ${id}`);

    const updatedTodo = await this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
    this.logger.log(`Successfully updated todo with ID: ${id}`);

    await this.pubSub.publish(TODOS_UPDATED, {
      [TODOS_UPDATED]: updatedTodo,
    });
    this.logger.debug(`Published ${TODOS_UPDATED} event for todo ID: ${id}`);

    return updatedTodo;
  }

  async remove(id: string): Promise<boolean> {
    this.logger.log(`Deleting todo with ID: ${id}`);

    const deletedTodo = await this.prisma.todo.delete({
      where: { id },
    });
    this.logger.log(`Successfully deleted todo with ID: ${id}`);

    await this.pubSub.publish(TODOS_DELETED, {
      [TODOS_DELETED]: deletedTodo,
    });
    this.logger.debug(`Published ${TODOS_DELETED} event for todo ID: ${id}`);

    return true;
  }
}
