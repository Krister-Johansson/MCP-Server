import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateTodoInput {
  @ApiProperty()
  @IsString()
  @Field(() => String)
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  completed?: boolean;
}
