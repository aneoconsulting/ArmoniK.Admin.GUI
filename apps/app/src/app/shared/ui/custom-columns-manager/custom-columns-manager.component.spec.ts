import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { CustomColumnsManagerComponent } from './custom-columns-manager.component';

describe('CustomColumnsManagerComponent', () => {
  let component: CustomColumnsManagerComponent;
  let fixture: ComponentFixture<CustomColumnsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomColumnsManagerComponent,
        TranslateModule.forRoot(),
        ClarityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomColumnsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
