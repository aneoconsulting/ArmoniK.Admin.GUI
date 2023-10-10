import { InjectionToken } from '@angular/core';
import { DataFilterService } from '@app/types/filter-definition';

export const DATA_FILTERS_SERVICE = new InjectionToken<DataFilterService>('DATA_FILTERS_SERVICE');
