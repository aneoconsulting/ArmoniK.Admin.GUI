import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../../common';
import { CommonModule } from '../../common/common.module';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

/**
 * Sessions module
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
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
