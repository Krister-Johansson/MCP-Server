import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
