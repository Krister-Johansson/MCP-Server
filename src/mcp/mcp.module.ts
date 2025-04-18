import { Module } from '@nestjs/common';
import { TodosModule } from 'src/todos/todos.module';
import { TodoMcpTool } from './todo.mcp.tool';

@Module({
  imports: [TodosModule],
  providers: [TodoMcpTool],
})
export class McpServerModule {}
