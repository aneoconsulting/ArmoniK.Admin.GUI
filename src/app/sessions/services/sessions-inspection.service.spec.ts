import { SessionsInspectionService } from './sessions-inspection.service';

describe('SessionsInspectionService', () => {
  const service = new SessionsInspectionService();

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