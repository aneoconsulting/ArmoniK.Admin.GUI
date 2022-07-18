import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TimerIntervalSelectorComponent } from './timer-interval-selector.component';

describe('TimerIntervalSelectorComponent', () => {
  let component: TimerIntervalSelectorComponent;
  let fixture: ComponentFixture<TimerIntervalSelectorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TimerIntervalSelectorComponent],
      imports: [ClarityModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerIntervalSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a clr-dropdown', () => {
    expect(fixture.nativeElement.querySelector('clr-dropdown')).toBeTruthy();
  });

  it('should have a clr-dropdown-menu', () => {
    // Open dropdown menu
    fixture.nativeElement.querySelector('clr-dropdown > button').click();
    expect(
      fixture.nativeElement.querySelector('clr-dropdown-menu')
    ).toBeTruthy();
  });

  it('should have a button for each timer', () => {
    // Open dropdown menu
    fixture.nativeElement.querySelector('clr-dropdown > button').click();

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('clr-dropdown-menu > button')
        .length
    ).toBe(component.timersList.length);
  });

  it('should have a button disabled for the current timer', () => {
    // Open dropdown menu
    fixture.nativeElement.querySelector('clr-dropdown > button').click();

    fixture.detectChanges();

    const index = component.timersList.indexOf(component.timer as number);

    console.log(
      fixture.nativeElement.querySelectorAll('clr-dropdown-menu > button')[
        index
      ].disabled
    );

    expect(
      fixture.nativeElement.querySelectorAll('clr-dropdown-menu > button')[
        index
      ].ariaDisabled
    ).toBeTruthy();
  });

  it('should trigger a click', () => {
    spyOn(component, 'onClick');
    // Open dropdown menu
    fixture.nativeElement.querySelector('clr-dropdown > button').click();

    fixture.detectChanges();

    fixture.nativeElement
      .querySelectorAll('clr-dropdown-menu > button')[0]
      .click();

    expect(component.onClick).toHaveBeenCalled();
  });

  it('should emit an event on click', () => {
    const changes = { emit: jasmine.createSpy('changes') };
    component.timerChange = changes as unknown as EventEmitter<number>;
    // Open dropdown menu
    fixture.nativeElement.querySelector('clr-dropdown > button').click();

    fixture.detectChanges();

    const index = component.timersList.indexOf(component.timer as number);

    fixture.nativeElement
      .querySelectorAll('clr-dropdown-menu > button')
      [index].click();

    expect(changes.emit).toHaveBeenCalledWith(component.timersList[index]);
  });
});
