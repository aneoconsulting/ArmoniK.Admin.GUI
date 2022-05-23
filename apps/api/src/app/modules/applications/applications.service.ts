import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Application, TaskStatus } from '@armonik.admin.gui/armonik-typing';

@Injectable()
export class ApplicationsService {
  constructor(@InjectConnection() private connection: Connection) {}

  async findAll(): Promise<Application[]> {
    const result = await this.connection
      // TODO: use name from a schema
      .collection('TaskData')
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
      ])
      .toArray();

    return result;
  }
}
