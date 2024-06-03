import { Component, Input, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Filter, FiltersAnd } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { UtilsService } from '@services/utils.service';

@Component({
  selector: 'app-filters-chips',
  templateUrl: './filters-chips.component.html',
  styles: [`
.text {
  font-size: 1rem;
  font-weight: 400;

  margin-top: auto;
  margin-bottom: auto;

  margin-left: 8px;
}
  `],
  standalone: true,
  imports: [
    MatChipsModule,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersChipsComponent<T extends number, U extends number | null = null> {
  #filtersService = inject(FiltersService);
  #utilsService = inject(UtilsService<T, U>);
  #dataFiltersService = inject(DATA_FILTERS_SERVICE);

  @Input({ required: true }) filtersAnd: FiltersAnd<T, U> = [];

  content(filter: Filter<T, U>): string {

    if(!filter.for) {
      filter.for = 'root';
    }
    
    let label: string;
    if (filter.for !== 'custom') {
      label = this.#dataFiltersService.retrieveLabel(filter.for, Number(filter.field));
    } else {
      label = (filter.field as string);
    }

    if (filter.value === null)
      return label + ' ' + $localize`has no value`;

    const filtersDefinitions = this.#dataFiltersService.retrieveFiltersDefinitions();
    const type = this.#utilsService.recoverType(filter, filtersDefinitions);
    const operator = this.#filtersService.findOperators(type)[filter.operator as number];

    if (type === 'status') {
      const statuses = this.#utilsService.recoverStatuses(filter, filtersDefinitions);
      const status = statuses.find(status => status.key.toString() === filter.value?.toString());
      return `${label} ${operator} ${status?.value}`;
    }
    else if (type === 'date') {
      return `${label} ${operator} ${new Date(Number(filter.value) * 1000).toUTCString()}`;
    }
    else if (type === 'duration') {
      return `${label} ${operator} ${this.durationToString(Number(filter.value))}`;
    }

    return `${label} ${operator} ${filter.value}`;
  }

  durationToString(value: number): string {
    let resultString = '';
    const hours = Math.floor(Number(value)/3600);
    const minutes = Math.floor((Number(value)%3600)/60);
    const seconds = Math.floor(((Number(value))%3600)%60);
    if (hours > 0) {
      resultString += `${hours}h `;
    }
    if (minutes > 0) {
      resultString += `${minutes}m `;
    }
    if (seconds > 0) {
      resultString += `${seconds}s`;
    }
    return resultString;
  }
}
