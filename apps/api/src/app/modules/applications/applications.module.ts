import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ApplicationsMongooseModule } from './applications-mongoose.module';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [CommonModule, ApplicationsMongooseModule],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
