import { Pagination } from '@armonik.admin.gui/armonik-typing';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
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
  async index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('sessionId') sessionId: string
  ): Promise<Pagination<Task>> {
    const tasks = await this.tasksService.findAllPaginated(
      page,
      limit,
      sessionId
    );

    return tasks;
  }

  /**
   * Get one task by id
   *
   * @param id Id of the task
   *
   * @returns Task
   */
  @Get('/:id')
  async show(@Param('id') id: string): Promise<Task> {
    const task = await this.tasksService.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    return task;
  }

  /**
   * Cancel tasks by ids
   *
   * @param ids Ids of the tasks
   *
   * @returns Tasks
   */
  @Put('/cancel')
  cancelMany(@Body() body: string[]): Promise<Record<string, never>> {
    return this.tasksService.cancelMany(body);
  }
}
