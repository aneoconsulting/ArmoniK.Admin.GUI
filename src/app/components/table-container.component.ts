import { Component } from '@angular/core';

@Component({
  selector: 'app-table-container',
  template: `
<div class="container">
  <ng-content select="app-table-loading"></ng-content>
  <div class="table-container">
    <ng-content select="table"></ng-content>
  </div>
  <ng-content select="mat-paginator"></ng-content>
</div>
  `,
  styles: [`
.container {
  position: relative;
}
.table-container {
  position: relative;
  overflow: auto;
}
  `],
  providers: [],
  imports: []
})
export class TableContainerComponent {}