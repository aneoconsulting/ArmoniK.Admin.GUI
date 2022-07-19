import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';

describe('CustomRouteReuseStrategy', () => {
  it('should create an instance', () => {
    expect(new CustomRouteReuseStrategy()).toBeTruthy();
  });

  it('should never reuse route', () => {
    const strategy = new CustomRouteReuseStrategy();
    expect(strategy.shouldReuseRoute()).toBe(false);
  });

  it('should always detach route', () => {
    const strategy = new CustomRouteReuseStrategy();
    expect(strategy.shouldDetach()).toBe(true);
  });

  it('should verify if a route should be attached', () => {
    const strategy = new CustomRouteReuseStrategy();

    const route = {
      component: 'test',
      data: {
        key: 'test',
      },
    } as unknown as ActivatedRouteSnapshot;

    strategy.store(route, {} as DetachedRouteHandle);

    expect(strategy.shouldAttach(route)).toBe(true);
  });

  it('should should not attached without component', () => {
    const strategy = new CustomRouteReuseStrategy();

    const route = {
      component: null,
      data: {
        key: 'test',
      },
    } as unknown as ActivatedRouteSnapshot;

    strategy.store(route, {} as DetachedRouteHandle);

    expect(strategy.shouldAttach(route)).toBe(false);
  });

  it('should not retrieve without component', () => {
    const strategy = new CustomRouteReuseStrategy();

    const route = {
      component: null,
      data: {
        key: 'test',
      },
    } as unknown as ActivatedRouteSnapshot;

    strategy.store(route, {} as DetachedRouteHandle);

    expect(strategy.retrieve(route)).toBe(null);
  });

  it('should retrieve a stored route', () => {
    const strategy = new CustomRouteReuseStrategy();
    const route = {
      component: {},
      data: {},
      params: { id: '1' },
    } as unknown as ActivatedRouteSnapshot;
    const handle = { test: 'test' } as unknown as DetachedRouteHandle;

    strategy.store(route, handle);

    expect(strategy.retrieve(route)).toEqual(handle);
  });

  it('should not retrieve a non-store route', () => {
    const strategy = new CustomRouteReuseStrategy();
    const route = {
      component: {},
      data: {},
      params: { id: '1' },
    } as unknown as ActivatedRouteSnapshot;
    const handle = { test: 'test' } as unknown as DetachedRouteHandle;

    // Store a first route to initialize the store
    strategy.store(route, handle);

    const route2 = {
      component: {},
      data: {},
      params: { id: '2' },
    } as unknown as ActivatedRouteSnapshot;

    expect(strategy.retrieve(route2)).toBe(null);
  });
});
