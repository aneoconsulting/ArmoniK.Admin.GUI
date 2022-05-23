import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Used to view a message to check if the API is up and running.
   */
  @Get()
  index(): { message: string } {
    return { message: 'Welcome to ArmoniK GUI API' };
  }
}
