import { Controller, Get } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll(): Promise<Application[]> {
    return this.applicationsService.findAll();
  }
}
