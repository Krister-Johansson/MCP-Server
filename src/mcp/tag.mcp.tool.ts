import { Injectable, Logger } from '@nestjs/common';
import { Resource, Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { TagsService } from '../tags/tags.service';

// Define the create tag parameter schema
const createTagSchema = z.object({
  name: z.string().min(1).max(50).describe('The name of the tag'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .describe('Optional hex color code for the tag (e.g., #FF0000)'),
});

// Define the update tag parameter schema
const updateTagSchema = z.object({
  id: z.string().uuid().describe('The unique identifier of the tag to update'),
  name: z.string().min(1).max(50).optional().describe('New name for the tag'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .describe('New hex color code for the tag (e.g., #FF0000)'),
});

// Infer types from schemas
type CreateTagParams = z.infer<typeof createTagSchema>;
type UpdateTagParams = z.infer<typeof updateTagSchema>;

@Injectable()
export class TagMcpTool {
  private readonly logger = new Logger(TagMcpTool.name);
  constructor(private readonly tagsService: TagsService) {}

  @Tool({
    name: 'create-tag',
    description: `Creates a new tag with a name and optional color.
    Example usage:
    - Create a simple tag: {"name": "Work"}
    - Create a colored tag: {"name": "Important", "color": "#FF0000"}`,
    parameters: createTagSchema,
  })
  async createTag(params: CreateTagParams) {
    this.logger.log(`Creating new tag: ${params.name}`);
    try {
      const tag = await this.tagsService.create(params);
      this.logger.log(`Successfully created tag with ID: ${tag.id}`);
      return {
        content: [{ type: 'text', text: `Created tag with ID: ${tag.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to create tag: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to create tag: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'get-tag',
    description: `Retrieves a tag by its unique identifier.
    Example usage:
    - Get a tag: {"id": "123"}`,
    parameters: z.object({
      id: z.string().uuid().describe('The unique identifier of the tag'),
    }),
  })
  async getTag({ id }: { id: string }) {
    this.logger.log(`Fetching tag with ID: ${id}`);
    try {
      const tag = await this.tagsService.findOne(id);
      this.logger.debug(`Found tag: ${JSON.stringify(tag)}`);
      return {
        content: [{ type: 'text', text: JSON.stringify(tag, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to fetch tag ${id}: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to fetch tag: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'list-tags',
    description: `Retrieves all tags in the system.
    Example usage:
    - List all tags: {}`,
    parameters: z.object({}).describe('No parameters required'),
  })
  async listTags() {
    this.logger.log('Fetching all tags');
    try {
      const tags = await this.tagsService.findAll();
      this.logger.debug(`Found ${tags.length} tags`);
      return {
        content: [{ type: 'text', text: JSON.stringify(tags, null, 2) }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to list tags: ${err.message}`, err.stack);
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to list tags: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'update-tag',
    description: `Updates an existing tag with new values.
    Example usage:
    - Update name: {"id": "123", "name": "Updated name"}
    - Update color: {"id": "123", "color": "#00FF00"}
    - Update both: {"id": "123", "name": "New name", "color": "#0000FF"}`,
    parameters: updateTagSchema,
  })
  async updateTag({ id, ...updateData }: UpdateTagParams) {
    this.logger.log(
      `Updating tag ${id} with data: ${JSON.stringify(updateData)}`,
    );
    try {
      const tag = await this.tagsService.update(id, {
        ...updateData,
      });
      this.logger.log(`Successfully updated tag ${id}`);
      return {
        content: [{ type: 'text', text: `Updated tag with ID: ${tag.id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to update tag ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to update tag: ${err.message}`,
          },
        ],
      };
    }
  }

  @Tool({
    name: 'delete-tag',
    description: `Deletes a tag by its unique identifier.
    Example usage:
    - Delete a tag: {"id": "123"}`,
    parameters: z.object({
      id: z
        .string()
        .uuid()
        .describe('The unique identifier of the tag to delete'),
    }),
  })
  async deleteTag({ id }: { id: string }) {
    this.logger.log(`Deleting tag with ID: ${id}`);
    try {
      await this.tagsService.remove(id);
      this.logger.log(`Successfully deleted tag ${id}`);
      return {
        content: [{ type: 'text', text: `Deleted tag with ID: ${id}` }],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to delete tag ${id}: ${err.message}`,
        err.stack,
      );
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Failed to delete tag: ${err.message}`,
          },
        ],
      };
    }
  }

  @Resource({
    uri: 'mcp://tag/{tagId}',
    name: 'Tag',
    description: 'A single tag resource in JSON format',
    mimeType: 'application/json',
  })
  async getTagResource({ uri, tagId }: { uri: string; tagId: string }) {
    this.logger.log(`Fetching tag resource ${tagId}`);
    try {
      const tag = await this.tagsService.findOne(tagId);
      this.logger.debug(`Returning tag resource: ${JSON.stringify(tag)}`);
      return {
        contents: [
          {
            uri,
            text: JSON.stringify(tag),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch tag resource ${tagId}: ${err.message}`,
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
    uri: 'mcp://tags',
    name: 'Tags',
    description: 'A collection of all tags in JSON format',
    mimeType: 'application/json',
  })
  async getTagsResource({ uri }: { uri: string }) {
    this.logger.log('Fetching tags collection resource');
    try {
      const tags = await this.tagsService.findAll();
      this.logger.debug(`Returning ${tags.length} tags as resource`);
      return {
        contents: [
          { uri, text: JSON.stringify(tags), mimeType: 'application/json' },
        ],
      };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(
        `Failed to fetch tags resource: ${err.message}`,
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
