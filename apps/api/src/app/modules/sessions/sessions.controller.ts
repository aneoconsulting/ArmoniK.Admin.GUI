import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Session } from './schemas';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Get all sessions using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of sessions
   */
  @Get()
  index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('appName') appName: string
  ): Promise<Pagination<Session>> {
    return this.sessionsService.findAllPaginated(page, limit, appName);
  }

  /**
   * Get one session by id
   *
   * @param id Id of the session
   *
   * @returns Session
   */
  @Get('/:id')
  show(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.findOne(id);
  }
}
