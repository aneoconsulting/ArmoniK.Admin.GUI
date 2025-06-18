import { makeEnvironmentProviders } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

/**
 * All formats used by the MomentDateAdapter
 */
const ARMONIK_DATE_FORMAT: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY HH:mm:ss', 
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm:ss',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

/**
 * Provides services and date format to display to the DateTime picker component.
 */
export function provideArmonikDateAdapter() {
  return makeEnvironmentProviders([
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: ARMONIK_DATE_FORMAT }
  ]);
}