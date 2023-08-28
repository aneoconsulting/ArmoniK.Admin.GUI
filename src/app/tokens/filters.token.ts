import { InjectionToken } from '@angular/core';
import { FiltersService } from '@app/sessions/services/sessions-filters.service';

export const DATA_FILTERS_SERVICE = new InjectionToken<FiltersService>('DATA_FILTERS_SERVICE');
