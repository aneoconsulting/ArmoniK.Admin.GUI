import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AutoRefreshDialogComponent } from './auto-refresh-dialog.component';

describe('AutoRefreshDialogComponent', () => {
  let component: AutoRefreshDialogComponent;
  let fixture: ComponentFixture<AutoRefreshDialogComponent>;
  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
        AutoRefreshDialogComponent,
        { provide: MatDialogRef<AutoRefreshDialogComponent>, useValue: mockMatDialogRef  },
        { provide: MAT_DIALOG_DATA, useValue: {
          value: 1
        } },
        provideAnimations()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  test('ngOnInit should update component.value', () => {
    component.ngOnInit();
  });

  test('onNoClick', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

  test('onNumberChange should update component.value if the event value is correct', async () => {
    const inputEvent = {
      target: {
        value: 2
      }
    } as unknown as Event;

    component.onNumberChange(inputEvent);
    expect(component.value).toEqual(2);
  });

  test('onOptionSelected should update component.value if the event value is correct', async () => {
    const selectedEvent = {
      option: {
        value: 2
      }
    } as unknown as MatAutocompleteSelectedEvent;

    component.onOptionSelected(selectedEvent);
    expect(component.value).toEqual(2);
  });

  describe('_setValue', () => {
    it('should change the value of component.value', () => {
      component['_setValue'](3);
      expect(component.value).toEqual(3);
    });

    it('Should set the component.value to 0 in case of a null parameter',() => {
      component['_setValue'](null);
      expect(component.value).toEqual(0);
    });

    it('Should set the component.value to 0 in case of a NaN parameter', () => {
      component['_setValue']('NaNValue');
      expect(component.value).toEqual(0);
    });
  });
});