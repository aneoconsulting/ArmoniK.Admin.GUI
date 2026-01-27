import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NavigationExtras, Params, Router, RouterModule } from '@angular/router';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, SessionData } from '@app/types/data';
import { Status, StatusLabelColor, StatusService } from '@app/types/status';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { StatusChipComponent } from '@components/status-chip.component';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { Subject } from 'rxjs';
import { ByteArrayComponent } from './cells/byte-array-cell.component';
import { TableInspectMessageComponent } from './table-inspect-message.component';
import { TableInspectObjectComponent } from './table-inspect-object.component';

/**
 * Display a cell in the table component.
 */
@Component({
  selector: 'app-table-cell',
  templateUrl: 'table-cell.component.html',
  styleUrl: 'table-cell.component.scss',
  imports: [
    EmptyCellPipe,
    RouterModule,
    TableInspectObjectComponent,
    DurationPipe,
    DatePipe,
    MatButtonModule,
    CountTasksByStatusComponent,
    MatCheckboxModule,
    TableInspectMessageComponent,
    StatusChipComponent,
    ByteArrayComponent,
  ]
})
export class TableCellComponent<T extends DataRaw, S extends Status, O extends TaskOptions | null = null>{
  /**
   * Required input.
   * Allow the component to load the correct data and display it depending on its type.
   * Must be the first input.
   */
  @Input({ required: true }) set column(entry: TableColumn<T, O>) {
    this._column = entry;
    if (entry.key === 'count') {
      this.refreshStatuses = new Subject<void>();
    }
  }

  /**
   * Required input.
   * ArmonikData. The component will look for the value to display with the column information and then store it in the value variable.
   */
  @Input({ required: true }) set element(entry: ArmonikData<T, O>) {
    this._element = entry;
    this._value = this.handleNestedKeys(entry);
    if (entry) {
      this.queryParams = this._element.queryParams?.get(this.column.key);
      this.createLink();
      if (this.column.key === 'count') {
        this.refreshStatuses.next();
      }
    }
  }

  /**
   * Optional input. Allows the component to display the correct status and not just its enumeration.
   */
  @Input({ required: false }) statusesService: StatusService<S>;

  /**
   * Optional input. Used for the "select" column. value set to true will "check" the checkbox.
   * @default false
   */
  @Input({ required: false }) isSelected: boolean = false;

  /**
   * Optional input. This input is then forwarded to the [CountTasksByStatusComponent](src/app/components/count-tasks-by-status.component.ts) component.
   * @default []
   */
  @Input({ required: false }) statusesGroups: TasksStatusesGroup[] = [];

  /**
   * Event emitted when checkbox ("select" column) is clicked.
   */
  @Output() changeSelection = new EventEmitter<void>();

  private readonly router = inject(Router);

  /**
   * Stores the value to display. Its type will be adapted to prevent typescript errors.
   */
  private _value: unknown;

  /**
   * Reference of the complete ArmonikData element.
   */
  private _element: ArmonikData<T, O>;

  /**
   * Column (key) of this cell.
   */
  private _column: TableColumn<T, O>;

  /**
   * Used in the navigate method.
   */
  private link: string;

  /**
   * queryParams stored in the provided element.
   */
  private queryParams: Params | undefined;

  /**
   * Refresh subject created if the cell is a "count" cell.
   * Will emit only when the cell content is updated.
   */
  refreshStatuses: Subject<void>;

  get column() {
    return this._column;
  }

  get value() {
    return this._value;
  }

  get string() {
    return this._value as string;
  }

  get durationValue() {
    return this._value as Duration;
  }

  get dateValue(): Date | null {
    return (this.value as Timestamp)?.toDate() ?? null;
  }

  get queryTasksParams() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).queryTasksParams;
  }

  get countFilters() {
    return (this._element as unknown as SessionData | ApplicationData | PartitionData).filters;
  }

  get byteArray() {
    return this._value as Uint8Array;
  }

  /**
   * Instanciate the "link" variable.
   * Will set the link to an empty string if no link is provided in the column definition.
   * If query params are provided, the link will simply be the link provided in the column definition (used to filter other tables).
   * If not, it will add the displayed value to it (used to go to an inspection page, where query params are useless).
   */
  createLink() {
    if (this.column.link) {
      if (this.queryParams) {
        this.link = this.column.link;
      } else {
        this.link = `${this.column.link}/${this._element.raw[this.column.key as keyof DataRaw]}`;
      }
    } else {
      this.link = '';
    }
  }

  /**
   * Navigates to the route provided in the "link" variable.
   * If queryParams are provided, will use them.
   */
  navigate() {
    if (this.link) {
      const extras: NavigationExtras = {
        queryParams: this.queryParams,
      };
      this.router.navigate([this.link], extras);
    }
  }

  /**
   * Uses the provided column key to get the value to display. Also work on nested objects.
   * @param element ArmoniKData - contains information about all columns
   * @returns the value to display, as unknown
   */
  handleNestedKeys(element: ArmonikData<T, O>) {
    if (element?.raw === undefined) {
      return undefined;
    }
    const keys = this.column.key.toString().split('.');
    let resultObject: {[key: string]: object} = element.raw as unknown as {[key: string]: object};
    for (const key of keys) {
      resultObject = resultObject[key] as {[key: string]: object};
    }
    return resultObject;
  }

  /**
   * Emits the changeSelection event.
   */
  onSelectionChange() {
    this.changeSelection.emit();
  }

  /**
   * Returns the label associated to the selected status.
   * @returns string
   */
  checkboxLabel(): string {
    if (this.isSelected) {
      return $localize`Deselect ${this._element.raw[this.column.key as keyof DataRaw]}`;
    }
    else {
      return $localize`Select ${this._element.raw[this.column.key as keyof DataRaw]}`;
    }
  }

  /**
   * Returns the label associated to a status.
   * @returns StatusLabelColor
   */
  statusLabel(): StatusLabelColor {
    return this.statusesService.statusToLabel(this._value as S);
  }
}