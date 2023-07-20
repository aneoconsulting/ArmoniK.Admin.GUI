import { Component } from '@angular/core';

@Component({
  selector: 'app-table-empty-data',
  template: `
<em i18n>No data founded.</em>
  `,
  styles: [`
:host {
  display: block;
  width: 100%;
}

em {
  display: block;
  margin: 1rem 0;
  text-align: center;
}
  `],
  standalone: true,
  imports: [],
  providers: [],
})
export class TableEmptyDataComponent {}
