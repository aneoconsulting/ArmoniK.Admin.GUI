import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClrLayoutModule } from '@clr/angular';

@Component({
  standalone: true,
  selector: 'app-layouts-the-header',
  templateUrl: './the-header.component.html',
  styleUrls: ['./the-header.component.scss'],
  imports: [ClrLayoutModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheHeaderComponent {}
