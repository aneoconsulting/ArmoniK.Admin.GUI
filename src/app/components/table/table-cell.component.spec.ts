import { SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey } from '@app/sessions/types';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, SessionData } from '@app/types/data';
import { TableCellComponent } from './table-cell.component';

describe('TableCellComponent', () => {
  let component: TableCellComponent<SessionRaw, SessionStatus, TaskOptions>;

  const options = {
    applicationName: 'application-name',
    applicationVersion: 'application-version',
  } as TaskOptions;

  const createdAt: Timestamp = new Timestamp({
    seconds: '1343540',
    nanos: 0,
  });

  const column: TableColumn<SessionRaw, TaskOptions> = {
    key: 'sessionId',
    name: 'Session ID',
    sortable: true,
  };

  const countFilters: TaskSummaryFilters = [
    [
      {
        field: 0,
        for: 'root',
        operator: 0,
        value: 'application-name',
      }
    ]
  ];

  const queryParamsMap = new Map<SessionRawColumnKey, { [key: string]: string }>();
  queryParamsMap.set('sessionId', { sessionId: 'session-id' });

  const element: ArmonikData<SessionRaw, TaskOptions> = {
    raw: {
      sessionId: 'session-id',
      status: SessionStatus.SESSION_STATUS_RUNNING,
      duration: {
        seconds: '1',
        nanos: 0,
      },
      createdAt,
      options,
      clientSubmission: false,
      workerSubmission: false,
      partitionIds: []
    } as SessionRaw,
    resultsQueryParams: {
      '0-root-1-1': 'session-not-id',
      '0-root-2-1': 'session',
    } as Record<string, string>,
    filters: countFilters,
    queryParams: queryParamsMap,
  } as unknown as SessionData;

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TableCellComponent,
        { provide: Router, useValue: mockRouter }
      ]
    }).inject(TableCellComponent<SessionRaw, SessionStatus, TaskOptions>);

    component.statusesService = new SessionsStatusesService();
    component.column = column;
    component.element = element;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set element', () => {
    expect(component.element).toEqual(element);
  });

  it('should get queryParams', () => {
    expect(component.queryParams).toEqual(element.queryParams?.get('sessionId'));
  });

  it('should get queryTasksParams', () => {
    expect(component.queryTasksParams).toEqual((element as unknown as SessionData | ApplicationData | PartitionData).queryTasksParams);
  });

  it('should get countFilters', () => {
    expect(component.countFilters).toEqual(countFilters);
  });

  describe('simple value', () => {
    beforeEach(() => {
      component.column = column;
      component.element = element;
    });

    it('should set value', () => {
      expect(component.value).toEqual('session-id');
    });
  });

  it('should refresh refreshStatuses in case of a count column', () => {
    component.column = {
      key: 'count',
      name: 'Count',
      sortable: false,
    };
    const spy = jest.spyOn(component.refreshStatuses, 'next');
    component.element = element;
    expect(spy).toHaveBeenCalled();
  });

  test('undefined element should return undefined value', () => {
    component.element = undefined as unknown as ArmonikData<SessionRaw, TaskOptions>;
    expect(component.value).toBeUndefined();
  });

  describe('link value', () => {
    beforeEach(() => {
      component.column = {
        link: '/sessions',
        key: 'sessionId',
        type: 'link',
        sortable: true,
        name: 'Session ID'
      };
      const elementCopy = structuredClone(element);
      elementCopy.queryParams = undefined;
      component.element = elementCopy;
    });

    it('should set link', () => {
      expect(component.link).toEqual(`${component.column.link}/${element.raw[component.column.key as keyof DataRaw]}`);
    });
  });

  describe('duration value', () => {
    beforeEach(() => {
      component.column = {
        key: 'duration',
        type: 'duration',
        sortable: true,
        name: 'Duration'
      };
      component.element = element;
    });

    it('should set durationValue', () => {
      expect(component.durationValue).toEqual({
        seconds: '1',
        nanos: 0,
      });
    });
  });

  describe('status value', () => {
    beforeEach(() => {
      component.column = {
        key: 'status',
        type: 'status',
        sortable: true,
        name: 'Status'
      };
      component.element = element;
    });

    it('should set statusValue', () => {
      expect(component.statusValue).toEqual(SessionStatus.SESSION_STATUS_RUNNING);
    });

    it('should get status label', () => {
      expect(component.statusLabel()).toEqual('Running');
    });
  });

  describe('date value', () => {
    beforeEach(() => {
      column.key = 'createdAt';
      column.type = 'date';
      component.column = column;
      component.element = element;
    });

    it('should set dateValue', () => {
      expect(component.dateValue).toEqual(new Date(1343540000));
    });

    it('should return null if value is undefined', () => {
      component.element = {
        raw: {}
      } as ArmonikData<SessionRaw, TaskOptions>;
      expect(component.dateValue).toBeNull();
    });
  });

  describe('object value', () => {
    beforeEach(() => {
      component.column = {
        key: 'options',
        type: 'object',
        sortable: true,
        name: 'Options'
      };
      component.element = element;
    });

    it('should set value', () => {
      expect(component.value).toEqual(options);
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      component.column.key = 'sessionId';
      component.element = element;
    });

    it('should emit changeSelection', () => {
      const spy = jest.spyOn(component.changeSelection, 'emit');
      component.onSelectionChange();
      expect(spy).toHaveBeenCalled();
    });

    it('should tip to deselect if it is selected', () => {
      component.isSelected = true;
      expect(component.checkboxLabel()).toEqual('Deselect Task session-id');
    });

    it('should tip to select if it is unselected', () => {
      component.isSelected = false;
      expect(component.checkboxLabel()).toEqual('Select Task session-id');
    });
  });

  describe('create link', () => {
    beforeEach(() => {
      component.column = {
        link: '/sessions',
        key: 'sessionId',
        type: 'link',
        sortable: true,
        name: 'Session ID'
      };
    });

    it('should create a link with queryParams', () => {
      component.element = element;
      component.createLink();
      expect(component.link).toEqual('/sessions');
    });

    it('should create a link without queryParams', () => {
      const elementCopy = structuredClone(element);
      elementCopy.queryParams = undefined;
      elementCopy.raw.sessionId = 'session-id';
      component.element = elementCopy;
      component.createLink();
      expect(component.link).toEqual(`${component.column.link}/${elementCopy.raw[component.column.key as keyof DataRaw]}`);
    });

    it('should set an empty link', () => {
      component.column.link = undefined;
      component.createLink();
      expect(component.link).toEqual('');
    });
  });

  describe('navigate', () => {
    it('should navigate to link', () => {
      component.column = {
        link: '/sessions',
        key: 'sessionId',
        type: 'link',
        sortable: true,
        name: 'Session ID'
      };
      component.createLink();
      component.navigate();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions'], { queryParams: element.queryParams?.get('sessionId') });
    });
  });
});