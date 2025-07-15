import { Component } from '@angular/core';

@Component({
  selector: 'app-page-section',
  template: `
<section>
  <ng-content></ng-content>
</section>
  `,
  styles: [`
  `],
  providers: [],
  imports: []
})
export class PageSectionComponent {}
