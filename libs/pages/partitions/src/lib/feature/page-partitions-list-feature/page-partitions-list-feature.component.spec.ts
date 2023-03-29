import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { PartitionsListComponent } from './page-partitions-list-feature.component';
import { RouterModule } from '@angular/router';

describe('PagesDashboardFeatureComponent', () => {
  let component: PartitionsListComponent;
  let fixture: ComponentFixture<PartitionsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        PartitionsListComponent,
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
    fixture = TestBed.createComponent(PartitionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
