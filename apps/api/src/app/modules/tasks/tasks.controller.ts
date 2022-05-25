import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Task } from './schemas';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Get all tasks using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of tasks
   */
  @Get()
  index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sessionId') sessionId: string
  ): Promise<Pagination<Task>> {
    return this.tasksService.findAllPaginated(page, limit, sessionId);
  }

  /**
   * Get one task by id
   *
   * @param id Id of the task
   *
   * @returns Task
   */
  @Get('/:id')
  show(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }
}
