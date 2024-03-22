import { NgFor } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker-dialog.component.html',
  standalone: true,
  providers: [
    IconsService
  ],
  imports: [
    NgFor,
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
  @Input({ required: true }) selected$: Subject<string>;
  @Input({ required: true }) selectedIcon: string = '';

  icons: string[] = this.iconsService.getAllIcons();
  filteredIcons: string[] = this.icons;
  iconFormControl: FormControl<string | null> = new FormControl<string | null>(null);

  ngOnInit(): void {
    this.iconFormControl.valueChanges.subscribe(value => {
      this.filterIcons(value);
    });
  }

  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }

  selectIcon(icon: string): void {
    this.selected$.next(icon);
    this.selectedIcon = icon;
  }

  filterIcons(filter: string | null): void {
    if (filter) {
      this.filteredIcons = this.icons.filter(icon => icon.includes(filter));
    } else {
      this.filteredIcons = this.icons;
    }
  }
}