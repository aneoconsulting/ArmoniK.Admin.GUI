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

  it('should be an article with "card" class', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('article.card')).toBeTruthy();
  });

  it('should contains a h3 with "card-header" class', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3.card-header')).toBeTruthy();
  });

  it('should contains a footer with "card-footer" class', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer.card-footer')).toBeTruthy();
  });

  it('should contains a button element in the footer', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer button')).toBeTruthy();
  });

  it('should have a button styled like a link', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(
      compiled.querySelector('footer button').getAttribute('class')
    ).toContain('btn btn-sm btn-link');
  });

  it('should have name and version in the header', () => {
    component.application = {
      _id: {
        applicationName: 'application_1',
        applicationVersion: '1.0.0',
      },
    } as Application;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3.card-header').textContent).toContain(
      'application_1'
    );
    expect(compiled.querySelector('h3.card-header').textContent).toContain(
      '1.0.0'
    );
  });

  it('should emit an event when the footer button is clicked', () => {
    const application: Application = {
      _id: {
        applicationName: 'application_1',
        applicationVersion: '1.0.0',
      },
    };
    component.application = application;
    fixture.detectChanges();

    //  Add a spy on the event emitter
    spyOn(component, 'onClick');

    const compiled = fixture.debugElement.nativeElement;
    const button = compiled.querySelector('footer button');
    button.click();

    expect(component.onClick).toHaveBeenCalledWith();
  });

  it('should have a "card-block" class with 4 children', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.card-block').children.length).toBe(4);
  });

  it('should have a 0 in all card-title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(
      (compiled.querySelectorAll('.card-title') as HTMLElement[]).forEach(
        (element) => {
          expect(element.textContent).toContain('0');
        }
      )
    );
  });

  it('should have a correct error count', () => {
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

  it('should have a correct processing count', () => {
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

  it('should have a correct completed count', () => {
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

  it('should have a correct pending count', () => {
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
