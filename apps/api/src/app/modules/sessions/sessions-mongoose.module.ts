import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from '../tasks/schemas';
import { Session, SessionSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class SessionsMongooseModule {}
