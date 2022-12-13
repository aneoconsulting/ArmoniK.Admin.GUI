import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs';
import { FavoritesService } from './favorites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoritesService,
        {
          provide: Storage,
          useValue: {
            setItem: jasmine.createSpy('setItem'),
            getItem: jasmine.createSpy('getItem'),
          },
        },
      ],
    });
    service = TestBed.inject(FavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a favorite', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';
    service.add(url, favoriteName);

    service
      .has$(url)
      .pipe(first())
      .subscribe((has) => expect(has).toBeTruthy());
  });

  it('should store favorites in local storage', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';

    const storage = TestBed.inject(Storage);
    service.add(url, favoriteName);

    expect(storage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify([[url, favoriteName]])
    );
  });

  it('should remove a favorite', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';
    service.add(url, favoriteName);
    service.remove(url);

    service
      .has$(url)
      .pipe(first())
      .subscribe((has) => expect(has).toBeFalsy());
  });

  it('should remove a favorite from local storage', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';
    service.add(url, favoriteName);

    const storage = TestBed.inject(Storage);
    service.remove(url);

    expect(storage.setItem).toHaveBeenCalledWith(
      'favorites',
      JSON.stringify([])
    );
  });

  it('should get all favorites', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';
    service.add(url, favoriteName);

    service.favorites$.pipe(first()).subscribe((favorites) => {
      expect(favorites.length).toEqual(1);
      expect(favorites[0].label).toEqual(favoriteName);
      expect(favorites[0].path).toEqual(url);
    });
  });

  it('should get one favorite', () => {
    const url = 'https://www.angular.io';
    const favoriteName = 'Angular';
    service.add(url, favoriteName);

    service
      .get$(url)
      .pipe(first())
      .subscribe((favorite) => {
        expect(favorite).toEqual(favoriteName);
      });
  });
});
