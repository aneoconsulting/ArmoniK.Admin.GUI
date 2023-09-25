
import { Sidebar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';

describe('Default config service', () => {
  let service: DefaultConfigService; 
 
  it('should create default config service', () => {
    service = new DefaultConfigService(); 
    expect(service).toBeTruthy();
  });

  it('should have the right default theme', () => {
    expect(service.defaultTheme).toBe('indigo-pink');
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

  describe('default sidebar configuration', () => {
    const mockSidebar = [
      'profile',
      'divider',
      'dashboard',
      'divider',
      'applications',
      'partitions',
      'divider',
      'sessions',
      'tasks',
      'results',
      'divider',
    ] ;
    it('should return ', () => {
      const defaultSidebar :Sidebar[] = service.defaultSidebar; 
      expect(defaultSidebar).toEqual(mockSidebar); 
    });
  });

  describe('default external service', () =>{
    it('should contain an array type ExternalService',()=>{ 
      const externalService = service.defaultExternalServices;
      expect(externalService).toEqual([]);
    } );
  });

}); 
