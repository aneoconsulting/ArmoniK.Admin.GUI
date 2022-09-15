import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ResultsService } from './results.service';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  async index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('SessionId') SessionId: string,
    @Query('OwnerTaskId') OwnerTaskId: string,
    @Query('Status') Status: string
  ) {
    return this.resultsService.findAllPaginated(
      page,
      limit,
      orderBy,
      order,
      SessionId,
      OwnerTaskId,
      Status
    );
  }
}
