import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  /**
   * Used to view a message to check if the API is up and running.
   */
  @Get()
  index(): { message: string; version: string } {
    return {
      message: 'Welcome to ArmoniK GUI API',
      version: '0.7.0',
    };
  }

  /**
   * Verify if Seq is up and running.
   */
  @Get('/seq/ping')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Seq not found' })
  seq(): { status: string } {
    if (!process.env.Seq__Endpoint) {
      throw new NotFoundException('Seq not found');
    }

    return {
      status: 'ok',
    };
  }
}
