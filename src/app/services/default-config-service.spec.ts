import { CountLine, TasksStatusesGroup } from '@app/dashboard/types';
import { DefaultConfigService } from './default-config.service';

window = Object.create(window);

function overrideWindowLocation(location: string) {
  const url = 'localhost:4200';
  Object.defineProperty(window, 'location', {
    value: {
      href: `${url}/${location}`,
    },
    writable: true
  });
}

describe('DefaultConfigService', () => {
  let service: DefaultConfigService;

  beforeEach(() => {
    overrideWindowLocation('en');
    service = new DefaultConfigService();
  });
  
  it('should create default config service', () => {
    expect(service).toBeTruthy();
  });

  it('Every method should return a defined value', () => {
    const keys = Object.getOwnPropertyNames(DefaultConfigService.prototype).filter(key => key !== 'constructor');
    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((service as any)[key]).toBeDefined();
    }
  });

  describe('defaultLanguage configuration', () => {
    it('should be english by default', () => {
      expect(service.defaultLanguage).toBe('en');
    });
  });

  describe('default dashboard configuration', () => {
    it('the line by default should contain 3 task statuses', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map(line => (line as CountLine).taskStatusesGroups); 
      expect(taskStatuses[0]).toHaveLength(3);
    });
    it('the line by default should have finished, running, error, task statuses by default ', () => {
      const defaultDashboardLines = service.defaultDashboardLines;
      const taskStatuses = defaultDashboardLines.map( line => (line as CountLine).taskStatusesGroups) as unknown as TasksStatusesGroup[][]; 
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
