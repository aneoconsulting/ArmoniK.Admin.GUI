import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { FiltersAnd } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersToolbarComponent } from './filters-toolbar.component';

describe('FiltersToolbarComponent', () => {
  let component: FiltersToolbarComponent<number, number>;
  let fixture: ComponentFixture<FiltersToolbarComponent<number, number>>;

  let dialogRefSubject: BehaviorSubject<number | null>;
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRefSubject;
        }
      };
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    }).compileComponents();

    TestBed.overrideComponent(FiltersToolbarComponent, {
      set: {
        providers: [
          FiltersToolbarComponent,
          IconsService,
          { provide: MatDialog, useValue: mockMatDialog },
          { provide: ViewContainerRef, useValue: {} }
        ]
      }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersToolbarComponent<number, number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('add')).toEqual('add');
  });

  it('should show the filters if they are not empty', () => {
    component.filters = [[{
      field: 1,
      for: 'options',
      operator: 1,
      value: 2
    }]];
    expect(component.showFilters()).toBeTruthy();
  });

  it('should not show the filters if there is none', () => {
    expect(component.showFilters()).toBeFalsy();
  });

  it('should open the filter dialog', () => {
    const spy = jest.spyOn(component.filtersChange, 'emit');
    dialogRefSubject = new BehaviorSubject<number | null>(1);
    component.openFiltersDialog();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should not open the filter dialog if there is no result', () => {
    const spy = jest.spyOn(component.filtersChange, 'emit');
    dialogRefSubject = new BehaviorSubject<number | null>(null);
    component.openFiltersDialog();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should track by filter', () => {
    const filterAnd: FiltersAnd<number, number> = [{
      field: 1,
      for: 'root',
      operator: 1,
      value: 'someValue'
    }];
    expect(component.trackByFilter(0, filterAnd)).toEqual('01');
  });
});