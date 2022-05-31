import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from '../../core';
import { Submitter } from '../../core/proto/submitter';
import { Task, TaskDocument } from './schemas';

@Injectable()
export class TasksService implements OnModuleInit {
  private submitterService: Submitter;

  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly paginationService: PaginationService,
    @Inject('Submitter') private client: ClientGrpc
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
    sessionId: string
  ): Promise<Pagination<Task>> {
    const startIndex = (page - 1) * limit;

    const total = await this.taskModel.countDocuments();
    const data = await this.taskModel
      .find({
        SessionId: sessionId,
      })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const meta = this.paginationService.createMeta(total, page, limit);

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
   * Can tasks by id using gRPC
   *
   * @param ids Ids of the tasks
   *
   * @returns Promise
   */
  cancelMany(ids: string[]): Promise<Record<string, never>> {
    return this.submitterService.CancelTasks({
      task: {
        ids,
      },
    });
  }
}
