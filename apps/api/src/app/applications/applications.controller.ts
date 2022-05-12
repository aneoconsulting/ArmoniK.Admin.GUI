import { Application } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get } from '@nestjs/common';

@Controller('applications')
export class ApplicationsController {
  @Get('')
  index(): Application[] {
    return [
      { id: 'e5c7ae5c-5861-4607-aa7b-44ce7eb418d8' },
      { id: '38c19fd5-01c2-4151-8142-c76f1bc5aeb1' },
      { id: '0875159b-2a8c-4344-99e4-07b7b659a11f' },
      { id: 'd45e4704-7543-4ced-93be-9e2b63a600c3' },
    ];
  }
}
