import { Injectable } from '@nestjs/common';
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
import { SettingsService } from '../../shared';
import { PaginationService } from '../../core';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly paginationService: PaginationService,
    @InjectConnection() private connection: Connection,
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>
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
                '$StartDate',
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              ],
            },
          },
        },
        {
          // Groupe by Options.Options.GridAppName and sum tasks using Status
          $group: {
            _id: {
              applicationName: '$Options.Options.GridAppName',
              applicationVersion: '$Options.Options.GridAppVersion',
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

  async findAllWithErrorsPaginated(
    page: number,
    limit: number,
    orderBy: string,
    order: string
  ): Promise<Pagination<ApplicationError>> {
    const startIndex = (page - 1) * limit;

    const match = {
      $expr: {
        $and: [
          { $in: ['$Status', ErrorStatus] },
          {
            // 24hs ago
            $gte: ['$StartDate', new Date(Date.now() - 24 * 60 * 60 * 1000)],
          },
        ],
      },
    };

    const result = await this.connection
      .collection(this.taskModel.collection.collectionName)
      // Get only tasks where Status is Error and StartDate is greater than 24h ago and sort by StartDate (recent first). Then format the result to have the same structure as ApplicationError
      .aggregate<ApplicationError>([
        { $match: match },
        {
          $sort: {
            StartDate: -1,
            [orderBy ?? 'StartDate']: order ? Number(order) : -1,
          },
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
            applicationName: '$Options.Options.GridAppName',
            applicationVersion: '$Options.Options.GridAppVersion',
            taskId: '$_id',
            sessionId: '$SessionId',
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

    const total = await this.connection
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

    const meta = this.paginationService.createMeta(total[0].count, page, limit);

    return { meta, data: result };
  }
}
