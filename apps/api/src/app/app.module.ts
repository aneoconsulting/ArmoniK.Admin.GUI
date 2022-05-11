import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [SessionsModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
