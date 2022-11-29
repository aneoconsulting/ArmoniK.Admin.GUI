import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-custom-columns-manager',
  templateUrl: './custom-columns-manager.component.html',
  styleUrls: ['./custom-columns-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomColumnsManagerComponent {
  @Input() columns$: Observable<Set<string>> = new Observable<Set<string>>();

  @Output() addColumnChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() removeColumnChange: EventEmitter<string> =
    new EventEmitter<string>();

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
    this.addColumnChange.emit(this.newColumnName);
    this.closeModalAddColumn();
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
    this.removeColumnChange.emit(column);
  }
}
