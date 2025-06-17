import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  providers: [
    IconsService
  ],
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class IconPickerDialogComponent {
  readonly iconsService = inject(IconsService);

  @Input({ required: true }) icon: string | null | undefined = '';
  @Output() iconChange = new EventEmitter<string>();

  icons: string[] = this.iconsService.getAllIcons();
  filteredIcons = signal(this.icons);
  iconFormControl: FormControl<string> = new FormControl<string>('', { nonNullable: true });

  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }

  selectIcon(icon: string): void {
    this.iconChange.next(icon);
  }

  selectFirst(): void {
    const selectedIcon = this.filteredIcons()[0];
    if (selectedIcon) {
      this.selectIcon(selectedIcon);
    }
  }

  filterIcons(): void {
    this.filteredIcons.update(() => this.icons.filter(icon => icon.includes(this.iconFormControl.value)));
  }
}
