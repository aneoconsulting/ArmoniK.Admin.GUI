import { Module } from '@nestjs/common';
import { PaginationService } from '../../core';
import { TasksMongooseModule } from './tasks-mongoose.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

/**
 * Tasks module
 */
@Module({
  imports: [TasksMongooseModule],
  controllers: [TasksController],
  providers: [TasksService, PaginationService],
})
export class TasksModule {}
