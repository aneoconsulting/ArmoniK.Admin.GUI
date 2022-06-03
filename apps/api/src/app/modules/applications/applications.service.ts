import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Application, TaskStatus } from '@armonik.admin.gui/armonik-typing';
import { Task, TaskDocument } from '../tasks/schemas/task.schema';
import { SettingsService } from '../../shared';

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
        {
          // Groupe by Options.Options.GridAppName and sum tasks using Status
          $group: {
            _id: '$Options.Options.GridAppName',
            countTasksError: {
              $sum: {
                $cond: {
                  if: { $eq: ['$Status', TaskStatus.ERROR] },
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
              $ifNull: ['$_id', this.settingsService.defaultApplicationName],
            },
          },
        },
      ])
      .sort({ _id: 1 })
      .toArray();

    return result;
  }
}
