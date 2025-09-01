import { Component, Input, Output, EventEmitter, ViewContainerRef, inject, signal } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomColumn } from '@app/types/data';
import { FiltersDialogData, FiltersDialogResult } from '@app/types/dialog';
import { Filter, FiltersAnd, FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersService } from '@services/filters.service';
import { UtilsService } from '@services/utils.service';
import { FiltersDialogComponent } from './filters-dialog.component';

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

.mat-chip-clickable {
  cursor: pointer;
}

.mat-chip-clickable:hover {
  opacity: 0.8;
}
  `],
  imports: [
    MatChipsModule,
    MatDialogModule,
  ],
  providers: [
    FiltersService,
  ]
})
export class FiltersChipsComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  private readonly filtersService = inject(FiltersService);
  private readonly utilsService = inject(UtilsService<F, O>);
  private readonly dataFiltersService = inject(DataFilterService);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly filters = signal<string[]>([]);
  private _filtersAnd: FiltersAnd<F, O> = [];

  @Input({ required: true }) set filtersAnd(entry: FiltersAnd<F, O>) {
    this._filtersAnd = entry;
    this.filters.set(entry.map(filter => this.toContent(filter)));
  }

  @Input() customColumns: CustomColumn[] = [];
  @Output() filtersChange: EventEmitter<FiltersOr<F, O>> = new EventEmitter<FiltersOr<F, O>>();

  openFiltersDialog(): void {
    const dialogRef = this.dialog.open<FiltersDialogComponent<F, O>, FiltersDialogData<F, O>, FiltersDialogResult<F, O>>(FiltersDialogComponent, {
      data: {
        filtersOr: [Array.from(this._filtersAnd)],
        customColumns: this.customColumns
      },
      viewContainerRef: this.viewContainerRef,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.filtersChange.emit(result);
      }
    });
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
        const operator = this.filtersService.findOperators(type)[filter.operator];

        switch (type) {
        case 'status': {
          const statuses = this.utilsService.recoverStatuses(filter, this.dataFiltersService.filtersDefinitions);
          const status = statuses.find(status => status.key.toString() === filter.value?.toString());
          return `${label} ${operator} ${status?.value}`;
        }
        case 'date': {
          return `${label} ${operator} ${new Date(Number(filter.value) * 1000).toLocaleString()}`;
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
