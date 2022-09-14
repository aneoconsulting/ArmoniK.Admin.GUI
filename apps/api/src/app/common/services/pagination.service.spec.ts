import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create meta utils for pagination for the first', () => {
    const total = 100;
    const page = 1;
    const limit = 10;

    const meta = service.createMeta(total, page, limit);

    expect(meta).toEqual({
      currentPage: page,
      nextPage: 2,
      prevPage: null,
      perPage: limit,
      firstPage: 1,
      lastPage: 10,
      total,
    });
  });

  it('should create meta utils for random page', () => {
    const total = 100;
    const page = 5;
    const limit = 10;

    const meta = service.createMeta(total, page, limit);

    expect(meta).toEqual({
      currentPage: page,
      nextPage: 6,
      prevPage: 4,
      perPage: limit,
      firstPage: 1,
      lastPage: 10,
      total,
    });
  });
});
