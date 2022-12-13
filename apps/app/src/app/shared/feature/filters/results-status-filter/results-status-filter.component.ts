import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ResultStatus } from '@armonik.admin.gui/shared/data-access';

@Component({
  standalone: true,
  selector: 'app-results-status-filter',
  templateUrl: './results-status-filter.component.html',
  styleUrls: ['./results-status-filter.component.scss'],
  imports: [ClarityModule, TranslateModule, FormsModule],
})
export class ResultsStatusFilterComponent
  implements ClrDatagridFilterInterface<number>, OnInit
{
  changes = new EventEmitter<never>();

  @Input() name = '';
  @Input() selectedValue = 0;

  ResultStatus = ResultStatus;

  status: { value: ResultStatus; label: string }[];

  get property(): string {
    return this.name;
  }

  get value(): number {
    return this.selectedValue;
  }

  ngOnInit(): void {
    this.status = [
      ...Object.keys(ResultStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: ResultStatus[key as keyof typeof ResultStatus],
          label: key,
        })),
    ];
  }

  onSelectionChange(): void {
    this.changes.emit();
  }

  clear(): void {
    this.selectedValue = 0;
    this.changes.emit();
  }

  trackByStatus(
    _: number,
    item: { value: ResultStatus; label: string }
  ): string {
    return item.label;
  }

  /**
   * Check if the filter is active
   *
   * @returns true if yes, false if no
   */
  isActive(): boolean {
    return this.selectedValue !== 0;
  }

  /**
   * Not used but the interface needs it.
   *
   * @returns true
   */
  accepts(): boolean {
    return true;
  }
}
