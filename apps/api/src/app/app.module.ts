import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/database'),
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
