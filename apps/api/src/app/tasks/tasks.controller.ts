import { Controller, Get, Param } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Get()
  findAll(): string {
    return 'This action returns all tasks';
  }

  @Get('/:id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} task`;
  }

  @Get('/count')
  count(): string {
    return 'This action returns the number of tasks';
  }
}
