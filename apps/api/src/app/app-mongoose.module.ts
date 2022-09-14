import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionString } from './common';

@Module({
  imports: [MongooseModule.forRoot(mongoConnectionString())],
})
export class AppMongooseModule {}
