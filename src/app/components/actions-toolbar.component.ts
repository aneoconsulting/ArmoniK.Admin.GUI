import { Component } from '@angular/core';

@Component({
  selector: 'app-actions-toolbar',
  template: `
<div class="actions-toolbar">
  <ng-content></ng-content>
</div>
  `,
  styles: [`
.actions-toolbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
  `],
  providers: [],
  imports: []
})
export class ActionsToolbarComponent {}
