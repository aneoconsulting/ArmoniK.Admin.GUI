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
    @Query('_id') id: string,
    @Query('SessionId') sessionId: string,
    @Query('OwnerTaskId') ownerTaskId: string,
    @Query('Status') status: string
  ) {
    return this.resultsService.findAllPaginated(
      page,
      limit,
      orderBy,
      order,
      id,
      sessionId,
      ownerTaskId,
      status
    );
  }
}
