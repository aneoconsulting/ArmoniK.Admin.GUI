import { Controller, Get, Param } from '@nestjs/common';

@Controller('applications')
export class ApplicationsController {
  @Get()
  findAll(): string {
    return 'This action returns all applications';
  }

  @Get('/:id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} application`;
  }
}
