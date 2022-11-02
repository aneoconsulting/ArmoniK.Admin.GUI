import {
  ErrorStatus,
  FormattedSession,
  TaskStatus,
} from '@armonik.admin.gui/armonik-typing';
import { Metadata } from '@grpc/grpc-js';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
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
    _id?: string,
    lastActivityAt?: Date
  ) {
    const startIndex = (page - 1) * limit;

    const match: { [key: string]: any } = {
      'Options.ApplicationName':
        this.settingsService.getApplicationName(applicationName),
      'Options.ApplicationVersion':
        this.settingsService.getApplicationVersion(applicationVersion),
      $expr: {},
    };

    if (lastActivityAt) {
      match['$expr']['$gte'] = ['$CreationDate', lastActivityAt];
    }

    const sessionMatch: { [key: string]: unknown } = {};

    if (_id) {
      sessionMatch['_id'] = _id;
    }

    const sessionSort: { [key: string]: 1 | -1 } = {};

    if (orderBy) {
      sessionSort[orderBy] = Number(order) as -1 | 1;
    } else {
      sessionSort['createdAt'] = -1;
      sessionSort['_id'] = 1;
    }

    const getTotal = async () => {
      return this.connection
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
              let: {
                id: '$_id',
              },
              as: 'session',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$id', '$_id'],
                    },
                    ...sessionMatch,
                  },
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
    };

    const getSessions = async (): Promise<FormattedSession[]> => {
      return this.connection
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
                      $in: [
                        '$Status',
                        [
                          TaskStatus.CREATING,
                          TaskStatus.SUBMITTED,
                          TaskStatus.DISPATCHED,
                        ],
                      ],
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
              let: {
                id: '$_id',
              },
              as: 'session',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$id', '$_id'],
                    },
                    ...sessionMatch,
                  },
                },
              ],
            },
          },
          {
            $unwind: '$session',
          },
          // Join with the most recent task (using CreationDate)
          {
            $lookup: {
              from: this.taskModel.collection.collectionName,
              let: {
                id: '$_id',
              },
              as: 'task',
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ['$$id', '$SessionId'],
                    },
                  },
                },
                {
                  $sort: {
                    CreationDate: -1,
                  },
                },
                {
                  $limit: 1,
                },
              ],
            },
          },
          {
            $unwind: '$task',
          },
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
              lastActivityAt: '$task.CreationDate',
            },
          },
          {
            $sort: sessionSort,
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
    };

    try {
      const [total, data] = await Promise.all([getTotal(), getSessions()]);

      const meta = this.paginationService.createMeta(
        total[0]?.count ?? 0, // Total number of sessions
        page, // Current page
        limit // Items per page
      );

      return { meta, data };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
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
  cancel(sessionId: string, clientCN: string, clientFingerprint: string) {
    // Must pass headers to the request to enable authentication
    const metadata = new Metadata();
    metadata.add('X-Certificate-Client-CN', clientCN);
    metadata.add('X-Certificate-Client-Fingerprint', clientFingerprint);

    return this.submitterService.CancelSession({ id: sessionId }, metadata);
  }
}
