import { TestBed } from '@angular/core/testing';
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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectListComponent
      ]
    }).inject(InspectListComponent);
    component.list = list;
    component.queryParams = queryParams;
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
    it('should create a correct Params object', () => {
      expect(component.queryParams).toEqual(finalParams);
    });

    it('should not update queryParams if it is undefined', () => {
      component.queryParams = undefined;
      expect(component.queryParams).toEqual(finalParams);
    });
    
    it('should update queryParams if a new one is provided', () => {
      component.queryParams = '0-options-2-0';
      expect(component.queryParams).toEqual({
        '0-options-2-0': list[0],
        '1-options-2-0': list[1],
        '2-options-2-0': list[2]
      });
    });
  });
});