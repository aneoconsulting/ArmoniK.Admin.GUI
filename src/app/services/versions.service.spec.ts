
import { VersionsService } from './versions.service';

describe('versions service', () => {
  const service = new VersionsService();
  
  it('should create versions service', () => {
    expect(service).toBeTruthy();
  });

  it('should format the version', () => {
    expect(service['formatVersion']('0.1.8')).toEqual([0, 1, 8]);
  });

  describe('handleNullableVersion', () => {
    it('should return the version if it is not null', () => {
      expect(service['handleNullableVersion']('0.1.8')).toEqual('0.1.8');
    });

    it('should handle null version', () => {
      expect(service['handleNullableVersion']()).toEqual(service.VERSION_NOT_FOUND);
    });
  });

  describe('fixVersion', () => {
    it('should join the version parts', () => {
      expect(service['fixVersion']([0, 1, 8])).toEqual('0.1.8');
    });

    it('should limit to 3 digits', () => {
      expect(service['fixVersion']([0, 1, 8, 9])).toEqual('0.1.8');
    });
  });

  describe('verify core version', () => {
    it('should set core version', () => {
      const coreVersion = '0.1.8';
      service.setCoreVersion(coreVersion);
      expect(service.core).toBe(coreVersion);
    });

    it('should send an error message when core version does not contain only numbers', () => {
      service.setCoreVersion('nouvelle.8.de.3');
      expect(service.core).toBe(service.VERSION_NOT_FOUND);
    });

    it('should send an error message when core version is equal to null', () => {
      service.setCoreVersion();
      expect(service.core).toBe(service.VERSION_NOT_FOUND);
    });
  });

  describe('verify API version', () => {
    it('should set API version', () => {
      const apiVersion = '0.3.8';
      service.setAPIVersion(apiVersion);
      expect(service.api).toEqual(apiVersion);
    });

    it('should only be numbers', () => {
      service.setAPIVersion('nouvelle.5.de.aping');
      expect(service.api).toBe(service.VERSION_NOT_FOUND);
    });
    it('should send an error message when API version is equal to null', () => {
      service.setAPIVersion();
      expect(service.api).toBe(service.VERSION_NOT_FOUND);
    });

    it('should fix the api version', () => {
      const realversion = '3.20.4';
      service.setAPIVersion(`${realversion}+ezasfdefrhjuro10`);
      expect(service.api).toEqual(realversion);
    });
  });
});