import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodosQueryResolver } from './todos.query.resolver';
import { TodosMutationResolver } from './todos.mutation.resolver';
import { TodosSubscriptionResolver } from './todos.subscription.resolver';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    PrismaService,
    TodosQueryResolver,
    TodosMutationResolver,
    TodosSubscriptionResolver,
  ],
  exports: [TodosService],
})
export class TodosModule {}
