import { TestBed } from '@angular/core/testing';
import { QueryParamsService } from './query-params.service';
import { ShareUrlService } from './share-url.service';

describe('Share Url service', () => {

  let service: ShareUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ShareUrlService,
        { provide: Window, useValue: window },
        QueryParamsService
      ]
    });
    service = TestBed.inject(ShareUrlService);
  });

  it('should run', () => {
    expect(service).toBeTruthy();
  });
});