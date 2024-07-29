import { Scope } from '@app/types/config';
import { GrpcResponse } from '@app/types/data';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  const service = new CacheService();

  const scope: Scope = 'applications';
  const tableData: GrpcResponse = {
    total: 10,
    data: ['someData']
  } as unknown as GrpcResponse;

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should save the data of a specified scope', () => {
    service.save(scope, tableData);
    expect(service['tableCache'].get(scope)).toBe(tableData);
  });

  it('should retrieve the stored data of a scope', () => {
    expect(service.get(scope)).toBe(tableData);
  });
});