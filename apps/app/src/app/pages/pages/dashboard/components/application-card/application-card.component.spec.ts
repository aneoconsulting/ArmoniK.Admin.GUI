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
        sessions: [],
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
        sessions: [],
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
        sessions: [],
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
        sessions: [],
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
        sessions: [],
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

    it('should emit an event when the footer button is clicked', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        sessions: [],
      };
      component.application = application;
      fixture.detectChanges();

      //  Add a spy on the event emitter
      const spy = spyOn(component, 'onClick');

      const compiled = fixture.debugElement.nativeElement;
      const button = compiled.querySelector('footer button');
      button.click();

      expect(component.onClick).toHaveBeenCalledWith();
      spy.calls.reset();
    });

    it('should have a "card-block" class with 4 children', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('.card-block').children.length).toBe(4);
    });

    it('should have a 0 in all card-title__value', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(
        (
          compiled.querySelectorAll('.card-title__value') as HTMLElement[]
        ).forEach((element) => {
          expect(element.textContent).toContain('0');
        })
      );
    });

    it('should have a correct error count', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksError: 2,
        sessions: [],
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

    it('should have a correct processing count', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksProcessing: 2,
        sessions: [],
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

    it('should have a correct completed count', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksCompleted: 2,
        sessions: [],
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

    it('should have a correct pending count', () => {
      const application: Application = {
        _id: {
          applicationName: 'application_1',
          applicationVersion: '1.0.0',
        },
        countTasksPending: 2,
        sessions: [],
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
