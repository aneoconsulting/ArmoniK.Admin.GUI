import { InjectionToken } from '@angular/core';
import { BasicFilterService } from '@app/types/filter-definition';

export const DATA_FILTERS_SERVICE = new InjectionToken<BasicFilterService>('DATA_FILTERS_SERVICE');
