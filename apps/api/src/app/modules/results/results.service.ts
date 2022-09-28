import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from '../../common';
import { Result, ResultDocument } from './schemas';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectModel(Result.name) private readonly resultModel: Model<Result>,
    private readonly paginationService: PaginationService
  ) {}

  /**
   * Find all results from the database using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param orderBy Order by field
   * @param order Order direction
   * @param SessionId
   * @param OwnerTaskId
   * @param Status
   *
   * @returns Pagination of results
   */
  async findAllPaginated(
    page: number,
    limit: number,
    orderBy?: string,
    order?: string,
    id?: string,
    sessionId?: string,
    ownerTaskId?: string,
    status?: string
  ) {
    const startIndex = (page - 1) * limit;

    const match: Record<string, any> = {};

    if (id) {
      match._id = id;
    }

    if (sessionId) {
      match.SessionId = sessionId;
    }

    if (ownerTaskId) {
      match.OwnerTaskId = ownerTaskId;
    }

    if (status) {
      match.Status = status;
    }

    const sort: Record<string, 1 | -1> = {};

    if (orderBy) {
      sort[orderBy] = Number(order) as 1 | -1;
    } else {
      sort['CreationDate'] = -1;
      sort['_id'] = 1;
    }

    const getTotal = async () => {
      return this.resultModel.countDocuments(match).exec();
    };

    const getResults = async () => {
      return this.resultModel
        .find(match)
        .sort(sort)
        .skip(startIndex)
        .limit(limit)
        .exec();
    };

    try {
      const [total, results] = await Promise.all([getTotal(), getResults()]);

      const meta = this.paginationService.createMeta(
        total, // Total number of results
        page, // Current page
        limit // Items per page
      );

      return { meta, data: results };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
