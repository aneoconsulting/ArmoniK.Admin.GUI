import { Module } from '@nestjs/common';
import { GrpcErrorService, SettingsService } from './services';

@Module({
  providers: [SettingsService, GrpcErrorService],
  exports: [SettingsService, GrpcErrorService],
})
export class SharedModule {}
