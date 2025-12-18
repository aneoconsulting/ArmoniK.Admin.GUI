import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GrpcHostInterceptor } from '@app/interceptors/grpc.interceptor';
import { SpinnerComponent } from '@components/spinner.component';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { Environment, Host } from '@services/environment.service';
import { catchError, of, Subscription, switchMap } from 'rxjs';


@Component({
  selector: 'app-add-environment-dialog',
  templateUrl: 'add-environment.dialog.html',
  styleUrl: 'add-environment.dialog.scss',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SpinnerComponent,
    MatTooltipModule,
    MatRadioModule,
  ],
  providers: [],
})
export class AddEnvironmentDialogComponent implements OnDestroy {
  private readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;
  private readonly httpClient = inject(HttpClient);

  readonly choiceForm = new FormControl<boolean>(true);
  readonly hostForm: FormControl<string | null>;
  readonly customEnvironmentForm = new FormGroup<{
    name: FormControl<string | null>,
    version: FormControl<string | null>,
    description: FormControl<string | null>,
    color: FormControl<string>
  }>({
    name: new FormControl<string | null>(null, Validators.required),
    version:  new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    color: new FormControl<string>('#0000FF', { nonNullable: true }),
  });

  readonly loading = signal(false);
  testedEnvironment: Environment | undefined;

  private readonly subscription = new Subscription();

  constructor(
    private readonly dialogRef: MatDialogRef<AddEnvironmentDialogComponent, Host>
  ) {
    this.hostForm = new FormControl<string | null>(null, Validators.pattern(this.grpcInterceptor.checkRegex));

    this.subscription.add(this.hostForm.valueChanges.pipe(switchMap((value) => {
      if (this.hostForm.valid && value !== '') {
        this.loading.set(true);
        return this.httpClient.get<Environment>(value + '/static/environment.json')
          .pipe(catchError(() => {
            return of();
          }));
      }
      return of();
    })).subscribe((value) => {
      this.testedEnvironment = value;
      this.loading.set(false);
    }));

    this.subscription.add(
      this.choiceForm.valueChanges.subscribe(value => {
        if (value) {
          this.customEnvironmentForm.disable();
        } else {
          this.customEnvironmentForm.enable();
        }
      })
    );

    this.customEnvironmentForm.disable();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeSubmit() {
    if (this.hostForm.value) {
      let environment = undefined;
      if (!this.choiceForm.value) {
        environment = {
          name: this.customEnvironmentForm.value.name ?? undefined,
          version: this.customEnvironmentForm.value.version ?? undefined,
          description: this.customEnvironmentForm.value.description ?? undefined,
          color: this.customEnvironmentForm.value.color!,
        };
      }
      this.dialogRef.close({
        endpoint: this.hostForm.value,
        environment, 
      });
    }
  }
}