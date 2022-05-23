import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { mongoConnectionString } from '../mongo-client.options';
import { ApplicationsModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoConnectionString()),
    ApplicationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
