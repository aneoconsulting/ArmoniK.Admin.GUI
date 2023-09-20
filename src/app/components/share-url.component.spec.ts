import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { ShareUrlComponent } from './share-url.component';

describe('ShareUrlComponent', () => {

  let component: ShareUrlComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShareUrlComponent,
        IconsService
      ]
    }).inject(ShareUrlComponent);
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
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