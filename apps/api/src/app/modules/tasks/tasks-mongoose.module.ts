import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultSchema } from '../results/schemas';
import { TaskSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Task', schema: TaskSchema },
      { name: 'Result', schema: ResultSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class TasksMongooseModule {}
