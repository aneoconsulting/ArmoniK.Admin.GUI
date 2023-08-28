import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  template: `
<mat-spinner diameter="30" strokeWidth="4"></mat-spinner>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    MatProgressSpinnerModule
  ]
})
export class SpinnerComponent {}
