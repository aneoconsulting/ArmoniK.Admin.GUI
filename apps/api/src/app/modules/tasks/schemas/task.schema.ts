import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({
  collection: 'TaskData',
})
export class Task {
  @Prop()
  _id: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
