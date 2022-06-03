import { Module } from '@nestjs/common';
import { PaginationService } from '../../core';
import { SharedModule } from '../../shared/';
import { SessionsMongooseModule } from './sessions-mongoose.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

/**
 * Sessions module
 */
@Module({
  imports: [SharedModule, SessionsMongooseModule],
  controllers: [SessionsController],
  providers: [SessionsService, PaginationService],
})
export class SessionsModule {}
