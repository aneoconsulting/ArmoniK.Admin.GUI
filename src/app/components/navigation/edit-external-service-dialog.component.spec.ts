import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditExternalServiceDialogComponent } from './edit-external-service-dialog.component';

describe('EditExternalServiceDialogComponent', () => {
  let component: EditExternalServiceDialogComponent;
  let fixture: ComponentFixture<EditExternalServiceDialogComponent>;

  const externalService = {
    name: 'service',
    url: 'url',
    icon: 'main'
  };
  const mockMatDialogData = {
    externalService: externalService
  };
  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        EditExternalServiceDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExternalServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    component.ngOnInit();
    expect(component.externalService).toEqual(mockMatDialogData.externalService);
  });

  it('should close dialog on submit', () => {
    component.onSubmit(externalService);
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(externalService);
  });

  it('should close dialog on no click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});