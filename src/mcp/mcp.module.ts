import { Module } from '@nestjs/common';
import { TodosModule } from 'src/todos/todos.module';
import { TagsModule } from 'src/tags/tags.module';
import { UsersModule } from 'src/users/users.module';
import { TodoMcpTool } from './todo.mcp.tool';
import { TagMcpTool } from './tag.mcp.tool';
import { UserMcpTool } from './user.mcp.tool';

@Module({
  imports: [TodosModule, TagsModule, UsersModule],
  providers: [TodoMcpTool, TagMcpTool, UserMcpTool],
})
export class McpServerModule {}
