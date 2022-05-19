import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({
  collection: 'SessionData',
})
export class Session {
  @Prop()
  _id: string;
  Status: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
