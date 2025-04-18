import { Injectable, Inject, Logger } from '@nestjs/common';

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
  private readonly logger = new Logger(TodosService.name);
  constructor(
    readonly prisma: PrismaService,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) {}

  async create(createTodoDto: CreateTodoInput): Promise<Todo> {
    try {
      this.logger.log(`Creating new todo with title: ${createTodoDto.title}`);

      const todo = await this.prisma.todo.create({
        data: createTodoDto,
      });

      this.logger.log(`Successfully created todo with ID: ${todo.id}`);

      await this.pubSub.publish(TODOS_ADDED, { [TODOS_ADDED]: todo });

      this.logger.debug(
        `Published ${TODOS_ADDED} event for todo ID: ${todo.id}`,
      );

      return todo;
    } catch (error) {
      this.logger.error(
        `Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findAll(): Promise<Todo[]> {
    try {
      this.logger.log('Fetching all todos');

      const todos = await this.prisma.todo.findMany();

      this.logger.debug(`Found ${todos.length} todos`);

      return todos;
    } catch (error) {
      this.logger.error(
        `Failed to fetch todos: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Todo | null> {
    try {
      this.logger.log(`Fetching todo with ID: ${id}`);

      const todo = await this.prisma.todo.findUnique({
        where: { id },
      });
      if (todo) {
        this.logger.debug(`Found todo with ID: ${id}`);
      } else {
        this.logger.warn(`Todo with ID: ${id} not found`);
      }

      return todo;
    } catch (error) {
      this.logger.error(
        `Failed to fetch todo with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async update(id: string, updateTodoDto: UpdateTodoInput): Promise<Todo> {
    try {
      this.logger.log(`Updating todo with ID: ${id}`);

      const todo = await this.findOne(id);

      if (!todo) {
        this.logger.warn(`Todo with ID ${id} not found for update`);
        throw new Error(`Todo with ID ${id} not found`);
      }
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
    } catch (error) {
      this.logger.error(
        `Failed to update todo with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<Todo> {
    try {
      this.logger.log(`Deleting todo with ID: ${id}`);

      const todo = await this.findOne(id);
      if (!todo) {
        this.logger.warn(`Todo with ID ${id} not found for deletion`);
        throw new Error(`Todo with ID ${id} not found`);
      }

      const deletedTodo = await this.prisma.todo.delete({
        where: { id },
      });

      this.logger.log(`Successfully deleted todo with ID: ${id}`);

      await this.pubSub.publish(TODOS_DELETED, {
        [TODOS_DELETED]: deletedTodo,
      });

      this.logger.debug(`Published ${TODOS_DELETED} event for todo ID: ${id}`);

      return deletedTodo;
    } catch (error) {
      this.logger.error(
        `Failed to delete todo with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }
}
