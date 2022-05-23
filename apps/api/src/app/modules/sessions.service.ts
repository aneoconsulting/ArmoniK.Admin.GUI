import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from '../core';
import { Session, SessionDocument } from './schemas';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly paginationService: PaginationService
  ) {}

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<Pagination<Session>> {
    const startIndex = (page - 1) * limit;

    const total = await this.sessionModel.countDocuments();
    const data = await this.sessionModel
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
}
