import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Todo } from '../../todos/entities/todo.entity';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  todos: Todo[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
