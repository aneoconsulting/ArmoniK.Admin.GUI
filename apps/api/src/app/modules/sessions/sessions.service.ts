import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationService, SettingsService, Submitter } from '../../common';
import { Task, TaskDocument } from '../tasks/schemas';
import { Session, SessionDocument } from './schemas';

@Injectable()
export class SessionsService implements OnModuleInit {
  private readonly logger = new Logger(SessionsService.name);
  private submitterService: Submitter;

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    @InjectConnection() private connection: Connection,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly settingsService: SettingsService,
    private readonly paginationService: PaginationService,
    @Inject('Submitter') private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.submitterService = this.client.getService<Submitter>('Submitter');
  }

  /**
   * Cancel a session
   *
   * @param sessionId Id of the session
   */
  cancel(sessionId: string) {
    return this.submitterService.CancelSession({ id: sessionId });
  }
}
