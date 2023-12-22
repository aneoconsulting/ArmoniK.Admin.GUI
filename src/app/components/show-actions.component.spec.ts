import { TestBed } from '@angular/core/testing';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { TaskRaw } from '@app/tasks/types';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { ShowActionsComponent } from './show-actions.component';

describe('ShowActionComponent', () => {
  let component: ShowActionsComponent;

  const mockIconService = {
    getPage: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowActionsComponent,
        {provide: IconsService, useValue: mockIconService},
        FiltersService
      ]
    }).inject(ShowActionsComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should check if it is a session', () => {
    component.type = 'sessions';
    expect(component.sessionActions).toBeTruthy();
  });

  it('should check if it is a task', () => {
    component.type = 'tasks';
    expect(component.taskActions).toBeTruthy();
  });

  it('should check if it is a result', () => {
    component.type = 'results';
    expect(component.resultActions).toBeTruthy();
  });

  it('should check if it is a partition', () => {
    component.type = 'partitions';
    expect(component.partitionActions).toBeTruthy();
  });

  describe('ownerSessionId', () => {
    it('should retrieve the session Id of a task', () => {
      component.data = {
        sessionId: '01ezac-erzd30t-reE'
      } as unknown as TaskRaw;

      expect(component.ownerSessionId()).toEqual('01ezac-erzd30t-reE');
    });

    it('should retrieve the session Id of a result', () => {
      component.data = {
        sessionId: '01ezac-erzd30t-reA'
      } as unknown as ResultRaw;

      expect(component.ownerSessionId()).toEqual('01ezac-erzd30t-reA');
    });
  });

  it('should get the owner task Id of a result', () => {
    component.data = {
      ownerTaskId: 'some-task-id'
    } as unknown as ResultRaw;

    expect(component.resultTaskId()).toEqual('some-task-id');
  });

  it('should get the partition of a task', () => {
    component.data = {
      options: {
        partitionId: 'my-partition-id'
      }
    } as unknown as TaskRaw;

    expect(component.taskPartition()).toEqual('my-partition-id');
  });

  it('should check if the object has options', () => {
    expect(component.hasOptions()).toBeFalsy();
  });

  it('should create the query params when getting results of a task', () => {
    component.data = {
      id: 'some-task-id'
    } as unknown as TaskRaw;
    
    expect(component.resultTaskIdQueryParams()).toEqual({
      '1-root-3-0': 'some-task-id'
    });
  });

  it('should create the query params when getting the session of a task or result', () => {
    component.data = {
      sessionId: 'some-session-id'
    } as unknown as TaskRaw;
    
    expect(component.sessionsTaskResultQueryParams()).toEqual({
      '1-root-1-0': 'some-session-id'
    });
  });

  it('should create the query params for the partitions of a session', () => {
    component.data = {
      partitionIds: [
        'part-1', 'part-2', 'part-3'
      ]
    } as unknown as TaskRaw;
    
    expect(component.sessionPartitionsQueryParams()).toEqual({
      '0-root-1-0': 'part-1',
      '1-root-1-0': 'part-2',
      '2-root-1-0': 'part-3',
    });
  });

  it('should create the query params to get the sessions related to a partition', () => {
    component.data = {
      id: 'partition-id'
    } as unknown as PartitionRaw;

    expect(component.partitionSessionsQueryParam()).toEqual({
      '1-root-3-0': 'partition-id'
    });
  });

  it('should create the query params to get the tasks related to a partition', () => {
    component.data = {
      id: 'partition-id'
    } as unknown as PartitionRaw;

    expect(component.partitionTasksQueryParam()).toEqual({
      '1-options-4-0': 'partition-id'
    });
  });

  it('should get the icons of the pages', () => {
    const icon = 'applications';
    component.getPageIcon(icon);
    expect(mockIconService.getPage).toHaveBeenCalledWith(icon);
  });
});