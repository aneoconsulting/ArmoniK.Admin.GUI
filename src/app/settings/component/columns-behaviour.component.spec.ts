import { TestBed } from '@angular/core/testing';
import { ColumnsBehaviourValues } from '@app/types/column.type';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { ColumnsBehaviourComponent } from './columns-behaviour.component';

describe('ColumnsBehaviourComponent', () => {
  let component: ColumnsBehaviourComponent;

  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  const mockDefaultConfigService = {
    defaultTableColumnsBehaviour: {
      'select': ColumnsBehaviourValues.LEFT,
      'actions': undefined as unknown as ColumnsBehaviourValues // Check component line 39 condition
    } as Record<string, ColumnsBehaviourValues>,
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ColumnsBehaviourComponent,
        { provide: StorageService, useValue: mockStorageService },
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
      ],
    }).inject(ColumnsBehaviourComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('init', () => {
    it('should look for the stored data', () => {
      expect(mockStorageService.getItem).toHaveBeenCalledWith('table-columns-behaviour', true);
    });

    it('should set the default text value for each column', () => {
      expect([...component.columns.values()].map(content => content.value)).toEqual(['Stick on the left', 'Unset']);
    });
  });

  describe('getBehaviourFromText', () => {
    it('should return UNSET is the text is "unset"', () => {
      expect(component['getBehaviourFromText'](component.behaviours[0])).toEqual(ColumnsBehaviourValues.UNSET);
    });
    
    it('should return LEFT is the text is "Stick on the left"', () => {
      expect(component['getBehaviourFromText'](component.behaviours[1])).toEqual(ColumnsBehaviourValues.LEFT);
    });
    
    it('should return RIGHT is the text is "Stick on the right"', () => {
      expect(component['getBehaviourFromText'](component.behaviours[2])).toEqual(ColumnsBehaviourValues.RIGHT);
    });
  });

  describe('updateBehaviour', () => {
    beforeEach(() => {
      component.updateBehaviour('select', component.behaviours[2]);
    });

    it('should update the correct text value', () => {
      expect(component.columns.get('select')?.value).toBe(component.behaviours[2]);
    });

    it('should store the new value', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith(
        'table-columns-behaviour',
        { 
          'actions': ColumnsBehaviourValues.UNSET,
          'select': ColumnsBehaviourValues.RIGHT,
        }
      );
    });
  });
});