import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';

import { ApplicationCardComponent } from './application-card.component';

describe('ApplicationCardComponent', () => {
  let component: ApplicationCardComponent;
  let fixture: ComponentFixture<ApplicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationCardComponent],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ClarityModule,
        UiModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClick', () => {
    it('should emit the application', () => {
      const application: Application = {
        _id: {
          applicationName: 'test',
          applicationVersion: '1.0.0',
        },
      };
      component.application = application;

      const spy = spyOn(component.applicationChange, 'emit');
      component.onClick();

      expect(component.applicationChange.emit).toHaveBeenCalledWith(
        application
      );

      spy.calls.reset();
    });

    it('should emit when button is clicked', () => {
      const application: Application = {
        _id: {
          applicationName: 'test',
          applicationVersion: '1.0.0',
        },
      };
      component.application = application;

      const spy = spyOn(component.applicationChange, 'emit');

      const button = fixture.debugElement.nativeElement.querySelector('button');
      button.click();

      expect(component.applicationChange.emit).toHaveBeenCalledWith(
        application
      );

      spy.calls.reset();
    });
  });

  describe('tasks counter', () => {
    it('should have a correct error value', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksError: 2,
      };
      component.application = application;
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      // select first card-title
      const cardTitle = (
        compiled.querySelectorAll('.card-title') as HTMLElement[]
      )[2];
      expect(cardTitle.textContent).toContain(
        application.countTasksError?.toString()
      );
    });

    it('should have a correct processing value', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksProcessing: 2,
      };
      component.application = application;
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      // select first card-title
      const cardTitle = (
        compiled.querySelectorAll('.card-title') as HTMLElement[]
      )[1];
      expect(cardTitle.textContent).toContain(
        application.countTasksProcessing?.toString()
      );
    });

    it('should have a correct completed value', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksCompleted: 2,
      };
      component.application = application;
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      // select first card-title
      const cardTitle = (
        compiled.querySelectorAll('.card-title') as HTMLElement[]
      )[3];
      expect(cardTitle.textContent).toContain(
        application.countTasksCompleted?.toString()
      );
    });

    it('should have a correct pending value', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksPending: 2,
      };
      component.application = application;
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      // select first card-title
      const cardTitle = (
        compiled.querySelectorAll('.card-title') as HTMLElement[]
      )[0];
      expect(cardTitle.textContent).toContain(
        application.countTasksPending?.toString()
      );
    });
  });
});
