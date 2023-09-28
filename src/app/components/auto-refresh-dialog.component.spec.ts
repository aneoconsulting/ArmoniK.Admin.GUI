import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoRefreshDialogData } from '@app/types/dialog';
import { AutoRefreshDialogComponent } from './auto-refresh-dialog.component';

describe('AutoRefreshDialogComponent', () => {
  
  let component: AutoRefreshDialogComponent;
  let fixture: ComponentFixture<AutoRefreshDialogComponent>;
  const model: AutoRefreshDialogData = {
    value: 3
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BrowserAnimationsModule ],
      providers: [
        AutoRefreshDialogComponent,
        { provide: MatDialogRef, useValue: {
          close: () => jest.fn()
        }},
        { provide: MAT_DIALOG_DATA, useValue: model}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshDialogComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should have the value defined by the dialog ref', () => {
    expect(component.value).toEqual(3);
  });

  describe('onNumberChange should change value on event', () => {
    it('when value is a number', () => {
      const myEvent = { target: { value: 1 } } as unknown as Event;
      component.onNumberChange(myEvent);
      expect(component.value).toEqual(1);
    });
    it('when value is a stringified number', () => {
      const myEvent = { target: { value: '2' } } as unknown as Event;
      component.onNumberChange(myEvent);
      expect(component.value).toEqual(2);
    });
    it('when value is a string', () => {
      const myEvent = { target: { value: 'This is a string' } } as unknown as Event;
      component.onNumberChange(myEvent);
      expect(component.value).toEqual(0);
    });
    it('when value is null', () => {
      const myEvent = { target: { value: null } } as unknown as Event;
      component.onNumberChange(myEvent);
      expect(component.value).toEqual(0);
    });
  });
  
  describe('onOptionSelected should change value on event', () => {
    it('when value is a number', () => {
      const myEvent = { option: { value: 1 } } as unknown as MatAutocompleteSelectedEvent;
      component.onOptionSelected(myEvent);
      expect(component.value).toEqual(1);
    });
    it('when value is a stringified number', () => {
      const myEvent = { option: { value: '2' } } as unknown as MatAutocompleteSelectedEvent;
      component.onOptionSelected(myEvent);
      expect(component.value).toEqual(2);
    });
    it('when value is a string', () => {
      const myEvent = { option: { value: 'This is a string' } } as unknown as MatAutocompleteSelectedEvent;
      component.onOptionSelected(myEvent);
      expect(component.value).toEqual(0);
    });
    it('when value is null', () => {
      const myEvent = { target: { value: null } } as unknown as Event;
      component.onNumberChange(myEvent);
      expect(component.value).toEqual(0);
    });
  });

  it('Should call dialogRef.close on onNoClick', () => {
    const mySpy = jest.spyOn(component.dialogRef, 'close');
    component.onNoClick();
    expect(mySpy).toHaveBeenCalled();
  });
});