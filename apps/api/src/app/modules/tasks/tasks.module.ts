import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CommonModule } from '../../common/common.module';
import { grpcClientOptions } from '../../common/options';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

/**
 * Tasks module
 */
@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: 'Submitter',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
