import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import { UsersService } from 'src/users/users.service';
import { TodosController } from './todos.controller';
import { TodosMutationResolver } from './todos.mutation.resolver';
import { TodosQueryResolver } from './todos.query.resolver';
import { TodosService } from './todos.service';
import { TodosSubscriptionResolver } from './todos.subscription.resolver';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    TagsService,
    UsersService,
    PrismaService,
    TodosQueryResolver,
    TodosMutationResolver,
    TodosSubscriptionResolver,
  ],
  exports: [TodosService],
})
export class TodosModule {}
