import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AutoRefreshActivatorComponent } from './auto-refresh-activator.component';

describe('AutoRefreshActivatorComponent', () => {
  let component: AutoRefreshActivatorComponent;
  let fixture: ComponentFixture<AutoRefreshActivatorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AutoRefreshActivatorComponent],
      imports: [ClarityModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshActivatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a class "btn-primary" when enabled', () => {
    component.isEnabled = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').classList).toContain(
      'btn-primary'
    );
  });

  it('should have a class "btn-danger-outline" when disabled', () => {
    component.isEnabled = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').classList).toContain(
      'btn-danger-outline'
    );
  });

  it('should trigger "onClick" when button is clicked', () => {
    spyOn(component, 'onClick');
    fixture.nativeElement.querySelector('button').click();
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should emit an event on click', () => {
    const autoRefreshChange = { emit: jasmine.createSpy('emit') };
    component.autoRefreshChange =
      autoRefreshChange as unknown as EventEmitter<null>;
    component.onClick();
    expect(autoRefreshChange.emit).toHaveBeenCalled();
  });
});
