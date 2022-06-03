import { TestBed } from '@angular/core/testing';
import { BrowserTitleService } from './browser-title.service';

describe('BrowserTitleService', () => {
  let service: BrowserTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrowserTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the browser title', () => {
    const title = 'test';
    service.setTitle(title);

    expect(service.title).toEqual(title + ' | Armonik');
  });
});
