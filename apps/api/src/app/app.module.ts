import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppMongooseModule } from './app-mongoose.module';
import { AppController } from './app.controller';
import { ApplicationsModule, SessionsModule, TasksModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppMongooseModule,
    TasksModule,
    SessionsModule,
    ApplicationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
