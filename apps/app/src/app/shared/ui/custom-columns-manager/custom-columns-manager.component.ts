import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrInputModule, ClrModalModule } from '@clr/angular';

import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-custom-columns-manager',
  templateUrl: './custom-columns-manager.component.html',
  styleUrls: ['./custom-columns-manager.component.scss'],
  imports: [
    FormsModule,
    ClrInputModule,
    ClrModalModule,

    NgIf,
    NgFor,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomColumnsManagerComponent {
  @Input() defaultColumns: Set<string> = new Set<string>();

  @Output() columnsChange = new EventEmitter<Set<string>>();

  private _columns = new BehaviorSubject(this.defaultColumns);
  public columns$ = this._columns.asObservable();

  private get columns(): Set<string> {
    return this._columns.getValue();
  }

  /** Manage columns */
  public modalAddColumnOpened = false;

  /** Add a column */
  public newColumnName = '';
  public modalManageColumnsOpened = false;

  /**
   * Open modal add a column
   */
  public openModalAddColumn(): void {
    this.modalAddColumnOpened = true;
  }

  /**
   * Close modal to add a column
   */
  public closeModalAddColumn(): void {
    this.newColumnName = '';
    this.modalAddColumnOpened = false;
  }

  /**
   * Used to emit the column to add
   */
  public addColumn(): void {
    const columns = this.columns;
    columns.add(this.newColumnName);

    this._columns.next(columns);
    this.columnsChange.emit(columns);
  }

  /**
   * Open modal used to manage columns
   */
  public openModalManageColumns(): void {
    this.modalManageColumnsOpened = true;
  }

  /**
   * Close modal used to manage columns
   */
  public closeModalManageColumns(): void {
    this.newColumnName = '';
    this.modalManageColumnsOpened = false;
  }

  /**
   * Used emit the column to remove
   *
   * @param column
   */
  public removeColumn(column: string): void {
    const columns = this.columns;
    columns.delete(column);

    this._columns.next(columns);
    this.columnsChange.emit(columns);
  }
}
