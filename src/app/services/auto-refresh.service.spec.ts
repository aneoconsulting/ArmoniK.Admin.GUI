import { TestBed } from '@angular/core/testing';
import { AutoRefreshService } from './auto-refresh.service';

describe('Auto-refresh service', () => {
  
  let service: AutoRefreshService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoRefreshService]
    });
    service = TestBed.inject(AutoRefreshService);
  });
  
  it('Should run', () => {
    expect(service).toBeTruthy();
  });
});