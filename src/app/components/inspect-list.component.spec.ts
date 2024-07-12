import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { InspectListComponent } from './inspect-list.component';

describe('InspectListComponent', () => {
  let component: InspectListComponent;
  const list = ['item1', 'item2', 'item3'];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectListComponent,
        IconsService,
      ]
    }).inject(InspectListComponent);
    component.list = list;
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
});