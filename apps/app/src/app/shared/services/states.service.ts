import { Injectable } from '@angular/core';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';

@Injectable()
export class StatesService {
  private storageKey = 'states';
  private states: { [key: string]: ClrDatagridStateInterface } = {};

  constructor() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.states = JSON.parse(data);
    }
  }

  /**
   * Save states in store
   *
   * @param filterName Filter name
   * @param state Filter state
   */
  saveState(filterName: string, state: ClrDatagridStateInterface) {
    this.states[filterName] = state;
    this.save();
  }

  /**
   * Get states from store
   *
   * @param filterName Filter name
   *
   * @returns Filter state
   */
  restoreState(filterName: string): ClrDatagridStateInterface {
    return this.states[filterName] ?? {};
  }

  /**
   * Get currant page
   *
   * @returns current page
   */
  getCurrentPage(filterName: string): number {
    return this.states[filterName]?.page?.current ?? 1;
  }

  /**
   * Get page size
   *
   * @returns page size
   */
  getPageSize(filterName: string): number {
    return this.states[filterName]?.page?.size ?? 10;
  }

  /**
   * Get filter value from the filters store
   *
   * @param key Key to find the filter value
   *
   * @returns filter value
   */
  getFilterValue(filterName: string, key: string): string {
    const state = this.states[filterName];
    const filter = state.filters?.find((f) => f.property === key);
    return filter?.value ?? '';
  }

  /**
   * Get sort order from the filters store
   *
   * @param key Key to find the sort order
   *
   * @returns sort order
   */
  getSortOrder(filterName: string, key: string): ClrDatagridSortOrder {
    const state = this.states[filterName];
    const by = state.sort?.by;
    if (by === key) {
      return state.sort?.reverse
        ? ClrDatagridSortOrder.DESC
        : ClrDatagridSortOrder.ASC;
    }
    return ClrDatagridSortOrder.UNSORTED;
  }

  /**
   * Save states in localStorage
   */
  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.serialize()));
  }

  /**
   * Serialize states removing complexe Angular objects from filters
   *
   * @returns states
   */
  private serialize(): {
    [key: string]: ClrDatagridStateInterface;
  } {
    const states = Object.assign({}, this.states);

    for (const key in states) {
      const filters = states[key]?.filters;
      if (filters) {
        // Keep only required key value pairs (remove Angular objects from custom States)
        states[key].filters = filters.map(
          (filter: { property: string; value: string }) => {
            return {
              property: filter.property,
              value: filter.value,
            };
          }
        );
      }
    }

    return states;
  }
}
