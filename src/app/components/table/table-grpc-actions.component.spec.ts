import { TestBed } from '@angular/core/testing';
import { TaskSummary } from '@app/tasks/types';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { IconsService } from '@services/icons.service';
import { Subject } from 'rxjs';
import { TableGrpcActionsComponent } from './table-grpc-actions.component';

describe('TableGrpcActionsComponent', () => { 
  let component: TableGrpcActionsComponent<TaskSummary>;

  const mockGrpcActionsService = {
    refresh: {},
  };

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const refresh = new Subject<void>();
  const selection: TaskSummary[] = [];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableGrpcActionsComponent,
        { provide: GrpcActionsService, useValue: mockGrpcActionsService },
        { provide: IconsService, useValue: mockIconsService },
      ],
    }).inject(TableGrpcActionsComponent<TaskSummary>);
    component.refresh$ = refresh;
    component.selection = selection;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => { 
    it('should set the seleciton', () => {
      expect(component.selection).toEqual(selection);
    });

    it('should set the grpcActionsService refresh', () => {
      expect(mockGrpcActionsService.refresh).toBe(refresh);
    });
  });

  it('should get icons', () => {
    const icon = 'icon';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });
});