import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShowActionButton } from '@app/types/components/show';

@Component({
  selector: 'app-show-action-area',
  templateUrl: './show-action-area.component.html',
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
  @Input({required: true}) actions: ShowActionButton[];
}