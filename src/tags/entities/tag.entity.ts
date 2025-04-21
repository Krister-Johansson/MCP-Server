import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Todo } from '../../todos/entities/todo.entity';

@ObjectType()
export class Tag {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  color?: string;

  todos: Todo[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
