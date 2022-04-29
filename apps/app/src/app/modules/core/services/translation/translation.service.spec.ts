import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';

describe('LanguageService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
