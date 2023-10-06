import { InjectionToken } from '@angular/core';
import { BasicFiltersService } from '@app/types/filter-definition';

export const DATA_FILTERS_SERVICE = new InjectionToken<BasicFiltersService>('DATA_FILTERS_SERVICE');
