import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateModule } from '@ngx-translate/core';

import { ApplicationCardComponent } from './application-card.component';

describe('ApplicationCardComponent', () => {
  let component: ApplicationCardComponent;
  let fixture: ComponentFixture<ApplicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationCardComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
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

  it('should contains a anchor element in the footer', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer a')).toBeTruthy();
  });

  it('should have a link styled like button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer a').getAttribute('class')).toContain(
      'btn btn-sm btn-link'
    );
  });

  it("should have a link to go to 'sessions'", () => {
    component.application = {
      _id: 'application_1',
    };
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer a').getAttribute('href')).toBe(
      '/admin/applications/application_1/sessions'
    );
  });

  it('should have a "card-block" class with 3 children', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.card-block').children.length).toBe(3);
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
      _id: 'application_1',
      countTasksError: 2,
    };
    component.application = application;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    // select first card-title
    const cardTitle = (
      compiled.querySelectorAll('.card-title') as HTMLElement[]
    )[0];
    expect(cardTitle.textContent).toContain(
      application.countTasksError?.toString()
    );
  });

  it('should have a correct processing count', () => {
    const application: Application = {
      _id: 'application_1',
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

  it('should have a correct processing count', () => {
    const application: Application = {
      _id: 'application_1',
      countTasksCompleted: 2,
    };
    component.application = application;
    fixture.detectChanges();

    const compiled = fixture.debugElement.nativeElement;
    // select first card-title
    const cardTitle = (
      compiled.querySelectorAll('.card-title') as HTMLElement[]
    )[2];
    expect(cardTitle.textContent).toContain(
      application.countTasksCompleted?.toString()
    );
  });
});
