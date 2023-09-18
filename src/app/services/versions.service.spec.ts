
import { VersionsService } from './versions.service';

describe('versions service', () => {
  let service: VersionsService; 
 
  test('should create versions service', () => {
    service = new VersionsService(); 
    expect(service).toBeTruthy();
  }); 

  describe('with core version', () => {
    test('core version is correctly filled', ()=> {
      const coreServiceVersion = service.setCoreVersion('1.0.1'); 
      expect(coreServiceVersion).toBeUndefined();
      service.core?.map(version => expect(version).not.toBeNaN());
    });

    test('core version should only be numbers', () => {
      service.setCoreVersion('nouvelle.version.de.core');
      service.core?.map(version => expect(version).toBeNaN());
    });

    test('core version should only have 3 numbers', () => {
      service.setCoreVersion('0.1.8.9');
      expect(service.core?.length).toBe(3);
    });
  });

  describe('with api version', () => {
    test('Api version with 3 numbers', ()=> {
      const APIServiceVersion = service.setAPIVersion('1.0.1'); 
      expect(APIServiceVersion).toBeUndefined();
      service.api?.map(versionApi => expect(versionApi).not.toBeNaN());
    });

    test('core version should be 3 numbers', () => {
      service.setAPIVersion('nouvelle.version.de.core');
      service.api?.map(version => expect(version).toBeNaN());
    });
  });

});