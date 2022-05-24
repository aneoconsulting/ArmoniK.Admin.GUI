import { Component, Input } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

/**
 * Used to display small card with application informations
 */
@Component({
  selector: 'app-pages-dashboard-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent {
  @Input() application: Application | undefined;
}
