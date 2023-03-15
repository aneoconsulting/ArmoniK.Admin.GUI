import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { DashboardComponent } from './page-dashboard-feature.component';

describe('PagesDashboardFeatureComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        GrpcCoreModule.forRoot(),
        GrpcWebClientModule.forRoot({
          settings: {
            host: '',
          },
        }),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
