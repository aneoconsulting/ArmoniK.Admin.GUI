import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
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
  async index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('appName') appName: string
  ): Promise<Pagination<Session>> {
    const sessions = await this.sessionsService.findAllPaginated(
      page,
      limit,
      appName
    );

    return sessions;
  }

  /**
   * Get one session by id
   *
   * @param id Id of the session
   *
   * @returns Session
   */
  @Get('/:id')
  @ApiOkResponse({ description: 'Session found' })
  @ApiNotFoundResponse({ description: 'Session not found' })
  async show(@Param('id') id: string): Promise<Session> {
    const session = await this.sessionsService.findOne(id);

    if (!session) {
      throw new NotFoundException();
    }

    return session;
  }
}
