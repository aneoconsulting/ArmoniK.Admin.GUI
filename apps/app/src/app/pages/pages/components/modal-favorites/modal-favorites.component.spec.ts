import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FavoritesService } from '../../../../core';
import { first, Observable } from 'rxjs';
import { ModalFavoritesComponent } from './modal-favorites.component';
import { TranslateModule } from '@ngx-translate/core';

describe('ModalFavoritesComponent', () => {
  let component: ModalFavoritesComponent;
  let fixture: ComponentFixture<ModalFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFavoritesComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule],
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
    fixture = TestBed.createComponent(ModalFavoritesComponent);
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

  it('should remove page from favorites when toggle button', () => {
    const favoritesService = TestBed.inject(FavoritesService);
    favoritesService.has$ = jasmine
      .createSpy('has$')
      .and.returnValue(
        new Observable<boolean>((observer) => observer.next(true))
      );

    component.togglePageFavorite();

    expect(favoritesService.remove).toHaveBeenCalled();
  });

  it('should open modal when toggle button', () => {
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
