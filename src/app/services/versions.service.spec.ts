
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

    it('should keep the raw string when core version does not contain only numbers', () => {
      service.setCoreVersion('nouvelle.8.de.3');
      expect(service.core()).toBe('nouvelle.8.de.3');
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

    it('should keep the raw string when API version does not contain only numbers', () => {
      service.setAPIVersion('nouvelle.5.de.aping');
      expect(service.api()).toBe('nouvelle.5.de.aping');
    });
    it('should send an error message when API version is equal to null', () => {
      service.setAPIVersion();
      expect(service.api()).toBeUndefined();
    });
  });
});