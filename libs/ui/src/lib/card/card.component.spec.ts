import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
  template: `<ui-card>
    <span title>title</span>
    <span link>link</span>
  </ui-card>`,
})
class TestHostComponent {}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CardComponent, TestHostComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be an article with class "card"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('article.card')).toBeTruthy();
  });

  it('should have a h3 with class "card-title"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3.card-title')).toBeTruthy();
  });

  it('should have a footer with class "card-footer"', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('footer.card-footer')).toBeTruthy();
  });

  it('should have a card-block before the footer', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.card :first-child').classList).toContain(
      'card-block'
    );
  });

  it('should have a span[title] with title"', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const card = fixture.nativeElement;

    expect(card.querySelector('span[title]').textContent).toContain('title');
  });

  it('should have a span[link] with link"', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    const card = fixture.nativeElement;

    expect(card.querySelector('span[link]').textContent).toContain('link');
  });
});
