
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

}); 
