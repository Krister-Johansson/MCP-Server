import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { McpModule } from '@rekog/mcp-nest';
import configuration from './config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { GreetingTool } from './tool/greeting';
import { TodosModule } from './todos/todos.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PubSubModule } from './pubsub/pubsub.module';
import { LoggerModule } from 'nestjs-pino';
import { GraphQLError } from 'graphql';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        formatters: {
          level: (label: string) => ({ level: label.toUpperCase() }),
          bindings: () => ({}),
          log: (obj: { context?: string; msg: string }) => {
            const context = obj.context ? `${obj.context}` : '';
            return { msg: `${obj.msg}`, context };
          },
        },
        ...(process.env.NODE_ENV !== 'production' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              singleLine: false,
              levelFirst: false,
              translateTime: 'yyyy-mm-dd HH:MM:ss',
              ignore: 'pid,hostname,context',
              messageFormat: '[{context}] {msg}',
            },
          },
        }),
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: true,
      subscriptions: {
        'graphql-ws': true,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
      formatError: (error: GraphQLError) => {
        const originalError = (error.extensions?.originalError ?? {}) as {
          message?: string;
          error?: string;
          statusCode?: number;
        };

        return {
          message: originalError.message || error.message,
          error: originalError.error || 'Internal Server Error',
          statusCode: originalError.statusCode || 500,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        };
      },
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
    PubSubModule,
    TodosModule,
  ],
  controllers: [],
  providers: [GreetingTool],
})
export class AppModule {}
