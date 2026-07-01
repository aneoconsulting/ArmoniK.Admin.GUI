import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Environment } from '@services/environment.service';
import { of, throwError } from 'rxjs';
import { ConflictingEnvironmentDialogComponent } from './conflicting-environment.dialog';

describe('ConflictingEnvironmentDialogComponent', () => {
  let component: ConflictingEnvironmentDialogComponent;

  const environment = {
    name: 'test',
    version: '1.0.0',
    description: 'Description',
    color: 'blue',
  } as Environment;
  const mockDialogData = {
    new: {
      endpoint: 'armonik-1',
      environment: environment,
    },
    old: {
      endpoint: 'armonik-1',
      environment: undefined,
    },
  };

  const serverEnvironment = {
    name: 'server',
    version: '2.0.0',
    description: 'Other',
    color: 'green',
  } as Environment;
  const mockHttpClient = {
    get: jest.fn(() => of(serverEnvironment)),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ConflictingEnvironmentDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    }).inject(ConflictingEnvironmentDialogComponent);
  });

  it('should exists', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should init the endpoint value', () => {
      expect(component.endpoint).toEqual(mockDialogData.new.endpoint);
    });

    it('should set the value of the oldEnv', () => {
      expect(component.oldEnv()).toEqual(serverEnvironment);
    });

    it('should set the value of the newEnv', () => {
      expect(component.newEnv()).toEqual(environment);
    });

    it('should call the http source only one time (since only one environment is undefined)', () => {
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
    });

    it('should call the http source with the endpoint', () => {
      expect(mockHttpClient.get).toHaveBeenCalledWith(mockDialogData.old.endpoint + '/static/environment.json');
    });

    describe('with inverted values', () => {
      const invertedData = {
        old: {
          endpoint: 'armonik-1',
          environment: environment,
        },
        new: {
          endpoint: 'armonik-2',
          environment: undefined,
        },
      };

      beforeEach(() => {
        mockHttpClient.get.mockReturnValueOnce(throwError(() => new Error()));
        component['init'](invertedData);
      });

      it('should set the value of the newEnv', () => {
        expect(component.newEnv()).toEqual(component['partialToCompleteEnv'](null));
      });

      it('should set the value of the oldEnv', () => {
        expect(component.oldEnv()).toEqual(environment);
      });
    });
  });
});