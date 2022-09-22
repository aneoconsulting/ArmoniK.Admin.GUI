import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationService } from '../../common';
import { Result } from './schemas';

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
    SessionId?: string,
    OwnerTaskId?: string,
    Status?: string
  ) {
    const startIndex = (page - 1) * limit;

    // TODO: Implement filters

    const getTotal = async () => {
      return this.resultModel.countDocuments({}).exec();
    };

    const getResults = async () => {
      return this.resultModel.find().skip(startIndex).limit(limit).exec();
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
