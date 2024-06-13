import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { StatusCount } from '@app/tasks/types';
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

  const id = 'dataId';
  const statusesCount: StatusCount[] = [
    {
      count: 10,
      status: TaskStatus.TASK_STATUS_COMPLETED
    },
    {
      count: 9,
      status: TaskStatus.TASK_STATUS_ERROR
    }
  ];

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

  it('should save the statusesCount of an id', () => {
    service.saveStatuses(id, statusesCount);
    expect(service['tasksStatusesCache'].get(id)).toBe(statusesCount);
  });

  it('should retrieve the stored statusesCount of an id', () => {
    expect(service.getStatuses(id)).toBe(statusesCount);
  });
});