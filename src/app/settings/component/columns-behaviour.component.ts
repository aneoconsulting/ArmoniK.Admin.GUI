import { Component, inject } from '@angular/core';
import { ColumnsBehaviourValues, SpecialColumn } from '@app/types/column.type';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'app-columns-behaviour',
  templateUrl: 'columns-behaviour.component.html',
  styleUrl: 'columns-behaviour.component.scss',
  imports: [
    AutoCompleteComponent,
    PageSectionHeaderComponent
  ]
})
export class ColumnsBehaviourComponent {
  private readonly storageService = inject(StorageService);

  readonly behaviours = [
    $localize`Unset`,
    $localize`Stick on the left`,
    $localize`Stick on the right`,
  ];

  readonly columns: Map<
    SpecialColumn,
    { label: string, value: string }
  > = new Map([
      ['select', { label: $localize`Select`, value: '' }],
      ['actions', { label: $localize`Actions`, value: '' }]
    ]);

  constructor(defaultConfigService: DefaultConfigService) {
    const values = this.storageService.getItem('table-columns-behaviour', true) as Record<string, ColumnsBehaviourValues> ?? defaultConfigService.defaultTableColumnsBehaviour;
    for (const column of this.columns.keys()) {
      const content = this.columns.get(column);
      if (content) {
        content.value = this.getBehaviourText(values[column] ?? ColumnsBehaviourValues.UNSET);
      }
    }
  }

  private getBehaviourText(behaviour: ColumnsBehaviourValues) {
    return this.behaviours[behaviour];
  }

  private getBehaviourFromText(text: string) {
    if (text === this.behaviours[0]) {
      return ColumnsBehaviourValues.UNSET;
    } else if (text === this.behaviours[1]) {
      return ColumnsBehaviourValues.LEFT;
    } else {
      return ColumnsBehaviourValues.RIGHT;
    }
  }

  updateBehaviour(column: SpecialColumn, value: string) {
    if (this.behaviours.includes(value)) {
      const content = this.columns.get(column);
      if (content) {
        content.value = value;
        this.storageService.setItem(
          'table-columns-behaviour',
          [...this.columns.entries()].reduce((acc, column) => {
            acc[column[0]] = this.getBehaviourFromText(column[1].value);
            return acc;
          }, {} as Record<string, ColumnsBehaviourValues>)
        );
      }
    }
  }
}