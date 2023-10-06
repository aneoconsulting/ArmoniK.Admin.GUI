import { InjectionToken } from '@angular/core';
import { FiltersServiceDefinition } from '@app/types/filter-definition';

export const DATA_FILTERS_SERVICE = new InjectionToken<FiltersServiceDefinition>('DATA_FILTERS_SERVICE');
