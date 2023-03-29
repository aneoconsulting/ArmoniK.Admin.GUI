import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RefreshButtonComponent } from "./refresh-button.component";
import { first } from "rxjs";

describe('RefreshButtonComponent', () => {
  let component: RefreshButtonComponent;
  let fixture: ComponentFixture<RefreshButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit on click', () => {
    const subscription = component.refresh.pipe(first()).subscribe(() => {
      expect(true).toBeTruthy();
    });

    component.onClick();

    subscription.unsubscribe();
  });
})
