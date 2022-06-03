import { Module } from '@nestjs/common';
import { AppMongooseModule } from './app-mongoose.module';
import { AppController } from './app.controller';
import { CoreModule } from './core';
import { ApplicationsModule, SessionsModule, TasksModule } from './modules';

@Module({
  imports: [
    CoreModule,
    AppMongooseModule,
    TasksModule,
    SessionsModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
