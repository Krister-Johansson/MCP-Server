import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TodosQueryResolver } from './todos.resolver.query';
import { TodosMutationResolver } from './todos.resolver.mutation';

@Module({
  controllers: [TodosController],
  providers: [
    TodosService,
    PrismaService,
    TodosQueryResolver,
    TodosMutationResolver,
  ],
})
export class TodosModule {}
