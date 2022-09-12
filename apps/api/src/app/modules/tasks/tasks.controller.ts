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
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { GrpcErrorService } from '../../core';
import { Task } from './schemas';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private grpcErrorService: GrpcErrorService
  ) {}

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
    @Query('sessionId') sessionId: string,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
    @Query('taskId') taskId?: string,
    @Query('Status') status?: string
  ): Promise<Pagination<Task>> {
    const tasks = await this.tasksService.findAllPaginated(
      page,
      limit,
      sessionId,
      orderBy,
      order,
      taskId,
      status ? Number(status) : undefined
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
  @ApiOkResponse({ description: 'Task found' })
  @ApiNotFoundResponse({ description: 'Task not found' })
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
   * @param taskFilter Task filter
   */
  @Put('/cancel-many')
  @ApiNotFoundResponse({ description: 'Not found' })
  cancel(@Body('tasksId') tasksId: string[]) {
    return this.tasksService
      .cancelMany(tasksId)
      .pipe(catchError((err) => this.grpcErrorService.handleError(err)));
  }
}
