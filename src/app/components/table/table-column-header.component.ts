import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { TaskOptions } from '@app/tasks/types';
import { ColumnType, TableColumn } from '@app/types/column.type';
import { DataRaw } from '@app/types/data';
import { IconsService } from '@services/icons.service';
import { StatusColorPickerComponent } from '../status-color-picker.component';

/**
 * Represent the header of a column of the table.
 * Generally only displays the name of the column (which is associated to a field of an ArmonikData). Some columns have a unique display:
 * - "select" column : displays a checkbox which allow the user to select/unselect every displayed line on click.
 * - "status" column : displays the name of the column and the StatusColorPicker component, which allows to update the color of displayed statuses in the table.
 * - "count" column : displays the name of the column and a button allowing the user to changes groups of tasks statuses. 
 */
@Component({
  selector: 'app-table-column-header',
  templateUrl: './table-column-header.component.html',
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    StatusColorPickerComponent
  ]
})
export class TableColumnHeaderComponent<T extends DataRaw, O extends TaskOptions | null = null> {

  private readonly iconService = inject(IconsService);

  /**
   * Icon to display for the "count" section (CountTasksByStatusComponent) of the html template.
   */
  icon: string;

  /**
   * Specified how to display the column.
   * @default "raw"
   */
  type: ColumnType;

  /**
   * Displayed name.
   */
  name: string;

  /**
   * Required input. Will set the type, name and icon values of the component.
   */
  @Input({ required: true }) set column(entry: TableColumn<T, O>) {
    this.type = entry.type ?? 'raw';
    this.name = entry.name;
    if (entry.type === 'count') {
      this.icon = this.iconService.getIcon('tune');
    }
  }

  /**
   * Optional input. Label of the checkox displayed for the "select" column.
   */
  @Input({ required: false }) checkBoxLabel: string;

  /**
   * Optional input. Wherever the "select" column is checked.
   */
  @Input({ required: false }) checked: boolean;

  /**
   * Optional input. Should be true when some rows are selected.
   */
  @Input({ required: false }) isSelectionIndeterminate: boolean;

  /**
   * Emits when the selection change.
   */
  @Output() rowsSelectionChange = new EventEmitter<void>();
  
  /**
   * Emits when the statuses are changed.
   */
  @Output() statusesChange = new EventEmitter<void>();

  /**
   * Emits the selection change event when the "select" checkbox is clicked.
   */
  onToggleAllRows() {
    this.rowsSelectionChange.emit();
  }

  /**
   * Emits the status update event when the child component (StatusColorPickerComponent) returns an event.
   */
  onPersonalizeStatuses() {
    this.statusesChange.emit();
  }
}