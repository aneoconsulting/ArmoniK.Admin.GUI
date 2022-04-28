import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from '../grpc-client.options';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'SUBMITTER_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
