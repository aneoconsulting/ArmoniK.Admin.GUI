import { ResultsInspectionService } from './results-inspection.service';

describe('ResultsInspectionService', () => {
  const service = new ResultsInspectionService();

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('should have a defined "fields"', () => {
    expect(service.fields).toBeDefined();
  });
});