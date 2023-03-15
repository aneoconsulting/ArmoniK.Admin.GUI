import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-dashboard-group-actions-button',
  templateUrl: './group-actions-button.component.html',
  styleUrls: ['./group-actions-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupActionsButtonComponent {
  @Input() public classNames: string | null;
}
