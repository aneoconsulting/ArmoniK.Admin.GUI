import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { RepositoryVersionComponent } from './repository-version.component';

describe('RepositoryVersionComponent', () => {
  let component: RepositoryVersionComponent;

  const label = 'API';
  const link = 'https://github.com/aneoconsulting/ArmoniK.Api/releases/';
  const icon = 'api';
  const version = '1.2.3';

  const mockIconsService = {
    getIcon: jest.fn(value => value),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        RepositoryVersionComponent,
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(RepositoryVersionComponent);
    component.label = label;
    component.link = link;
    component.icon = icon;
    component.version = signal(version);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('initialisation', () => {
    it('should init label', () => {
      expect(component.label).toEqual(label);
    });

    it('should init link', () => {
      expect(component.link).toEqual(link);
    });

    it('should init icon', () => {
      expect(component.link).toEqual(link);
    });

    it('should init the version', () => {
      expect(component.version()).toEqual(version);
    });
  });
});