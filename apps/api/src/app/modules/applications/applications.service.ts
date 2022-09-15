import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  Application,
  TaskStatus,
  ErrorStatus,
  PendingStatus,
  Pagination,
  ApplicationError,
} from '@armonik.admin.gui/armonik-typing';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { Session, SessionDocument } from '../sessions/schemas';
import { PaginationService, SettingsService } from '../../common';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly paginationService: PaginationService,
    @InjectConnection() private connection: Connection,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>
  ) {}

  async findAll(): Promise<Application[]> {
    const result = await this.connection
      .collection(this.taskModel.collection.collectionName)
      .aggregate<Application>([
        // Get only the last seven days using StartDate
        {
          $match: {
            $expr: {
              $gte: [
                // Use this instead of $StartDate to have pending tasks too
                '$CreationDate',
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              ],
            },
          },
        },
        {
          // Groupe by Options.ApplicationName and Options.ApplicationVersion and sum tasks using Status
          $group: {
            _id: {
              applicationName: '$Options.ApplicationName',
              applicationVersion: '$Options.ApplicationVersion',
            },
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
                  if: { $eq: ['$Status', TaskStatus.COMPLETED] },
                  then: 1,
                  else: 0,
                },
              },
            },
            countTasksProcessing: {
              $sum: {
                $cond: {
                  if: { $eq: ['$Status', TaskStatus.PROCESSING] },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          // Get the last three sessions using creation date
          $lookup: {
            from: this.sessionModel.collection.collectionName,
            let: {
              applicationName: '$_id.applicationName',
              applicationVersion: '$_id.applicationVersion',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$Options.ApplicationName', '$$applicationName'],
                      },
                      {
                        $eq: [
                          '$Options.ApplicationVersion',
                          '$$applicationVersion',
                        ],
                      },
                    ],
                  },
                },
              },
              {
                $sort: {
                  CreationDate: -1,
                },
              },
              {
                $limit: 3,
              },
              {
                $project: {
                  _id: '$_id',
                  createdAt: '$CreationDate',
                  cancelledAt: '$CancelledDate',
                  status: '$Status',
                },
              },
            ],
            as: 'sessions',
          },
        },
        {
          // Handle default application
          $addFields: {
            _id: {
              applicationName: {
                $ifNull: [
                  '$_id.applicationName',
                  this.settingsService.defaultApplicationName,
                ],
              },
              applicationVersion: {
                $ifNull: [
                  '$_id.applicationVersion',
                  this.settingsService.defaultApplicationVersion,
                ],
              },
            },
          },
        },
      ])
      .sort({ _id: 1 })
      .toArray();

    return result;
  }

  /**
   * Find all error paginated
   *
   * @param page
   * @param limit
   * @param orderBy
   * @param order
   *
   * @returns Pagination of application error
   */
  async findAllWithErrorsPaginated(
    page: number,
    limit: number,
    orderBy?: string,
    order?: string,
    applicationName?: string,
    applicationVersion?: string,
    sessionId?: string,
    errorAt?: string
  ): Promise<Pagination<ApplicationError>> {
    const startIndex = (page - 1) * limit;

    const match: { [key: string]: any } = {
      $expr: {
        $and: [{ $in: ['$Status', ErrorStatus] }],
      },
    };

    if (applicationName) {
      match.$expr.$and.push({
        $eq: [
          '$Options.ApplicationName',
          this.settingsService.getApplicationName(applicationName),
        ],
      });
    }

    if (applicationVersion) {
      match.$expr.$and.push({
        $eq: [
          '$Options.ApplicationVersion',
          this.settingsService.getApplicationVersion(applicationVersion),
        ],
      });
    }

    if (sessionId) {
      match['SessionId'] = sessionId;
    }

    if (errorAt) {
      match.$expr.$and.push({
        $gte: ['$EndDate', new Date(errorAt)],
      });
    }

    const applicationSort: { [key: string]: 1 | -1 } = {};

    if (orderBy) {
      applicationSort[orderBy] = Number(order) as 1 | -1;
    } else {
      applicationSort['errorAt'] = -1;
      applicationSort['_id'] = 1;
    }

    const getTotal = async () => {
      return this.connection
        .collection(this.taskModel.collection.collectionName)
        .aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();
    };

    const getTasks = async () => {
      return this.connection
        .collection(this.taskModel.collection.collectionName)
        .aggregate<ApplicationError>([
          { $match: match },

          {
            $sort: applicationSort,
          },
          {
            $skip: startIndex,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 0,
              applicationName: '$Options.ApplicationName',
              applicationVersion: '$Options.ApplicationVersion',
              taskId: '$_id',
              sessionId: '$SessionId',
              errorAt: '$EndDate',
              error: {
                message: '$Output.Error',
              },
            },
          },
          // Handle default application
          {
            $addFields: {
              applicationName: {
                $ifNull: [
                  '$applicationName',
                  this.settingsService.defaultApplicationName,
                ],
              },
              applicationVersion: {
                $ifNull: [
                  '$applicationVersion',
                  this.settingsService.defaultApplicationVersion,
                ],
              },
            },
          },
        ])
        .toArray();
    };

    try {
      const [total, data] = await Promise.all([getTotal(), getTasks()]);

      const meta = this.paginationService.createMeta(
        total[0]?.count ?? 0,
        page,
        limit
      );
      return { meta, data };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
