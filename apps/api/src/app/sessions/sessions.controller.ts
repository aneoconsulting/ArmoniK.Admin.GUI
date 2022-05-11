import { Session } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, Param, Post } from '@nestjs/common';

@Controller('sessions')
export class SessionsController {
  @Get('')
  index(): Session[] {
    return [
      {
        id: '9a65ae05-50f6-47b3-811d-51c8b27dda72',
        closed: false,
      },
      {
        id: '342e1b4c-15ba-4cfa-89f6-81f30fd5dfac',
        closed: false,
      },
      {
        id: 'ef91ba10-afd9-4a86-b9cc-65b5fe8d0a4d',
        closed: false,
      },
      {
        id: 'c4f927f3-5d82-48c3-a710-1f7fbb071940',
        closed: true,
      },
      {
        id: 'fabc0901-d8d1-4815-af76-71d7674f6cab',
        closed: false,
      },
    ];
  }

  @Post(':id/close')
  close(@Param('id') id: string): Session {
    return {
      id,
      closed: true,
    };
  }

  @Post(':id/reopen')
  reopen(@Param('id') id: string): Session {
    return {
      id,
      closed: false,
    };
  }
}
