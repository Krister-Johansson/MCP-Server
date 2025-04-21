import { Module } from '@nestjs/common';
import { TodosService } from 'src/todos/todos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersMutationResolver } from './users.mutation.resolver';
import { UsersQueryResolver } from './users.query.resolver';
import { UsersService } from './users.service';
import { UsersSubscriptionResolver } from './users.subscription.resolver';

@Module({
  imports: [PrismaModule],
  providers: [
    UsersService,
    TodosService,
    UsersQueryResolver,
    UsersMutationResolver,
    UsersSubscriptionResolver,
  ],
  exports: [UsersService],
})
export class UsersModule {}
