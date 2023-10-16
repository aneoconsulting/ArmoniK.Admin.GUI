import { TasksStatusesService } from './tasks-statuses.service';



describe('tasksStatusesService', () => {
  const service: TasksStatusesService = new TasksStatusesService();


  test('should create TasksStatusesService', () => {
    expect(service).toBeTruthy();
  });

  test('should return the right task status', () => {
    expect(service.statusToLabel(10)).toEqual('Processed');
  });
  

  test('should return true', () => {
    expect(service.isRetried(11)).toBeTruthy();
  });

  test('should return false ', () => {
    expect(service.isRetried(10)).toBeFalsy();
  });

  test('some test', () => {
    expect(false).toBeTruthy();
  });
});