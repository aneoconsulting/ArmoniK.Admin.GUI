import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionString } from '../mongo-client.options';

@Module({
  imports: [MongooseModule.forRoot(mongoConnectionString())],
})
export class AppMongooseModule {}
