import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { QueryParamsService } from '@services/query-params.service';
import { IndexComponent } from './index.component';

const mockConfigService = {
  structuredClone: jest.fn(),
  defaultApplications: {
    columns: []
  }
};

describe('Application component', () => {

  let component: IndexComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [IndexComponent, RouterTestingModule],
      providers: [
        { provide: Window, useValue: window },
        QueryParamsService,
        { provide: DefaultConfigService, useValue: mockConfigService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    component = TestBed.createComponent(IndexComponent).componentInstance;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });
});