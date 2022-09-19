import { Body, Controller, Put } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { GrpcErrorService } from '../../common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private grpcErrorService: GrpcErrorService
  ) {}

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
