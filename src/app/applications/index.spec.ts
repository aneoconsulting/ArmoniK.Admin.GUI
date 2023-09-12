
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';

const mockAutoRefresh = {
  createInterval: jest.fn(),
  autoRefreshTooltip: jest.fn()
};

const mockShareUrl = {
  generateSharableURL: jest.fn()
};

const mockApplicationGrpc = {
  list$: jest.fn()
};

/**
 * @jest-environment node
 */
describe('My first test', () => {

  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IndexComponent],
      providers: [
        { provide: AutoRefreshService, useValue: mockAutoRefresh },
        { provide: ShareUrlService, useValue: mockShareUrl },
        { provide: ApplicationsGrpcService, useValue: mockApplicationGrpc },
        ApplicationsIndexService
      ],
      
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy;
  });
}
);