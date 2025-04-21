import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUUID,
  IsArray,
  ValidateIf,
} from 'class-validator';

import { Type } from 'class-transformer';
import { Priority } from '../enums/priority.enum';

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

  @ApiProperty({ enum: Priority, default: Priority.MEDIUM })
  @Field(() => Priority, { defaultValue: Priority.MEDIUM })
  priority: Priority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o: CreateTodoInput) => o.dueDate != null)
  @Field(() => Date, { nullable: true })
  startDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ValidateIf(
    (o: CreateTodoInput) => {
      if (o.startDate && o.dueDate) {
        return o.startDate <= o.dueDate;
      }
      return true;
    },
    { message: 'Due date must be after start date' },
  )
  @Field(() => Date, { nullable: true })
  dueDate?: Date;

  @ApiProperty()
  @IsUUID()
  @Field(() => String)
  userId: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}
