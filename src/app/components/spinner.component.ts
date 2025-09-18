import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  templateUrl: 'spinner.component.html',
  styles: [`
  `],
  providers: [],
  imports: [
    MatProgressSpinnerModule
  ]
})
export class SpinnerComponent {}
