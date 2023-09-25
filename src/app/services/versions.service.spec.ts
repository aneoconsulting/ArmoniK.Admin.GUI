
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
      expect(service.core.split('.').length).toBe(3); 

    });

    test('should send an error message when core version does not contain only numbers', () => {
      service.setCoreVersion('nouvelle.8.de.3');
      expect(service.core).toBe(service.VERSION_NOT_FOUND);
    });

    test('should send an error message when core version is equal to null', () => {
      service.setCoreVersion(null);
      expect(service.core).toBe(service.VERSION_NOT_FOUND);
    });
  });

  describe('verify API version', () => {
    test('API version should only have 3 numbers', () => {
      service.setAPIVersion('0.1.8.9');
      expect(service.api.split('.').length).toBe(3); 
    });
    test('API version should only be numbers', () => {
      service.setAPIVersion('nouvelle.5.de.aping ');
      expect(service.api).toBe(service.VERSION_NOT_FOUND);
    });
    test('should send an error message when API version is equal to null', () => {
      service.setAPIVersion(null);
      expect(service.api).toBe(service.VERSION_NOT_FOUND);
    });  
  });


});