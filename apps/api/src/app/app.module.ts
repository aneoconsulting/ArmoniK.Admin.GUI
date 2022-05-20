import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SessionsModule } from './sessions/sessions.module';
import { ConfigModule } from '@nestjs/config';
import { mongoConnectionString } from '../mongo-client.options';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoConnectionString()),
    SessionsModule,
    ApplicationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
