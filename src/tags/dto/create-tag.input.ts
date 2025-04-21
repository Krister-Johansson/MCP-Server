import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Matches } from 'class-validator';

@InputType()
export class CreateTagInput {
  @ApiProperty({ description: 'The name of the tag' })
  @IsString()
  @Field(() => String, { description: 'The name of the tag' })
  name: string;

  @ApiProperty({
    required: false,
    description: 'Hex color code for the tag (e.g., #FF0000)',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color code (e.g., #FF0000)',
  })
  @Field(() => String, {
    nullable: true,
    description: 'Hex color code for the tag (e.g., #FF0000)',
  })
  color?: string;
}
