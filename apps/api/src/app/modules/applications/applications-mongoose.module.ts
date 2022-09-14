import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from '../sessions/schemas';
import { Task, TaskSchema } from '../tasks/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class ApplicationsMongooseModule {}
