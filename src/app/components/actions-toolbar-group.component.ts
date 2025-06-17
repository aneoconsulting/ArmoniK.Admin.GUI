import { Component } from '@angular/core';

@Component({
  selector: 'app-actions-toolbar-group',
  template: `
<div class="group">
  <ng-content></ng-content>
</div>
  `,
  styles: [`
.group {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.group > ::ng-deep * + * {
  margin-left: 1rem;
}
  `],
  providers: [],
  imports: []
})
export class ActionsToolbarGroupComponent {}
