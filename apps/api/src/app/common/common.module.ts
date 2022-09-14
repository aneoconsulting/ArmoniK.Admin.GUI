import { Module } from '@nestjs/common';
import {
  GrpcErrorService,
  PaginationService,
  SettingsService,
} from './services';

@Module({
  providers: [PaginationService, GrpcErrorService, SettingsService],
  exports: [PaginationService, GrpcErrorService, SettingsService],
})
export class CommonModule {}
