import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Task } from './schemas';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<Pagination<Task>> {
    return this.tasksService.findAllPaginated(page, limit);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Task found' })
  show(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }
}
