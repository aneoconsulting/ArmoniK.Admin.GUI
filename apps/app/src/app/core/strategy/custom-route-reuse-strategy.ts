import {
  RouteReuseStrategy,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(): boolean {
    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.storedRoutes.set(this.getRouteKey(route), handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return (
      !!this.storedRoutes.get(this.getRouteKey(route)) && !!route.component
    );
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.component) return null;
    return this.storedRoutes.get(this.getRouteKey(route)) ?? null;
  }

  shouldReuseRoute(): boolean {
    return false;
  }

  /**
   * Get the route key for the route
   *
   * @param route The route to get the key for
   *
   * @returns The route key
   */
  private getRouteKey(route: ActivatedRouteSnapshot): string {
    const params = route.data['key'] ?? Object.values(route.params).toString();
    return params;
  }
}
