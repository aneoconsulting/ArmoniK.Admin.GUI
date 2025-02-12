import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomColumn } from '@app/types/data';
import { FiltersDialogData } from '@app/types/dialog';
import { Filter, FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { FiltersDialogOrComponent } from './filters-dialog-or.component';

@Component({
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styles: [`
.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
  `],
  standalone: true,
  imports: [
    FiltersDialogOrComponent,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  providers: [
    FiltersService,
  ],
})
export class FiltersDialogComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> implements OnInit {
  private readonly iconsService = inject(IconsService);
  private readonly dialogRef = inject(MatDialogRef<FiltersDialogComponent<F, O>>);

  filtersOr: FiltersOr<F, O> = [];
  customColumns: CustomColumn[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: FiltersDialogData<F, O>){}

  ngOnInit(): void {
    if (!this.data.filtersOr.length) {
      this.onAdd();
    } else {
      this.filtersOr = structuredClone(this.data.filtersOr);
    }
    this.customColumns = this.data.customColumns ?? [];
  }

  onAdd() {
    this.filtersOr.push([
      {
        for: null,
        field: null,
        operator: null,
        value: null,
      }
    ]);
  }

  onRemoveOr(filters: Filter<F, O>[]) {
    const index = this.filtersOr.indexOf(filters);
    if (index > -1) {
      this.filtersOr.splice(index, 1);
    }
    if (this.filtersOr.length === 0) {
      this.onAdd();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }
}
