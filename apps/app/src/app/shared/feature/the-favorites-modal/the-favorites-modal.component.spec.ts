import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { first, Observable } from 'rxjs';
import { TheFavoritesModalComponent } from './the-favorites-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { FavoritesService } from '../../util';

describe('TheFavoritesModalComponent', () => {
  let component: TheFavoritesModalComponent;
  let fixture: ComponentFixture<TheFavoritesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TheFavoritesModalComponent,
        TranslateModule.forRoot(),
        RouterTestingModule,
      ],
      providers: [
        {
          provide: FavoritesService,
          useValue: {
            add: jasmine.createSpy('add'),
            remove: jasmine.createSpy('remove'),
            has$: jasmine.createSpy('has$'),
            get$: jasmine.createSpy('get$'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheFavoritesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should trigger opening when 'openModalFavorites' is called", () => {
    component.openModalFavorites();

    component.isModalFavoriteOpened$.pipe(first()).subscribe((value) => {
      expect(value).toBe(true);
    });
  });

  it("should trigger closing when 'closeModalFavorites' is called", () => {
    component.openModalFavorites(); // Open the modal to set the value to true
    component.closeModalFavorites();

    component.isModalFavoriteOpened$.pipe(first()).subscribe((value) => {
      expect(value).toBe(false);
    });
  });

  it('should add a favorite when "addPageFavorite" is called', () => {
    const favoritesService = TestBed.inject(FavoritesService);

    component.favoriteName = 'test';

    component.addPageFavorite();

    expect(favoritesService.add).toHaveBeenCalledWith('/', 'test');
  });

  it('should close modal when "addPageFavorite" is called', () => {
    component.openModalFavorites(); // Open the modal
    component.addPageFavorite();

    component.isModalFavoriteOpened$.pipe(first()).subscribe((value) => {
      expect(value).toBe(false);
    });
  });

  it('should remove a favorite when "removePageFavorite" is called', () => {
    const favoritesService = TestBed.inject(FavoritesService);

    component.removePageFavorite();

    expect(favoritesService.remove).toHaveBeenCalled();
  });

  describe('togglePageFavorite', () => {
    it('should remove the favorite when already set', () => {
      const favoritesService = TestBed.inject(FavoritesService);
      favoritesService.has$ = jasmine
        .createSpy('has$')
        .and.returnValue(
          new Observable<boolean>((observer) => observer.next(true))
        );

      component.togglePageFavorite();

      expect(favoritesService.remove).toHaveBeenCalled();
    });
    it('should open modal if the favorite is not set', () => {
      const favoritesService = TestBed.inject(FavoritesService);
      favoritesService.has$ = jasmine
        .createSpy('has$')
        .and.returnValue(
          new Observable<boolean>((observer) => observer.next(false))
        );

      component.togglePageFavorite();

      component.isModalFavoriteOpened$.pipe(first()).subscribe((value) => {
        expect(value).toBe(true);
      });
    });
  });
});
