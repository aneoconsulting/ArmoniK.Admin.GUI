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
    _id?: string
  ) {
    const startIndex = (page - 1) * limit;

    const match: { [key: string]: any } = {
      'Options.Options.GridAppName':
        this.settingsService.getApplicationName(applicationName),
      'Options.Options.GridAppVersion':
        this.settingsService.getApplicationVersion(applicationVersion),
      // Only get the last seven days using StartDate
      $expr: {
        $gte: ['$StartDate', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)],
      },
    };

    const sessionMatch: { [key: string]: unknown } = {};

    if (_id) {
      sessionMatch['_id'] = _id;
    }

    const tasksSort: { [key: string]: 1 | -1 } = {};

    if (orderBy) {
      tasksSort[orderBy] = Number(order) as -1 | 1;
    } else {
      tasksSort['createdAt'] = -1;
      tasksSort['_id'] = 1;
    }

    console.log(tasksSort);

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
            countTasks: { $sum: 1 },
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
        // Pick only the fields we need
        {
          $project: {
            _id: '$_id',
            countTasks: '$countTasks',
            countTasksPending: '$countTasksPending',
            countTasksError: '$countTasksError',
            countTasksCompleted: '$countTasksCompleted',
            countTasksProcessing: '$countTasksProcessing',
            status: '$session.Status',
            createdAt: '$session.CreationDate',
            cancelledAt: '$session.CancellationDate',
          },
        },
        {
          $sort: tasksSort,
        },
        // Skip the number of items per page
        {
          $skip: startIndex,
        },
        // Limit the number of items per page
        {
          $limit: limit,
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
        // Used to remove a task if object if empty
        {
          $unwind: '$session',
        },
        // Count the number of sessions
        {
          $group: {
            _id: null,
            count: {
              $sum: 1,
            },
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
