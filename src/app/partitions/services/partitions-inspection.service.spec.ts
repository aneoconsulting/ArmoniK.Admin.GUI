import { PartitionsInspectionService } from './partitions-inspection.service';

describe('PartitionsInspectionService', () => {
  const service = new PartitionsInspectionService();

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('should have a defined "fields"', () => {
    expect(service.fields).toBeDefined();
  });

  it('should have a defined "arrays"', () => {
    expect(service.arrays).toBeDefined();
  });
});