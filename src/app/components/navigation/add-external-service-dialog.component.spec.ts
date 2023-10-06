import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExternalService } from '@app/types/external-service';
import { AddExternalServiceDialogComponent } from './add-external-service-dialog.component';

describe('AddExternalServiceDialogComponent', () => {
  let component: AddExternalServiceDialogComponent;
  let fixture: ComponentFixture<AddExternalServiceDialogComponent>;

  const mockMatDialogData = {};
  const mockMatDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        AddExternalServiceDialogComponent,
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExternalServiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on submit', () => {
    const externalService: ExternalService = {
      name: 'service',
      url: 'url',
      icon: 'main'
    };
    component.onSubmit(externalService);
    expect(mockMatDialogRef.close).toHaveBeenCalledWith(externalService);
  });

  it('should close dialog on no click', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });
});