import { Pagination, PendingStatus } from '@armonik.admin.gui/armonik-typing';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SortOrder } from 'mongoose';
import { PaginationService, Submitter } from '../../core';
import { Task, TaskDocument } from './schemas';

@Injectable()
export class TasksService implements OnModuleInit {
  private submitterService: Submitter;

  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly paginationService: PaginationService,
    @Inject('Submitter') private readonly client: ClientGrpc,
    @InjectConnection() private connection: Connection
  ) {}

  onModuleInit() {
    this.submitterService = this.client.getService<Submitter>('Submitter');
  }

  /**
   * Get all tasks from the database using pagination and filters
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of tasks
   */
  async findAllPaginated(
    page: number,
    limit: number,
    sessionId: string,
    orderBy: string | null,
    order: string | null
  ): Promise<Pagination<Task>> {
    const startIndex = (page - 1) * limit;

    const match = {
      SessionId: sessionId,
    };

    const total = await this.connection
      .collection(this.taskModel.collection.collectionName)
      .aggregate([
        { $match: match },
        { $group: { _id: '$SessionId', count: { $sum: 1 } } },
      ])
      .toArray();

    const data = await this.taskModel
      .find(match, {
        _id: 1,
        startedAt: '$StartDate',
        endedAt: '$EndDate',
        status: '$Status',
        output: {
          success: '$Output.Success',
          error: '$Output.Error',
        },
      })
      .sort({
        [orderBy || 'StartDate']: (Number(order) as SortOrder) || -1,
        _id: 1,
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const meta = this.paginationService.createMeta(total[0].count, page, limit);

    return {
      data,
      meta,
    };
  }

  /**
   * Get one task by id from the database
   *
   * @param id Id of the task
   *
   * @returns Task
   */
  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }

  /**
   * Cancel tasks
   *
   * @param ids Ids of the tasks
   */
  cancelMany(ids: string[]) {
    return this.submitterService.CancelTasks({
      task: { ids },
      // only tasks that can be canceled
      included: { Statuses: PendingStatus },
    });
  }
}
