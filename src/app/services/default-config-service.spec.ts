import { TasksStatusesGroup } from '@app/dashboard/types';
import { DefaultConfigService } from './default-config.service';

describe('DefaultConfigService', () => {
  let service: DefaultConfigService;

  window.location.href = 'http://localhost:4200';
  
  it('should create default config service', () => {
    service = new DefaultConfigService(); 
    expect(service).toBeTruthy();
  });

  it('should have the right default theme', () => {
    expect(service.defaultTheme).toBe('indigo-pink');
  });

  it('should have a defined defaultExternalServices configuration', () => {
    expect(service.defaultExternalServices).toBeDefined();
  });

  it('should have a defined defaultTasks configuration', () => {
    expect(service.defaultTasks).toBeDefined();
  });

  it('should have a defined defaultTasksByStatus configuration', () => {
    expect(service.defaultTasksByStatus).toBeDefined();
  });

  it('should have a defined defaultPartititons configuration', () => {
    expect(service.defaultPartitions).toBeDefined();
  });

  it('should have a defined defaultDashboardSplitLines configuration', ()=> {
    expect(service.defaultDashboardSplitLines).toBeDefined();
  });

  it('should have a defined defaultSessions configuration', () => {
    expect(service.defaultSessions).toBeDefined();
  });

  it('should have a defined defaultResults configuration', () => {
    expect(service.defaultResults).toBeDefined();
  });

  it('should have a defined defaultApplications configuration', () => {
    expect(service.defaultApplications).toBeDefined();
  });

  it('should have a defined defaultSidebar configuration', () => {
    expect(service.defaultSidebar).toBeDefined();
  });

  it('should have a defined defaultTasksViewInLogs configuration', () => {
    expect(service.defaultTasksViewInLogs).toBeDefined();
  });

  it('should have a defined exportedDefaultConfig configuration', () => {
    expect(service.exportedDefaultConfig).toBeDefined();
  });

  it('should have a defined defaultLanguage configuration', () => {
    expect(service.defaultLanguage).toBeDefined();
  });

  it('should have a defined availableLanguages configuration', () => {
    expect(service.availableLanguages).toBeDefined();
  });

  it('should have a defined healthcheck configuration', () => {
    expect(service.healthCheck).toBeDefined();
  });

  describe(' default dashboard configuration', () => {
    it('the dashboard lines configuration should display at least 1 line', () => {
      expect(service.defaultDashboardLines).toBeDefined();
    });

    it('the line by default should contain 3 task statuses', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map( line => line.taskStatusesGroups); 
      expect(taskStatuses[0]).toHaveLength(3);
    });
    it('the line by default should have finished, running, error, task statuses by default ', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map( line => line.taskStatusesGroups) as unknown as TasksStatusesGroup[][]; 
      expect(taskStatuses[0].map(taskStatus => taskStatus.name === 'Finished')).toBeTruthy();
      expect(taskStatuses[0].map(taskStatus => taskStatus.name === 'Running')).toBeTruthy();
      expect(taskStatuses[0].map(taskStatus => taskStatus.name === 'Errors')).toBeTruthy(); 
    });

    it('default DashboardSplitLines should return 1 line', ()=> {
      const defaultDashboardSplitLines :number = service.defaultDashboardSplitLines;
      expect(defaultDashboardSplitLines).toEqual(1);
    });
  });
}); 
