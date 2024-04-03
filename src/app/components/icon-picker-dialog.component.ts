import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit, Output, inject, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Page } from '@app/types/pages';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker-dialog.component.html',
  styles: [`
article {
  max-height: 300px;
  overflow-y: auto;
  display: grid;
}
  `],
  standalone: true,
  providers: [
    IconsService
  ],
  imports: [
    NgFor,
    NgIf,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class IconPickerDialogComponent implements OnInit {
  readonly iconsService = inject(IconsService);

  @Input({ required: true }) icon: string = '';
  @Output() iconChange = new EventEmitter<string>();

  icons: string[] = this.iconsService.getAllIcons();
  filteredIcons: string[] = this.icons;
  iconFormControl: FormControl<string | null> = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.iconFormControl.valueChanges.subscribe(value => {
      this.filterIcons(value);
    });
  }

  getIcon(icon: string): string {
    try {
      return this.iconsService.getIcon(icon);
    } catch (error) {
      return this.iconsService.getPageIcon(icon as Page);
    }
  }

  selectIcon(icon: string): void {
    this.iconChange.next(icon);
  }

  filterIcons(filter: string | null): void {
    if (filter) {
      this.filteredIcons = this.icons.filter(icon => icon.includes(filter));
    } else {
      this.filteredIcons = this.icons;
    }
  }
}
