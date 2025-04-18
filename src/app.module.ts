import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@rekog/mcp-nest';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { GreetingTool } from './tool/greeting';
import { TodosModule } from './todos/todos.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    McpModule.forRoot({
      name: 'my-mcp-server',
      version: '1.0.0',
      sse: {
        pingEnabled: true,
        pingIntervalMs: 30000,
      },
    }),

    PrismaModule,

    TodosModule,
  ],
  controllers: [],
  providers: [GreetingTool],
})
export class AppModule {}
