import { Module } from '@nestjs/common';
import { PaginationService } from '../../core';
import { SharedModule } from '../../shared';
import { ApplicationsMongooseModule } from './applications-mongoose.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [SharedModule, ApplicationsMongooseModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, PaginationService],
})
export class ApplicationsModule {}
