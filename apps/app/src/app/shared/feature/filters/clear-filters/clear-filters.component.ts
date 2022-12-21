import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-clear-filters',
  templateUrl: './clear-filters.component.html',
  styleUrls: ['./clear-filters.component.scss'],
  imports: [TranslateModule],
})
export class ClearFiltersComponent {
  @Input() clearFiltersSubject: Subject<void>;

  public clearFilters(): void {
    this.clearFiltersSubject.next();
  }
}
