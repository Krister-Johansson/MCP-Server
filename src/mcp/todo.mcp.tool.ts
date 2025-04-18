import { Injectable, Logger } from '@nestjs/common';
import { Resource, Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { TodosService } from '../todos/todos.service';

@Injectable()
export class TodoMcpTool {
  private readonly logger = new Logger(TodoMcpTool.name);
  constructor(private readonly todosService: TodosService) {}

  @Tool({
    name: 'create-todo',
    description: `Creates a new todo item with the given title, optional description, and completion status.
    Example usage:
    - Create a simple todo: {"title": "Buy groceries"}
    - Create a detailed todo: {"title": "Write report", "description": "Complete the quarterly report", "completed": false}`,
    parameters: z.object({
      title: z.string().min(1).max(100).describe('The title of the todo item'),
      description: z
        .string()
        .max(500)
        .optional()
        .describe('Optional detailed description of the todo'),
      completed: z
        .boolean()
        .default(false)
        .describe('Whether the todo is completed or not'),
    }),
  })
  async createTodo({
    title,
    description,
    completed,
  }: {
    title: string;
    description?: string;
    completed: boolean;
  }) {
    this.logger.log(`Creating new todo: ${title}`);
    try {
      const todo = await this.todosService.create({
        title,
        description,
        completed,
      });

      this.logger.log(`Successfully created todo with ID: ${todo.id}`);
      return {
        content: [{ type: 'text', text: `Created todo with ID: ${todo.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to create todo: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to create todo: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get-todo',
    description: `Retrieves a todo item by its unique identifier.
    Example usage:
    - Get a todo: {"id": "123"}`,
    parameters: z.object({
      id: z.string().uuid().describe('The unique identifier of the todo item'),
    }),
  })
  async getTodo({ id }: { id: string }) {
    this.logger.log(`Fetching todo with ID: ${id}`);
    try {
      const todo = await this.todosService.findOne(id);
      this.logger.debug(`Found todo: ${JSON.stringify(todo)}`);
      return {
        content: [{ type: 'text', text: JSON.stringify(todo, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch todo ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to fetch todo: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'list-todos',
    description: `Retrieves all todo items in the system.
    Example usage:
    - List all todos: {}`,
    parameters: z.object({}).describe('No parameters required'),
  })
  async listTodos() {
    this.logger.log('Fetching all todos');
    try {
      const todos = await this.todosService.findAll();
      this.logger.debug(`Found ${todos.length} todos`);
      return {
        content: [{ type: 'text', text: JSON.stringify(todos, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to list todos: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to list todos: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'update-todo',
    description: `Updates an existing todo item with new values.
    Example usage:
    - Update title: {"id": "123", "title": "Updated title"}
    - Mark as completed: {"id": "123", "completed": true}
    - Update multiple fields: {"id": "123", "title": "New title", "description": "New description", "completed": true}`,
    parameters: z.object({
      id: z
        .string()
        .uuid()
        .describe('The unique identifier of the todo item to update'),
      title: z
        .string()
        .min(1)
        .max(100)
        .optional()
        .describe('New title for the todo'),
      description: z
        .string()
        .max(500)
        .optional()
        .describe('New description for the todo'),
      completed: z
        .boolean()
        .optional()
        .describe('New completion status for the todo'),
    }),
  })
  async updateTodo({ id, ...updateData }: { id: string; [key: string]: any }) {
    this.logger.log(
      `Updating todo ${id} with data: ${JSON.stringify(updateData)}`,
    );
    try {
      const todo = await this.todosService.update(id, updateData);
      this.logger.log(`Successfully updated todo ${id}`);
      return {
        content: [{ type: 'text', text: `Updated todo with ID: ${todo.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to update todo ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to update todo: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'delete-todo',
    description: `Deletes a todo item by its unique identifier.
    Example usage:
    - Delete a todo: {"id": "123"}`,
    parameters: z.object({
      id: z
        .string()
        .uuid()
        .describe('The unique identifier of the todo item to delete'),
    }),
  })
  async deleteTodo({ id }: { id: string }) {
    this.logger.log(`Deleting todo with ID: ${id}`);
    try {
      await this.todosService.remove(id);
      this.logger.log(`Successfully deleted todo ${id}`);
      return {
        content: [{ type: 'text', text: `Deleted todo with ID: ${id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to delete todo ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to delete todo: ${err.message}`,
          },
        ],
      };
    }
  }

  @Resource({
    uri: 'mcp://todo/{todoId}',
    name: 'Todo',
    description: 'A single todo item resource in JSON format',
    mimeType: 'application/json',
  })
  async getTodoResource({ uri, todoId }: { uri: string; todoId: string }) {
    this.logger.log(`Fetching todo resource ${todoId}`);
    try {
      const todo = await this.todosService.findOne(todoId);
      this.logger.debug(`Returning todo resource: ${JSON.stringify(todo)}`);
      return {
        contents: [
          {
            uri,
            text: JSON.stringify(todo),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch todo resource ${todoId}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        contents: [
          {
            uri,
            text: JSON.stringify({ error: err.message }),
            mimeType: 'application/json',
          },
        ],
      };
    }
  }

  @Resource({
    uri: 'mcp://todos',
    name: 'Todos',
    description: 'A collection of all todo items in JSON format',
    mimeType: 'application/json',
  })
  async getTodosResource({ uri }: { uri: string }) {
    this.logger.log('Fetching todos collection resource');
    try {
      const todos = await this.todosService.findAll();
      this.logger.debug(`Returning ${todos.length} todos as resource`);
      return {
        contents: [
          { uri, text: JSON.stringify(todos), mimeType: 'application/json' },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch todos resource: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        contents: [
          {
            uri,
            text: JSON.stringify({ error: err.message }),
            mimeType: 'application/json',
          },
        ],
      };
    }
  }
}
