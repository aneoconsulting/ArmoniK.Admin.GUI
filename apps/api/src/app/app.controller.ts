import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Used to view a message to check if the API is up and running.
   */
  @Get()
  index() {
    return { message: 'Welcome to ArmoniK GUI API', version: '0.2.0' };
  }
}
