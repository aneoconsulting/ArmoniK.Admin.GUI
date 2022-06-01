import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AlertErrorComponent } from './alert-error.component';

describe('AlertErrorComponent', () => {
  let component: AlertErrorComponent;
  let fixture: ComponentFixture<AlertErrorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AlertErrorComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        ClarityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have an "alert-text" class when there is no errors', () => {
    expect(fixture.nativeElement.querySelector('.alert-text')).toBeFalsy();
  });

  it('should have an "alert-text" class when there is an error', () => {
    component.errors = [{ operation: 'test', status: 200 }];
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.alert-text')).toBeTruthy();
  });

  it('should have an "danger" on clralerttype property when there is an error', () => {
    component.errors = [{ operation: 'test', status: 200 }];
    fixture.detectChanges();

    expect(
      fixture.nativeElement
        .querySelector('clr-alert')
        .getAttribute('clralerttype')
    ).toBe('danger');
  });
});
