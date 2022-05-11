import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

@Component({
  template: `<ui-header>
    <div branding>title</div>
    <div actions>actions</div>
  </ui-header>`,
})
class TestHostComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a class "branding"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.branding')).toBeTruthy();
  });

  it('should have a div[branding] with title"', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const header = fixture.nativeElement;

    expect(header.querySelector('div[branding]').textContent).toContain(
      'title'
    );
  });

  it('should have a class header-actions', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.header-actions')).toBeTruthy();
  });

  it('should have a div[actions] with action', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const header = fixture.nativeElement;

    expect(header.querySelector('div[actions]').textContent).toContain(
      'actions'
    );
  });
});
