
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
  });

}); 
