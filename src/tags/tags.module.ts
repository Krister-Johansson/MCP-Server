import { Module } from '@nestjs/common';
import { TodosService } from 'src/todos/todos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TagsMutationResolver } from './tags.mutation.resolver';
import { TagsQueryResolver } from './tags.query.resolver';
import { TagsService } from './tags.service';
import { TagsSubscriptionResolver } from './tags.subscription.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    TagsService,
    TodosService,
    TagsQueryResolver,
    TagsMutationResolver,
    TagsSubscriptionResolver,
  ],
  exports: [TagsService],
})
export class TagsModule {}
