import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Session } from './schemas';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('appName') appName: string
  ): Promise<Pagination<Session>> {
    return this.sessionsService.findAllPaginated(page, limit, appName);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Session found' })
  async show(@Param('id') id: string): Promise<Session> {
    return this.sessionsService.findOne(id);
  }
}
