import { TaskStatus, TaskOptions } from '@armonik.admin.gui/armonik-typing';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({
  collection: 'TaskData',
})
export class Task {
  @Prop()
  _id: string;

  @Prop()
  SessionId: string;

  @Prop({ type: {} })
  Options: TaskOptions;

  @Prop()
  Status: TaskStatus;

  @Prop()
  StartDate: Date;

  @Prop()
  EndDate?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
