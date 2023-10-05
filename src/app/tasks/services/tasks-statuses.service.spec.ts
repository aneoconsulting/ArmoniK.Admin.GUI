import { TasksStatusesService } from './tasks-statuses.service';



describe('tasksStatusesService', () => {
  const service: TasksStatusesService = new TasksStatusesService();


  test('should create TasksStatusesService', () => {
    expect(service).toBeTruthy();
  });

  test('should return the right task status', () => {
    const mockStatus = service.statusToLabel(10);
    expect(mockStatus).toBe('Processed');
  });
  

  test('should return true', () => {
    expect(service.isRetried(11)).toBeTruthy();
  });

  test('should return false ', () => {
    const mockRetriedTaskStatus = service.isRetried(10);
    expect(mockRetriedTaskStatus).not.toBeTruthy();
  });


});