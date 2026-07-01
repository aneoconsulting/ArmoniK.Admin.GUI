
import { VersionsService } from './versions.service';

describe('versions service', () => {
  const service = new VersionsService();
  
  it('should create versions service', () => {
    expect(service).toBeTruthy();
  });

  describe('verify core version', () => {
    it('should set core version', () => {
      const coreVersion = '0.1.8';
      service.setCoreVersion(coreVersion);
      expect(service.core()).toBe(coreVersion);
    });

    it('should send an error message when core version does not contain only numbers', () => {
      service.setCoreVersion('nouvelle.8.de.3');
      expect(service.core()).toBeUndefined();
    });

    it('should send an error message when core version is equal to null', () => {
      service.setCoreVersion();
      expect(service.core()).toBeUndefined();
    });
  });

  describe('verify API version', () => {
    it('should set API version', () => {
      const apiVersion = '0.3.8';
      service.setAPIVersion(`${apiVersion}.2`);
      expect(service.api()).toEqual(apiVersion);
    });

    it('should only be numbers', () => {
      service.setAPIVersion('nouvelle.5.de.aping');
      expect(service.api()).toBeUndefined();
    });
    it('should send an error message when API version is equal to null', () => {
      service.setAPIVersion();
      expect(service.api()).toBeUndefined();
    });
  });
});