import {
  FormattedSession,
  TaskStatus,
  ErrorStatus,
  PendingStatus,
} from '@armonik.admin.gui/armonik-typing';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationService, Submitter } from '../../core';
import { SettingsService } from '../../shared';
import { Task, TaskDocument } from '../tasks/schemas';
import { Session, SessionDocument } from './schemas';

@Injectable()
export class SessionsService implements OnModuleInit {
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
    applicationName: string,
    applicationVersion: string,
    orderBy?: string,
    order?: string,
    createdAt?: string,
    cancelledAt?: string
  ) {
    const startIndex = (page - 1) * limit;

    const match = {
      'Options.Options.GridAppName':
        this.settingsService.getApplicationName(applicationName),
      'Options.Options.GridAppVersion':
        this.settingsService.getApplicationVersion(applicationVersion),
      // Only get the last seven days using StartDate
      $expr: {
        $gte: ['$StartDate', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)],
      },
    };

    const sessionMatch = {
      $expr: {
        $switch: {
          branches: [
            {
              case: { $ne: [createdAt, null] },
              then: {
                $eq: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$CreationDate',
                    },
                  },
                  createdAt,
                ],
              },
            },
            {
              case: { $ne: [cancelledAt, null] },
              then: {
                $eq: [
                  {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$CancellationDate',
                    },
                  },
                  cancelledAt,
                ],
              },
            },
          ],
          default: true,
        },
      },
    };

    const result = await this.connection
      .collection(this.taskModel.collection.collectionName)
      .aggregate<FormattedSession>([
        // Filter by application name and version
        {
          $match: match,
        },
        // Group by session id
        {
          $group: {
            _id: '$SessionId',
            countTasksPending: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$Status', PendingStatus],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            countTasksError: {
              $sum: {
                $cond: {
                  if: {
                    $in: ['$Status', ErrorStatus],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            countTasksCompleted: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ['$Status', TaskStatus.COMPLETED],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            countTasksProcessing: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ['$Status', TaskStatus.PROCESSING],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        // Join with only one session (merge object)
        {
          $lookup: {
            from: this.sessionModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'session',
            pipeline: [
              {
                $match: sessionMatch,
              },
            ],
          },
        },
        {
          $unwind: '$session',
        },
        // Sort by session id
        {
          $sort: {
            [`session.${orderBy}` ?? 'session.CreationDate']: order
              ? Number(order)
              : -1,
            _id: 1,
          },
        },
        // Skip the number of items per page
        {
          $skip: startIndex,
        },
        // Limit the number of items per page
        {
          $limit: limit,
        },
        // Pick only the fields we need
        {
          $project: {
            _id: '$_id',
            countTasksPending: '$countTasksPending',
            countTasksError: '$countTasksError',
            countTasksCompleted: '$countTasksCompleted',
            countTasksProcessing: '$countTasksProcessing',
            status: '$session.Status',
            createdAt: '$session.CreationDate',
            canceledAt: '$session.CancellationDate',
          },
        },
      ])
      .toArray();

    const total = await this.connection
      .collection(this.taskModel.collection.collectionName)
      .aggregate([
        // Filter by application name and version
        {
          $match: match,
        },
        // Group by session id
        {
          $group: {
            _id: '$SessionId',
          },
        },

        // Join with only one session (merge object)
        {
          $lookup: {
            from: this.sessionModel.collection.collectionName,
            localField: '_id',
            foreignField: '_id',
            as: 'session',
            pipeline: [
              {
                $match: sessionMatch,
              },
            ],
          },
        },
        {
          $unwind: '$session',
        },
        // Count the number of sessions using session._id
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const meta = this.paginationService.createMeta(
      total[0]?.count ?? 0, // Total number of sessions
      page, // Current page
      limit // Items per page
    );

    return { meta, data: result };
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
