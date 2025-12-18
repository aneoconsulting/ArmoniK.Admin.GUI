import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { Environment } from '@services/environment.service';
import { of, throwError } from 'rxjs';
import { AddEnvironmentDialogComponent } from './add-environment.dialog';

describe('AddEnvironmentDialogComponent', () => { 
  let component: AddEnvironmentDialogComponent;

  const mockGrpcInterceptor = {
    checkRegex: /.*/,
  };

  const returnedEnv: Environment = {
    color: 'blue',
    description: '',
    name: 'test env',
    version: '0.0.1',
  };
  const mockHttpClient = {
    get: jest.fn((value: string) => {
      if (value.includes('invalid-url')) {
        return throwError(() => new Error());
      }
      return of(returnedEnv);
    }),
  };

  const mockDialogRef = {
    close: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddEnvironmentDialogComponent,
        { provide: GRPC_INTERCEPTORS, useValue: mockGrpcInterceptor },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ]
    }).inject(AddEnvironmentDialogComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialistion', () => { 
    it('should set hostForm', () => {
      expect(component.hostForm).toBeDefined();
    });

    it('should set choiceForm', () => {
      expect(component.choiceForm).toBeDefined();
    });

    it('should set customEnvironmentForm', () => {
      expect(component.customEnvironmentForm).toBeDefined();
    });
  });

  describe('Testing environment', () => { 
    it('should set the testedEnvironment as the one returned by a correct armonik URL', () => {
      component.hostForm.setValue('some-url');
      expect(component.testedEnvironment).toEqual(returnedEnv);
    });

    it('should set the testedEnvironment as null if the provided URL is not a correct armonik URL', () => {
      component.hostForm.setValue('invalid-url');
      expect(component.testedEnvironment).toBeUndefined();
    });

    it('should reset the testedEnvironment on an empty string', () => {
      component.hostForm.setValue('');
      expect(component.testedEnvironment).toBeUndefined();
    });
  });

  describe('Updating choiceForm', () => {
    it('should disable the customEnvironmentForm when its value is true', () => {
      component.customEnvironmentForm.enable();
      component.choiceForm.setValue(true);
      expect(component.customEnvironmentForm.disabled).toBeTruthy();
    });
    
    it('should enable the customEnvironmentForm when its value is true', () => {
      component.customEnvironmentForm.disable();
      component.choiceForm.setValue(false);
      expect(component.customEnvironmentForm.disabled).toBeFalsy();
    });
  });

  describe('closeSubmit', () => {
    const host = 'some-host';
    beforeEach(() => {
      component.hostForm.setValue(host);
      component.choiceForm.setValue(false);
    });

    it('should close the dialog with the host and environment values', () => {
      const environment = {
        name: 'Url',
        version: '1.0.0',
        color: 'blue',
        description: 'description',
      };
      component.customEnvironmentForm.setValue(environment);
      component.closeSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        endpoint: host,
        environment,
      });
    });
    it('should close the dialog with the host and environment values', () => {
      const environment = {
        name: null,
        version: null,
        color: 'blue',
        description: null,
      };
      component.customEnvironmentForm.setValue(environment);
      component.closeSubmit();
      expect(mockDialogRef.close).toHaveBeenCalledWith({
        endpoint: host,
        environment: {
          color: environment.color,
          name: undefined,
          version: undefined,
          description: undefined,
        },
      });
    });
  });

  it('should unsubscribe from everything on destroy', () => {
    component.ngOnDestroy();
    expect(component['subscription'].closed).toBeTruthy();
  });
});