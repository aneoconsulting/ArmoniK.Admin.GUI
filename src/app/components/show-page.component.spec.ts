import { TestBed } from '@angular/core/testing';
import { DataRaw } from '@app/types/data';
import { ShowPageComponent } from './show-page.component';

describe('ShowPageComponent', () => {
  let component: ShowPageComponent<DataRaw>;
  
  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowPageComponent,
      ]
    }).inject(ShowPageComponent);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on refresh', () => {
    const refreshSpy = jest.spyOn(component.refresh, 'emit');
    component.onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
  });
});