import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShowActionButton } from '@app/types/components/show';

@Component({
  selector: 'app-show-action-area',
  templateUrl: './show-action-area.component.html',
  styles: [`
  button {
    margin-right: 3px;
  }
  `],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ShowActionAreaComponent {
  
  private _actions: ShowActionButton[] = [];
  private _isDisabled: { [x: string]: boolean } = {};

  get actions() {
    return this._actions;
  }

  get isDisabled() {
    return this._isDisabled;
  }
  
  @Input({required: true}) set actions(entries : ShowActionButton[]) {
    entries.filter(entry => entry.disabled !== undefined).forEach(entry => {
      if (entry.disabled) {
        entry.disabled.subscribe(value => this._isDisabled[entry.id] = value);
      }
    });
    this._actions = entries;
  }
}