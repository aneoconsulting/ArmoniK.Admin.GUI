import { TestBed } from '@angular/core/testing';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { LinkType } from '@app/types/graph.types';
import { IconsService } from '@services/icons.service';
import { GraphLegendComponent } from './graph-legend.component';

describe('GraphLegendComponent', () => {
  let component: GraphLegendComponent;

  const mockTasksStatusesService = {
    keys: ['Cancelled', 'Creating'],
  };

  const mockSessionsStatusesService = {
    keys: ['Cancelled', 'Closed'],
  };

  const mockResultsStatusesService = {
    keys: ['Aborted', 'Completed'],
  };

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const links: Record<LinkType, string> = {
    dependency: 'blue',
    output: 'red',
    parent: 'yellow',
    payload: 'green'
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        GraphLegendComponent,
        { provide: SessionsStatusesService, useValue: mockSessionsStatusesService },
        { provide: TasksStatusesService, useValue: mockTasksStatusesService },
        { provide: ResultsStatusesService, useValue: mockResultsStatusesService },
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(GraphLegendComponent);
    component.links = links;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize linksDescription', () => {
    expect(component.linksDescription).toEqual([
      {
        label: 'dependency',
        color: 'blue',
      },
      {
        label: 'output',
        color: 'red',
      },
      {
        label: 'parent',
        color: 'yellow',
      },
      {
        label: 'payload',
        color: 'green',
      },
    ]);
  });

  it('should get icons', () => {
    const icon = 'heart';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });
});