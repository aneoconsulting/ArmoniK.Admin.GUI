import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService } from './services';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PaginationService],
})
export class CoreModule {}
