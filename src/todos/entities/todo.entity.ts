import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Todo {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Boolean)
  completed: boolean;

  @Field(() => User)
  user: User;

  @Field(() => [Tag])
  tags: Tag[];

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
