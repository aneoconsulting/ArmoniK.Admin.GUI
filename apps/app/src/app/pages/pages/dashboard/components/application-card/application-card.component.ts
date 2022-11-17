import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Used to display a small card with some informations about the application
 */
@Component({
  standalone: true,
  selector: 'app-pages-dashboard-application-card',
  templateUrl: './application-card.component.html',
  styleUrls: ['./application-card.component.scss'],
  imports: [RouterModule, TranslateModule, CommonModule],
})
export class ApplicationCardComponent {
  @Input() application?: Application;
  @Output() applicationChange: EventEmitter<Application> = new EventEmitter();

  onClick() {
    this.applicationChange.emit(this.application);
  }

  trackBySession(index: number, session: { _id: string }) {
    return session._id;
  }
}
