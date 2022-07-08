import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

/**
 * Used to display a small card with some informations about the application
 */
@Component({
  selector: 'app-pages-dashboard-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
})
export class ApplicationCardComponent {
  @Input() application?: Application;
  @Output() applicationChange: EventEmitter<Application> = new EventEmitter();

  onClick() {
    this.applicationChange.emit(this.application);
  }
}
