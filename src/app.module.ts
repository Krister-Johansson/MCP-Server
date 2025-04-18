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
@Module({
  imports: [
    LoggerModule.forRoot(),
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
