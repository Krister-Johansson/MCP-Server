import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
  })
  @ApiBody({ type: CreateTodoInput })
  create(@Body() createTodoDto: CreateTodoInput) {
    return this.todosService.create(createTodoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: 200,
    description: 'The todos have been successfully retrieved.',
  })
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully retrieved.',
  })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a todo by id' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
  })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoInput) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by id' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
