import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first, take } from 'rxjs';
import { TimeComponent } from './time.component';

describe('TimeComponent', () => {
  let component: TimeComponent;
  let fixture: ComponentFixture<TimeComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TimeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('time$', () => {
    it('should return a new date on subscription', (done) => {
      component.time$.pipe(first()).subscribe((date) => {
        expect(date).toBeInstanceOf(Date);
        done();
      });
    });

    it('should return a new date every second', (done) => {
      let firstDate: Date;
      let secondDate: Date;

      component.time$.pipe(take(2)).subscribe((date) => {
        if (!firstDate) {
          firstDate = date;
        } else {
          secondDate = date;
          expect(secondDate).not.toEqual(firstDate);
          expect(secondDate.getTime() - firstDate.getTime()).toBe(1000);
          done();
        }
      });
    });
  });
});
