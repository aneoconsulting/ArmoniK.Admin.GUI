import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from '../../core';
import { Task, TaskDocument } from './schemas';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
    private readonly paginationService: PaginationService
  ) {}

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<Pagination<Task>> {
    const startIndex = (page - 1) * limit;

    const total = await this.taskModel.countDocuments();
    const data = await this.taskModel
      .find()
      .skip(startIndex)
      .limit(limit)
      .exec();

    const meta = this.paginationService.createMeta(total, page, limit);

    return {
      data,
      meta,
    };
  }

  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).exec();
  }
}
