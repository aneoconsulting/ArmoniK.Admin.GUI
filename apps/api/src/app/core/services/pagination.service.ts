import { PaginationMeta } from '@armonik.admin.gui/armonik-typing';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  /**
   * Creat meta utils for pagination
   */
  public createMeta(total: number, page = 1, limit = 10): PaginationMeta {
    console.log('start createMeta', total, page, limit);
    const lastPage = Math.ceil(total / limit);

    return {
      currentPage: page,
      nextPage: page < lastPage ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      perPage: limit,
      firstPage: 1,
      lastPage,
      total,
    };
  }
}
