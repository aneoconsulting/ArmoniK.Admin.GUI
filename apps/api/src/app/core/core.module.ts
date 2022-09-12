import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService, GrpcErrorService } from './services';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PaginationService, GrpcErrorService],
})
export class CoreModule {}
