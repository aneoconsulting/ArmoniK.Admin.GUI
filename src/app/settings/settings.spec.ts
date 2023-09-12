import {  TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { NotificationService } from '@services/notification.service';
import { IndexComponent } from './index.component';
import { IconsService } from '../services/icons.service';
import { NavigationService } from '../services/navigation.service';
import { ShareUrlService } from '../services/share-url.service';
import { StorageService } from '../services/storage.service';

describe('IndexComponent', () => {


  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[ 
        IndexComponent
      ],
      providers: [
        MockComponent(IndexComponent),
        MockProviders(IconsService,NavigationService, ShareUrlService, NotificationService, StorageService, Window, Storage)

      ]
    }).compileComponents();

  }); 

  it('should create', () => {
    const fixture = TestBed.createComponent(IndexComponent); 
    const index = fixture.componentInstance;

    expect(index).toBeTruthy();
  });
  
  it('remove settings item', () => {
     
  });
  
});