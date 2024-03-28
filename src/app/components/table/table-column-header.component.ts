import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ColumnType, TableColumn } from '@app/types/column.type';
import { RawColumnKey } from '@app/types/data';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-table-column-header',
  templateUrl: './table-column-header.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class TableColumnHeaderComponent<K extends RawColumnKey> {

  readonly iconService = inject(IconsService);

  private _icon: string;
  private _type: ColumnType;
  private _name: string;

  @Input({ required: true }) set column(entry: TableColumn<K>) {
    this._type = entry.type ?? 'raw';
    this._name = entry.name;
    if (entry.type === 'count') {
      this._icon = this.iconService.getIcon('tune');
    }
  }
  @Input({ required: false }) checkBoxLabel: string;
  @Input({ required: false }) checked: boolean;
  @Input({ required: false }) isSelectionIndeterminate: boolean;

  @Output() toggleRowsSelection = new EventEmitter<void>();
  @Output() personnaliseTasksByStatus = new EventEmitter<void>();

  get name() {
    return this._name;
  }

  get icon() {
    return this._icon;
  }

  get type() {
    return this._type;
  }

  onToggleAllRows() {
    this.toggleRowsSelection.emit();
  }

  onPersonnalizeTasksByStatus() {
    this.personnaliseTasksByStatus.emit();
  }
}