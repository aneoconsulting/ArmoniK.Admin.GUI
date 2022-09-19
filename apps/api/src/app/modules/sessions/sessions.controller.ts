import { Controller, Param, Put } from '@nestjs/common';
import { ApiNotFoundResponse } from '@nestjs/swagger';
import { catchError } from 'rxjs';
import { GrpcErrorService } from '../../common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private grpcErrorService: GrpcErrorService
  ) {}

  /**
   * Cancel a session
   *
   * @param sessionId Id of the session
   */
  @Put('/:id/cancel')
  @ApiNotFoundResponse({ description: 'Not found' })
  async cancel(@Param('id') sessionId: string) {
    return this.sessionsService
      .cancel(sessionId)
      .pipe(catchError((err) => this.grpcErrorService.handleError(err)));
  }
}
