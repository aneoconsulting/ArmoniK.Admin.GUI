import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { BrowserTitleService } from './browser-title.service';

describe('BrowserTitleService', () => {
  let service: BrowserTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrowserTitleService,
        {
          provide: Title,
          useValue: {
            setTitle: jasmine.createSpy('setTitle'),
          },
        },
      ],
    });
    service = TestBed.inject(BrowserTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the browser title', () => {
    const title = 'test';
    service.setTitle(title);

    const titleService = TestBed.inject(Title);

    expect(titleService.setTitle).toHaveBeenCalledWith(title + ' | Armonik');
  });
});
