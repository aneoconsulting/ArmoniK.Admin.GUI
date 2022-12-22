import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'armonik.admin.gui-action-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
