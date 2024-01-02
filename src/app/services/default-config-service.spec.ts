import { DefaultConfigService } from './default-config.service';

describe('DefaultConfigService', () => {
  let service: DefaultConfigService; 
  
  it('should create default config service', () => {
    service = new DefaultConfigService(); 
    expect(service).toBeTruthy();
  });

  it('should have the right default theme', () => {
    expect(service.defaultTheme).toBe('indigo-pink');
  });

  it('should call defaultExternalServices getter', () => {
    const spyGetDefaultExternalServices = jest.spyOn(service, 'defaultExternalServices', 'get');
    service.defaultExternalServices;
    expect(spyGetDefaultExternalServices).toHaveBeenCalled();
  });

  it('should call defaultTasks getter', () => {
    const spyGetDefaultTasks = jest.spyOn(service, 'defaultTasks', 'get');
    service.defaultTasks;
    expect(spyGetDefaultTasks).toHaveBeenCalled();
  });

  it('should call defaultTasksByStatus getter', () => {
    const spyGetDefaultTasksByStatus = jest.spyOn(service, 'defaultTasksByStatus', 'get');
    service.defaultTasksByStatus;
    expect(spyGetDefaultTasksByStatus).toHaveBeenCalled();
  });

  it('should call defaultPartititons getter', () => {
    const spyGetDefaultPartitions = jest.spyOn(service, 'defaultPartitions', 'get');
    service.defaultPartitions;
    expect(spyGetDefaultPartitions).toHaveBeenCalled();
  });

  it('should call defaultDashboardSplitLines getter', ()=> {
    const spyGetDefaultDashboardSplitLines = jest.spyOn(service, 'defaultDashboardSplitLines', 'get');
    service.defaultDashboardSplitLines;
    expect(spyGetDefaultDashboardSplitLines).toHaveBeenCalled();
  });

  it('should call defaultDashboardLines getter', ()=> {
    const spyGetDefaultDashboardLines = jest.spyOn(service, 'defaultDashboardLines', 'get');
    service.defaultDashboardLines;
    expect(spyGetDefaultDashboardLines).toHaveBeenCalled();
  }); 

  it('should call defaultSessions getter', () => {
    const spyGetDefaultSessions = jest.spyOn(service, 'defaultSessions', 'get');
    service.defaultSessions;
    expect(spyGetDefaultSessions).toHaveBeenCalled();
  });

  it('should call defaultResults getter', () => {
    const spyGetDefaultResults = jest.spyOn(service, 'defaultResults', 'get');
    service.defaultResults;
    expect(spyGetDefaultResults).toHaveBeenCalled();
  });

  it('should call defaultApplications getter', () => {
    const spyGetDefaultApplications = jest.spyOn(service, 'defaultApplications', 'get');
    service.defaultApplications;
    expect(spyGetDefaultApplications).toHaveBeenCalled();
  });

  it('should call defaultSidebar getter', () => {
    const spyGetDefaultSidebar = jest.spyOn(service, 'defaultSidebar', 'get');
    service.defaultSidebar;
    expect(spyGetDefaultSidebar).toHaveBeenCalled();
  });

  it('should call defaultTasksViewInLogs getter', () => {
    const spyGetDefaultTasksViewInLogs = jest.spyOn(service, 'defaultTasksViewInLogs', 'get');
    service.defaultTasksViewInLogs;
    expect(spyGetDefaultTasksViewInLogs).toHaveBeenCalled();
  });

  it('should call exportedDefaultConfig getter', () => {
    const spyGetExportedDefaultConfig = jest.spyOn(service, 'exportedDefaultConfig', 'get');
    service.exportedDefaultConfig;
    expect(spyGetExportedDefaultConfig).toHaveBeenCalled();
  });

  it('should call defaultLanguage getter', () => {
    const spyGetDefaultLanguage = jest.spyOn(service, 'defaultLanguage', 'get');
    service.defaultLanguage;
    expect(spyGetDefaultLanguage).toHaveBeenCalled();
  });

  it('should call availableLanguages getter', () => {
    const spyGetAvailableLanguage = jest.spyOn(service, 'availableLanguages', 'get');
    service.availableLanguages;
    expect(spyGetAvailableLanguage).toHaveBeenCalled();
  });

  describe(' default dashboard configuration', () => {
    it('the dashboard lines configuration should display at least 1 line', () => {
      expect(service.defaultDashboardLines).toHaveLength(1);
    });

    it('the line by default should contain 3 task statuses', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map( line => line.taskStatusesGroups); 
      expect(taskStatuses[0]).toHaveLength(3);
    });
    it('the line by default should have finished, running, error, task statuses by default ', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map( line => line.taskStatusesGroups); 
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
