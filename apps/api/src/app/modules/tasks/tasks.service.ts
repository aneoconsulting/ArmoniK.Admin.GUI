import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { PaginationService } from '../../core';
import { Task, TaskDocument } from './schemas';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly paginationService: PaginationService,
    @InjectConnection() private connection: Connection
  ) {}

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
    sessionId: string
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
      .find(match)
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
}
