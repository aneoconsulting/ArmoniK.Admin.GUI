import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { VersionsService } from '@services/versions.service';
import { VersionsMenuComponent } from './versions-menu.component';
import pkg from '../../../../../package.json';

describe('VersionsMenuComponent', () => {
  let component: VersionsMenuComponent;

  const mockVersionsService = {
    api: signal('1.2.3'),
    core: signal('0.1.2'),
  };

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        VersionsMenuComponent,
        { provide: VersionsService, useValue: mockVersionsService },
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(VersionsMenuComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have a defined version', () => {
    expect(component.version).toBeDefined();
  });

  it('should have a defined "repositories" array', () => {
    expect(component.repositories).toBeDefined();
  });

  it('should get icon', () => {
    component.getIcon('icon');
    expect(mockIconsService.getIcon).toHaveBeenCalledWith('icon');
  });

  
  describe('getVersion', () => {
    it('should get production version', () => {
      process.env['NODE_ENV'] = 'production';
      expect(component.getVersion()).toEqual(pkg.version);
    });

    it('should get development version', () => {
      process.env['NODE_ENV'] = 'development';
      expect(component.getVersion()).toEqual('-dev');
    });
  });

});