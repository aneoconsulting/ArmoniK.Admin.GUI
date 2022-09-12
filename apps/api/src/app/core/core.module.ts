import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GrpcErrorService, PaginationService } from './services';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PaginationService, GrpcErrorService],
})
export class CoreModule {}
