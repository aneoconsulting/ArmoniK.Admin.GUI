import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  /**
   * Find all applications
   *
   * @returns Applications
   */
  @Get()
  async findAll(): Promise<Application[]> {
    const applications = await this.applicationsService.findAll();

    return applications;
  }

  /**
   * Find all errors with pagination
   *
   * @return Pagination of ApplicationError
   */
  @Get('/errors')
  async findAllWithErrorsPaginated(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
    @Query('Options.Options.GridAppName') applicationName?: string,
    @Query('Options.Options.GridAppVersion') applicationVersion?: string,
    @Query('SessionId') sessionId?: string,
    @Query('EndDate') errorAt?: string
  ): Promise<Pagination<ApplicationError>> {
    const errors = await this.applicationsService.findAllWithErrorsPaginated(
      page,
      limit,
      orderBy,
      order,
      applicationName,
      applicationVersion,
      sessionId,
      errorAt
    );

    return errors;
  }
}
