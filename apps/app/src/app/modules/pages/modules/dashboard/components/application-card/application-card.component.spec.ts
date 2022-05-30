import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ApplicationCardComponent } from './application-card.component';

describe('ApplicationCardComponent', () => {
  let component: ApplicationCardComponent;
  let fixture: ComponentFixture<ApplicationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationCardComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        {
          provide: APP_BASE_HREF,
          useValue: '/',
        },
      ],
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
});
