import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { ShareUrlComponent } from './share-url.component';

describe('ShareUrlComponent', () => {

  let component: ShareUrlComponent;
  const sharableURL = 'https://example.com/';

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShareUrlComponent,
        IconsService
      ]
    }).inject(ShareUrlComponent);
    component.sharableURL = sharableURL;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should have a sharableURL property', () => {
    expect(component.sharableURL).toEqual(sharableURL);
  });

  it('Should copy the link', () => {
    component.onCopied();
    expect(component.copied).toBeTruthy();
  });

  it('Should not be copied one second after', fakeAsync(() => {
    component.onCopied();
    tick(1250);
    expect(component.copied).toBeFalsy();
  }));
});