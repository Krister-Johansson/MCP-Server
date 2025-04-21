import { Injectable, Logger } from '@nestjs/common';
import { Resource, Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { UsersService } from '../users/users.service';

// Define the create user parameter schema
const createUserSchema = z.object({
  email: z.string().email().describe('The email address of the user'),
  name: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .describe('Optional display name for the user'),
});

// Define the update user parameter schema
const updateUserSchema = z.object({
  id: z.string().uuid().describe('The unique identifier of the user to update'),
  email: z
    .string()
    .email()
    .optional()
    .describe('New email address for the user'),
  name: z
    .string()
    .min(1)
    .max(100)
    .optional()
    .describe('New display name for the user'),
});

// Infer types from schemas
type CreateUserParams = z.infer<typeof createUserSchema>;
type UpdateUserParams = z.infer<typeof updateUserSchema>;

@Injectable()
export class UserMcpTool {
  private readonly logger = new Logger(UserMcpTool.name);
  constructor(private readonly usersService: UsersService) {}

  @Tool({
    name: 'create-user',
    description: `Creates a new user with an email and optional name.
    Example usage:
    - Create a simple user: {"email": "user@example.com"}
    - Create a user with name: {"email": "user@example.com", "name": "John Doe"}`,
    parameters: createUserSchema,
  })
  async createUser(params: CreateUserParams) {
    this.logger.log(`Creating new user: ${params.email}`);
    try {
      const user = await this.usersService.create(params);
      this.logger.log(`Successfully created user with ID: ${user.id}`);
      return {
        content: [{ type: 'text', text: `Created user with ID: ${user.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to create user: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to create user: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get-user',
    description: `Retrieves a user by their unique identifier.
    Example usage:
    - Get a user: {"id": "123"}`,
    parameters: z.object({
      id: z.string().uuid().describe('The unique identifier of the user'),
    }),
  })
  async getUser({ id }: { id: string }) {
    this.logger.log(`Fetching user with ID: ${id}`);
    try {
      const user = await this.usersService.findOne(id);
      this.logger.debug(`Found user: ${JSON.stringify(user)}`);
      return {
        content: [{ type: 'text', text: JSON.stringify(user, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch user ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to fetch user: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'list-users',
    description: `Retrieves all users in the system.
    Example usage:
    - List all users: {}`,
    parameters: z.object({}).describe('No parameters required'),
  })
  async listUsers() {
    this.logger.log('Fetching all users');
    try {
      const users = await this.usersService.findAll();
      this.logger.debug(`Found ${users.length} users`);
      return {
        content: [{ type: 'text', text: JSON.stringify(users, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to list users: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to list users: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'update-user',
    description: `Updates an existing user with new values.
    Example usage:
    - Update email: {"id": "123", "email": "new@example.com"}
    - Update name: {"id": "123", "name": "Jane Doe"}
    - Update both: {"id": "123", "email": "jane@example.com", "name": "Jane Doe"}`,
    parameters: updateUserSchema,
  })
  async updateUser({ id, ...updateData }: UpdateUserParams) {
    this.logger.log(
      `Updating user ${id} with data: ${JSON.stringify(updateData)}`,
    );
    try {
      const user = await this.usersService.update(id, {
        ...updateData,
      });
      this.logger.log(`Successfully updated user ${id}`);
      return {
        content: [{ type: 'text', text: `Updated user with ID: ${user.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to update user ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to update user: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'delete-user',
    description: `Deletes a user by their unique identifier.
    Example usage:
    - Delete a user: {"id": "123"}`,
    parameters: z.object({
      id: z
        .string()
        .uuid()
        .describe('The unique identifier of the user to delete'),
    }),
  })
  async deleteUser({ id }: { id: string }) {
    this.logger.log(`Deleting user with ID: ${id}`);
    try {
      await this.usersService.remove(id);
      this.logger.log(`Successfully deleted user ${id}`);
      return {
        content: [{ type: 'text', text: `Deleted user with ID: ${id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to delete user ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to delete user: ${err.message}`,
          },
        ],
      };
    }
  }

  @Resource({
    uri: 'mcp://user/{userId}',
    name: 'User',
    description: 'A single user resource in JSON format',
    mimeType: 'application/json',
  })
  async getUserResource({ uri, userId }: { uri: string; userId: string }) {
    this.logger.log(`Fetching user resource ${userId}`);
    try {
      const user = await this.usersService.findOne(userId);
      this.logger.debug(`Returning user resource: ${JSON.stringify(user)}`);
      return {
        contents: [
          {
            uri,
            text: JSON.stringify(user),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch user resource ${userId}: ${err.message}`,
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
    uri: 'mcp://users',
    name: 'Users',
    description: 'A collection of all users in JSON format',
    mimeType: 'application/json',
  })
  async getUsersResource({ uri }: { uri: string }) {
    this.logger.log('Fetching users collection resource');
    try {
      const users = await this.usersService.findAll();
      this.logger.debug(`Returning ${users.length} users as resource`);
      return {
        contents: [
          { uri, text: JSON.stringify(users), mimeType: 'application/json' },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch users resource: ${err.message}`,
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
