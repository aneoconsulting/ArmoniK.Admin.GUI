import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExternalService } from '@app/types/external-service';
import { IconPickerDialogComponent } from '@components/icon-picker-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-form-external-service',
  templateUrl: './form-external-service.component.html',
  styleUrl: 'external-services.css',
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    IconPickerDialogComponent,
    MatTooltipModule,
  ]
})
export class FormExternalServiceComponent implements OnInit {
  private readonly iconsService = inject(IconsService);

  @Input({ required: false }) externalService: ExternalService;

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<ExternalService>();

  externalServiceForm = new FormGroup({
    icon: new FormControl(''),
    name: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    if(this.externalService) {
      this.externalServiceForm.patchValue(this.externalService);
    }
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onSubmit() {
    if(this.externalServiceForm.valid) {
      this.submitChange.emit({
        ...this.externalServiceForm.value as ExternalService,
      });
      this.externalServiceForm.reset();
    }
  }

  onIconChange(icon: string) {
    this.externalServiceForm.controls.icon.setValue(icon);
  }
}
