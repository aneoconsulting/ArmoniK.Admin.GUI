import { FilterDateOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Scope } from '@app/types/config';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { FiltersCacheService } from '@services/filters-cache.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { InspectListComponent } from './inspect-list.component';

describe('InspectListComponent', () => {
  let component: InspectListComponent;
  const list = ['item1', 'item2', 'item3'];
  const queryParams = '0-root-1-0';
  const finalParams = {
    '0-root-1-0': list[0],
    '1-root-1-0': list[1],
    '2-root-1-0': list[2]
  };
  const link: Scope = 'tasks';

  const mockClipboard = {
    copy: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
  };

  const mockFiltersCacheService = {
    set: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectListComponent,
        IconsService,
        { provide: Clipboard, useValue: mockClipboard },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: FiltersCacheService, useValue: mockFiltersCacheService },
        { provide: Router, useValue: mockRouter }
      ]
    }).inject(InspectListComponent);
    component.list = list;
    component.queryParams = queryParams;
    component.redirectLink = link;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setting list', () => {
    it('should set list', () => {
      expect(component.list).toEqual(list);
    });
  
    it('should not update list if it is undefined', () => {
      component.list = undefined;
      expect(component.list).toEqual(list);
    });
  
    it('should update list if a new one is provided', () => {
      component.list = [];
      expect(component.list).toEqual([]);
    });
  });

  describe('setting queryParams', () => {
    describe('with a list length smaller or equal than 50', () => {
      it('should create a correct Params object', () => {
        expect(component['_queryParams']).toEqual(finalParams);
      });
  
      it('should not update queryParams if it is undefined', () => {
        component.queryParams = undefined;
        expect(component['_queryParams']).toEqual(finalParams);
      });
      
      it('should update queryParams if a new one is provided', () => {
        component.queryParams = '0-options-2-0';
        expect(component['_queryParams']).toEqual({
          '0-options-2-0': list[0],
          '1-options-2-0': list[1],
          '2-options-2-0': list[2]
        });
      });
    });

    describe('with a list length bigger than 50', () => {
      const filtersList: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [];
      const bigList: string[] = [];

      beforeAll(() => {
        for(let i=0; i <= 50; i++) {
          bigList.push(i.toString());
          filtersList.push([{
            field: 1,
            for: 'root',
            operator: 0,
            value: i.toString()
          }]);
        }
      });

      beforeEach(() => {
        component.list = bigList;
        component.queryParams = queryParams;
      });

      it('should create a list of filters', () => {
        expect(component['filters']).toEqual(filtersList);
      });
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  describe('copy', () => {
    const id = 'id';

    beforeEach(() => {
      component.copy(id);
    });

    it('should copy the provided Id', () => {
      expect(mockClipboard.copy).toHaveBeenCalledWith(id);
    });

    it('should notify on copy', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('navigate', () => {
    const filters = [[{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
      operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
      value: 'a'
    }]];

    beforeEach(() => {
      component['filters'].push(...(filters as FiltersOr<FiltersEnums, FiltersOptionsEnums>));
    });
    it('should add filters to the cache', () => {
      component.navigate();
      expect(mockFiltersCacheService.set).toHaveBeenCalledWith(link, filters);
    });
    it('should navigate with queryParams', () => {
      component.navigate();
      expect(mockRouter.navigate).toHaveBeenCalledWith([`/${link}`], { queryParams: component['_queryParams'] });
    });
    it('should not navigate without redirectLink', () => {
      component.redirectLink = undefined;
      component.navigate();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});