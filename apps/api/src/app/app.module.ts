import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SessionsModule } from './sessions/sessions.module';
import { TasksModule } from './tasks/tasks.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [SessionsModule, TasksModule, ApplicationsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
