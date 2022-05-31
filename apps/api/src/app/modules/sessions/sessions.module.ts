import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaginationService } from '../../core';
import { Session, SessionSchema } from './schemas';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

/**
 * Sessions module
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, PaginationService],
})
export class SessionsModule {}
