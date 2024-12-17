import { Component, Input, inject, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Filter, FiltersAnd, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';
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
export class FiltersChipsComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  private readonly filtersService = inject(FiltersService);
  private readonly utilsService = inject(UtilsService<F, O>);
  private readonly dataFiltersService = inject(DataFilterService);

  readonly filters = signal<string[]>([]);

  @Input({ required: true }) set filtersAnd(entry: FiltersAnd<F, O>) {
    this.filters.set(entry.map(filter => this.toContent(filter)));
  }

  private toContent(filter: Filter<F, O>): string {
    if (filter.field !== null && filter.field !== undefined) {
      const label = filter.for !== 'custom' ? this.dataFiltersService.retrieveLabel(filter.for as 'root' | 'options', Number(filter.field)) : (filter.field as string);

      if (filter.value === null) {
        return label + ' ' + $localize`has no value`;
      } else if (filter.operator === null) {
        return $localize`No operator`;
      }

      try {
        const type = this.utilsService.recoverType(filter, this.dataFiltersService.filtersDefinitions);
        const operator = this.filtersService.findOperators(type)[filter.operator as number];

        switch (type) {
        case 'status': {
          const statuses = this.utilsService.recoverStatuses(filter, this.dataFiltersService.filtersDefinitions);
          const status = statuses.find(status => status.key.toString() === filter.value?.toString());
          return `${label} ${operator} ${status?.value}`;
        }
        case 'date': {
          return `${label} ${operator} ${new Date(Number(filter.value) * 1000).toUTCString()}`;
        }
        case 'duration': {
          return `${label} ${operator} ${this.durationToString(Number(filter.value))}`;
        }
        default: {
          return `${label} ${operator} ${filter.value}`;
        }
        }
      } catch {
        return $localize`Invalid Filter Field`;
      }
    }
    return $localize`No field`;
  }

  private durationToString(value: number): string {
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
