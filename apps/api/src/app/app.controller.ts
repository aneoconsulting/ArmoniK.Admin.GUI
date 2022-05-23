import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  index(): { message: string } {
    return { message: 'Welcome to ArmoniK GUI API' };
  }
}
