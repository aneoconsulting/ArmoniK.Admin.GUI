import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ResultDocument = Result & Document;

@Schema({
  collection: 'Result',
})
export class Result {
  @Prop()
  _id: string;

  @Prop()
  SessionId: string;

  @Prop()
  Status: number;

  @Prop()
  Name: string;

  @Prop()
  OwnerTaskId: string;

  @Prop()
  CreationDate: Date;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
