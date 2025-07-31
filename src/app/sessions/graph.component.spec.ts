import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GraphDataService } from '@services/graph-data.service';
import { Observable, Subject } from 'rxjs';
import { SessionGraphComponent } from './graph.component';

describe('SessionGraphComponent', () => {
  let component: SessionGraphComponent;

  const mockGrpcEvent = new Observable();
  const mockGraphDataService = {
    listenToEvents: jest.fn(() => mockGrpcEvent),
    sessionId: null,
  };

  const mockParams = new Subject<Record<string, string>>();
  const mockRoute = {
    params: mockParams
  };

  const sessionId = 'sessionId';

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionGraphComponent,
        { provide: GraphDataService, useValue: mockGraphDataService },
        { provide: ActivatedRoute, useValue: mockRoute },
      ]
    }).inject(SessionGraphComponent);
    component.ngOnInit();
    mockParams.next({ 'id': sessionId });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the component id', () => {
      expect(component.id).toEqual(sessionId);
    });

    it('should set the graphService sessionId', () => {
      expect(mockGraphDataService.sessionId).toEqual(sessionId);
    });

    it('should set the grpcObservable', () => {
      expect(component.grpcObservable).toBe(mockGrpcEvent);
    });
  });

  describe('destruction', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component['subscriptions'], 'unsubscribe');
      component.ngOnDestroy();
    });
    
    it('should unsubscribe', () => {
      expect(spy).toHaveBeenCalled();
    });
  });
});