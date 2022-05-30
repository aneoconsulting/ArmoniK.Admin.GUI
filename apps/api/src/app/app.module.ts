import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConnectionString } from '../mongo-client.options';
import { AppController } from './app.controller';
import { ApplicationsModule, SessionsModule, TasksModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoConnectionString()),
    TasksModule,
    SessionsModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
