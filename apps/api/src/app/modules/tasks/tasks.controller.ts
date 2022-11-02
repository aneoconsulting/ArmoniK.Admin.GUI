import { Pagination } from '@armonik.admin.gui/armonik-typing';
import {
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { Task } from './schemas';
import { TasksService } from './tasks.service';
import { catchError } from 'rxjs';
import { GrpcErrorService } from '../../common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

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
    @Query('_id') id?: string,
    @Query('status') status?: string | string[]
  ): Promise<Pagination<Task>> {
    const formattedStatus = [];
    if (status) {
      if (Array.isArray(status)) {
        status.forEach((s) => {
          formattedStatus.push(parseInt(s, 10));
        });
      } else {
        formattedStatus.push(parseInt(status, 10));
      }
    }

    const tasks = await this.tasksService.findAllPaginated(
      page,
      limit,
      sessionId,
      orderBy,
      order,
      id,
      formattedStatus
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
  cancel(@Body('tasksId') tasksId: string[], @Headers() headers) {
    return this.tasksService
      .cancelMany(
        tasksId,
        headers['X-Certificate-Client-CN'] ?? '',
        headers['X-Certificate-Client-Fingerprint'] ?? ''
      )
      .pipe(catchError((err) => this.grpcErrorService.handleError(err)));
  }
}
