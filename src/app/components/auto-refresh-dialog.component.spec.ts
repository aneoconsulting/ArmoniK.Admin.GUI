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

  describe('onNumberChange', () => {
    it('should update component.value if the event value is correct', async () => {
      const inputEvent = {
        target: {
          value: 2
        }
      } as unknown as Event;
  
      component.onNumberChange(inputEvent);
      expect(component.value).toEqual(2);
    });

    it('should update component.value to 0 if the event value is null', async () => {
      const inputEvent = {
        target: {
          value: null
        }
      } as unknown as Event;
  
      component.onNumberChange(inputEvent);
      expect(component.value).toEqual(0);
    });

    it('should update component.value to 0 if the event value is NaN', async () => {
      const inputEvent = {
        target: {
          value: 'NaNValue'
        }
      } as unknown as Event;
  
      component.onNumberChange(inputEvent);
      expect(component.value).toEqual(0);
    });
  });


  describe('onOptionSelected', () => {
    it('should update component.value if the event value is correct', async () => {
      const inputEvent = {
        option: {
          value: 2
        }
      } as unknown as MatAutocompleteSelectedEvent;
  
      component.onOptionSelected(inputEvent);
      expect(component.value).toEqual(2);
    });

    it('should update component.value to 0 if the event value is null', async () => {
      const inputEvent = {
        option: {
          value: null
        }
      } as unknown as MatAutocompleteSelectedEvent;
  
      component.onOptionSelected(inputEvent);
      expect(component.value).toEqual(0);
    });

    it('should update component.value to 0 if the event value is NaN', async () => {
      const inputEvent = {
        option: {
          value: 'NaNValue'
        }
      } as unknown as MatAutocompleteSelectedEvent;
  
      component.onOptionSelected(inputEvent);
      expect(component.value).toEqual(0);
    });
  });
});