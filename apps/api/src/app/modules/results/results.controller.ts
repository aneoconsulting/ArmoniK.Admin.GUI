import { PaginationMeta } from '@armonik.admin.gui/armonik-typing';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiFoundResponse, ApiOkResponse } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { ResultsService } from './results.service';
import { Result } from './schemas';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Get()
  @ApiOkResponse({ description: 'Get all results' })
  @ApiFoundResponse({ description: 'Results found' })
  async index(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('orderBy') orderBy: string,
    @Query('order') order: string,
    @Query('_id') id: string,
    @Query('SessionId') sessionId: string,
    @Query('OwnerTaskId') ownerTaskId: string,
    @Query('Status') status: string
  ): Promise<{
    meta: PaginationMeta;
    data: (Document<string, any, Result> & Result)[];
  }> {
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
