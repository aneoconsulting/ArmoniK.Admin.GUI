import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionString } from '../mongo-client.options';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoConnectionString()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
