import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ResultsMongooseModule } from './results-mongoose.module';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

/**
 * Results module
 */
@Module({
  imports: [CommonModule, ResultsMongooseModule],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
