import { Controller, Get } from '@nestjs/common';
import { Session } from './schemas';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  index(): Promise<Session[]> {
    return this.sessionsService.findAll();
  }
}
