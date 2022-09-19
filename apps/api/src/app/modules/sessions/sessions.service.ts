import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Submitter } from '../../common';

@Injectable()
export class SessionsService implements OnModuleInit {
  private readonly logger = new Logger(SessionsService.name);
  private submitterService: Submitter;

  constructor(@Inject('Submitter') private client: ClientGrpc) {}

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
