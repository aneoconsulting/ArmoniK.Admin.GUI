
import { VersionsService } from './versions.service';

describe('versions service', () => {
  let service: VersionsService; 
 
  test('should create versions service', () => {
    service = new VersionsService(); 
    expect(service).toBeTruthy();
  }); 

  describe('verify core version', () => {
    test('core version should only have 3 numbers', () => {
      service.setCoreVersion('0.1.8.9');
      expect(service.core?.split('.').length).toBe(3); 
    });

    test('core version should only be numbers', () => {
      service.setCoreVersion('nouvelle.version.de.core');
      expect(service.core).toBe(' version indisponible');
    });
  });


  describe('verify API version', () => {
    test('API version should only have 3 numbers', () => {
      service.setAPIVersion('0.1.8.9');
      expect(service.core?.split('.').length).toBe(3); 
    });

    test('API version should only be numbers', () => {
      service.setAPIVersion('nouvelle.version.de.core');
      expect(service.core).toBe(' version indisponible');
    });  
  });


});