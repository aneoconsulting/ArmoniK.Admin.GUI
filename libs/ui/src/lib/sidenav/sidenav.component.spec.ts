import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';

@Component({
  template: `<ui-sidenav> links </ui-sidenav>`,
})
class TestHostComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidenavComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a nav', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });

  it('should add a class "sidenav" to host', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.classList).toContain('sidenav');
  });

  it('should have a "section.sidenav-content"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('section.sidenav-content')).toBeTruthy();
  });

  it('should have a "section.sidenav-content" with "links"', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const sidenav = fixture.nativeElement;

    expect(
      sidenav.querySelector('section.sidenav-content').textContent
    ).toContain('links');
  });
});
