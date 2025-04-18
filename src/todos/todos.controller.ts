import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The todo has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or failed to create todo.',
  })
  @ApiBody({ type: CreateTodoInput })
  create(@Body() createTodoDto: CreateTodoInput) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todos have been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to fetch todos.',
  })
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo has been successfully retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid todo ID or failed to fetch todo.',
  })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by id' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or failed to update todo.',
  })
  @ApiBody({ type: UpdateTodoInput })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoInput) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by id' })
  @ApiParam({ name: 'id', description: 'Todo ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The todo has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid todo ID or failed to delete todo.',
  })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
