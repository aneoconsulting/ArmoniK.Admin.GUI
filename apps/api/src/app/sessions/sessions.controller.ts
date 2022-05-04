import { Controller, Get, Param } from '@nestjs/common';

@Controller('sessions')
export class SessionsController {
  @Get()
  findAll(): string {
    return 'This action returns all sessions';
  }

  @Get('/:id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} session`;
  }

  @Get('/:id/close')
  close(@Param('id') id: string): string {
    return `This action closes a #${id} session`;
  }

  @Get('/:id/reopen')
  reopen(@Param('id') id: string): string {
    return `This action reopens a #${id} session`;
  }

  @Get('/count')
  count(): string {
    return 'This action returns the number of sessions';
  }
}
