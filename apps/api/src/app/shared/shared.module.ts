import { Module } from '@nestjs/common';
import { SettingsService } from './services';

@Module({
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SharedModule {}
