import { Controller, Param, Post } from '@nestjs/common';

@Controller('sessions')
export class SessionsController {
  @Post(':id/close')
  close(@Param('id') id: string) {
    console.log('close', id);
    return {
      id,
      cancelled: true,
    };
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string) {
    return {
      id,
      restored: true,
    };
  }
}
