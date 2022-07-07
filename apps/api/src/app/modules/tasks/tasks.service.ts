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
    orderBy: string | undefined,
    order: string | undefined,
    _id: string | undefined,
    status: number | undefined
  ): Promise<Pagination<Task>> {
    const startIndex = (page - 1) * limit;

    const match: { [key: string]: unknown } = {
      SessionId: sessionId,
    };

    if (_id) {
      match['_id'] = _id;
    }

    if (status !== undefined) {
      match['Status'] = status;
    }

    const taskSort: { [key: string]: 1 | -1 } = {};

    if (orderBy) {
      taskSort[orderBy] = Number(order) as -1 | 1;
    } else {
      taskSort['startedAt'] = -1;
      taskSort['_id'] = 1;
    }

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
      .sort(taskSort)
      .skip(startIndex)
      .limit(limit)
      .exec();

    const meta = this.paginationService.createMeta(
      total[0]?.count ?? 0,
      page,
      limit
    );

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
      // only tasks that can be cancelled
      included: { Statuses: PendingStatus },
    });
  }
}
