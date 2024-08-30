import { TasksInspectionService } from './tasks-inspection.service';

describe('TasksInspectionService', () => {
  const service = new TasksInspectionService();

  it('should run', () => {
    expect(service).toBeTruthy();
  });

  it('should have a defined "fields"', () => {
    expect(service.fields).toBeDefined();
  });

  it('should have a defined "optionsFields"', () => {
    expect(service.optionsFields).toBeDefined();
  });

  it('should have a defined "arrays"', () => {
    expect(service.arrays).toBeDefined();
  });
});