import { Component } from '@angular/core';

@Component({
  selector: 'app-table-container',
  templateUrl: 'table-container.component.html',
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