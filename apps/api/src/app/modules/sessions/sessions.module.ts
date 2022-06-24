import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import {
  grpcClientOptions,
  GrpcErrorService,
  PaginationService,
} from '../../core';
import { SharedModule } from '../../shared/';
import { SessionsMongooseModule } from './sessions-mongoose.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

/**
 * Sessions module
 */
@Module({
  imports: [
    SharedModule,
    SessionsMongooseModule,
    ClientsModule.register([
      {
        name: 'Submitter',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, PaginationService, GrpcErrorService],
})
export class SessionsModule {}
