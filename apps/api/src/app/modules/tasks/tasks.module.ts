import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  grpcClientOptions,
  GrpcErrorService,
  PaginationService,
} from '../../core';
import { SharedModule } from '../../shared';
import { TasksMongooseModule } from './tasks-mongoose.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

/**
 * Tasks module
 */
@Module({
  imports: [
    SharedModule,
    TasksMongooseModule,
    ClientsModule.register([
      {
        name: 'Submitter',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, PaginationService, GrpcErrorService],
})
export class TasksModule {}
