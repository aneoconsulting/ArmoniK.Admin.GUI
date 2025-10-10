import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        AddEnvironmentDialogComponent,
        { provide: GRPC_INTERCEPTORS, useValue: mockGrpcInterceptor },
        { provide: HttpClient, useValue: mockHttpClient },
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
    it('should set formGroup', () => {
      expect(component.formGroup).toBeTruthy();
    });
  });

  describe('Testing environment', () => { 
    it('should set the testedEnvironment as the one returned by a correct armonik URL', () => {
      component.formGroup.setValue({host: 'some-url' });
      expect(component.testedEnvironment).toEqual(returnedEnv);
    });

    it('should set the testedEnvironment as null if the provided URL is not a correct armonik URL', () => {
      component.formGroup.setValue({host: 'invalid-url' });
      expect(component.testedEnvironment).toBeNull();
    });

    it('should return null if the host value is an empty string', () => {
      component.formGroup.setValue({ host: '' });
      expect(component.testedEnvironment).toBeNull();
    });
  });

  it('should unsubscribe from everything on destroy', () => {
    component.ngOnDestroy();
    expect(component['subscription'].closed).toBeTruthy();
  });
});