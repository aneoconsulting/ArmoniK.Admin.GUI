import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagesComponent } from './pages.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { UiModule } from '@armonik.admin.gui/ui';
import { RouterTestingModule } from '@angular/router/testing';

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PagesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a "clr-main-container"', () => {
    expect(
      fixture.nativeElement.querySelector('clr-main-container')
    ).toBeTruthy();
  });

  it('should contains a "content-container" class', () => {
    expect(
      fixture.nativeElement.querySelector('.content-container')
    ).toBeTruthy();
  });

  it('should contains a "content-area" class', () => {
    expect(fixture.nativeElement.querySelector('.content-area')).toBeTruthy();
  });

  it('should have a router-outlet', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should have a header', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ui-header')).toBeTruthy();
  });

  it('should contain a title with "Armonik"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ui-header .title').textContent).toContain(
      'ArmoniK'
    );
  });

  it('should contains a list of language', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ui-header .language')).toBeTruthy();
  });
});
