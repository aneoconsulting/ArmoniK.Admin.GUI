import { GetResultResponse, ResultRaw } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { Subject } from 'rxjs';
import { InspectResultActionsComponent } from './inspect-result-actions.component';

describe('InspectResultActionsComponent', () => {
  let component: InspectResultActionsComponent<ArmoniKGraphNode>;

  const getSubject = new Subject<GetResultResponse>();
  const mockResultsGrpcService = {
    get$: jest.fn(() => getSubject),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const node = {
    id: 'resultId',
  } as ArmoniKGraphNode;

  const mockResult = {
    resultId: 'resultId',
    sessionId: 'sessionId',
    ownerTaskId: 'ownerTaskId',
  } as ResultRaw;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectResultActionsComponent,
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        { provide: Router, useValue: mockRouter },
      ]
    }).inject(InspectResultActionsComponent);
    component.node = node;
    getSubject.next({result: mockResult} as GetResultResponse);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should subscribe to the grpc get event', () => {
      expect(getSubject.observed).toBeTruthy();
    });

    it('should retrieve result information', () => {
      expect(component.result()).toBe(mockResult);
    });
  });

  it('should redirect to the result page', () => {
    component.seeResult(mockResult);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/results', mockResult.resultId]);
  });

  it('should redirect to the owner task page', () => {
    component.seeOwnerTask(mockResult);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks', mockResult.ownerTaskId]);
  });

  describe('On destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe', () => {
      expect(component['subscriptions'].closed).toBeTruthy();
    });
  });
});