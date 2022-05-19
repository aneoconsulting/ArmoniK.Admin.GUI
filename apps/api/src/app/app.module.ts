import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './sessions/sessions.module';
import { ConfigModule } from '@nestjs/config';
import { mongoConnectionString } from '../mongo-client.options';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoConnectionString()),
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
