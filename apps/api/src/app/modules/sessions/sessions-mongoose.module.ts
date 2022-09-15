import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Result, ResultSchema } from '../results/schemas';
import { Task, TaskSchema } from '../tasks/schemas';
import { Session, SessionSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SessionsMongooseModule {}
