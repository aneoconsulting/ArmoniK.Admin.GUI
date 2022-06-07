import { Pagination } from '@armonik.admin.gui/armonik-typing';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError } from 'rxjs';
import { PaginationService, Submitter } from '../../core';
import { SettingsService } from '../../shared';
import { Session, SessionDocument } from './schemas';

@Injectable()
export class SessionsService implements OnModuleInit {
  private submitterService: Submitter;

  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly settingsService: SettingsService,
    private readonly paginationService: PaginationService,
    @Inject('Submitter') private client: ClientGrpc
  ) {}

  onModuleInit() {
    this.submitterService = this.client.getService<Submitter>('Submitter');
  }

  /**
   * Get all sessions from the database using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of sessions
   */
  async findAllPaginated(
    page: number,
    limit: number,
    appName: string
  ): Promise<Pagination<Session>> {
    const startIndex = (page - 1) * limit;

    const total = await this.sessionModel
      .find({
        'Options.Options.GridAppName':
          this.settingsService.getApplicationName(appName),
      })
      .countDocuments();
    // Get sessions filtered by appName (field Options.Options.GridAppName)
    const data = await this.sessionModel
      .find({
        'Options.Options.GridAppName':
          this.settingsService.getApplicationName(appName),
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const meta = this.paginationService.createMeta(total, page, limit);

    return {
      data,
      meta,
    };
  }

  /**
   * Get one session by id from the database
   *
   * @param id Id of the session
   *
   * @returns Session
   */
  async findOne(id: string): Promise<Session> {
    return this.sessionModel.findById(id).exec();
  }

  /**
   * Cancel a session
   *
   * @param sessionId Id of the session
   */
  cancel(sessionId: string) {
    return this.submitterService.CancelSession({ Id: sessionId });
  }
}
