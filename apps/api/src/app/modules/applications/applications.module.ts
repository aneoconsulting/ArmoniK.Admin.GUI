import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared';
import { ApplicationsMongooseModule } from './applications-mongoose.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [SharedModule, ApplicationsMongooseModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
