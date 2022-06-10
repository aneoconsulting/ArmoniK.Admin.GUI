import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Application, TaskStatus } from '@armonik.admin.gui/armonik-typing';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { SettingsService } from '../../shared';
import { ErrorStatus, PendingStatus } from '../../core';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly settingsService: SettingsService,
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
}
