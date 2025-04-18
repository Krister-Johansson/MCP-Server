import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(readonly prisma: PrismaService) {}
  create(createTodoDto: CreateTodoInput): Promise<Todo> {
    return this.prisma.todo.create({
      data: createTodoDto,
    });
  }

  findAll(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  findOne(id: string): Promise<Todo | null> {
    return this.prisma.todo.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTodoDto: UpdateTodoInput): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  remove(id: string): Promise<Todo> {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}
