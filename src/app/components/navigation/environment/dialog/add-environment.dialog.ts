import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddLineDialogComponent } from '@app/dashboard/components/add-line-dialog.component';
import { GrpcHostInterceptor } from '@app/interceptors/grpc.interceptor';
import { SpinnerComponent } from '@components/spinner.component';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { Environment } from '@services/environment.service';
import { catchError, lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-add-environment-dialog',
  templateUrl: 'add-environment.dialog.html',
  styleUrl: 'add-environment.dialog.css',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    SpinnerComponent,
    MatTooltipModule,
  ],
  providers: [],
})
export class AddEnvironmentDialogComponent {
  readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;
  readonly httpClient = inject(HttpClient);

  readonly formGroup: FormGroup<{host: FormControl<string | null>}>;

  readonly loading = signal(false);
  testedEnvironment: Environment | null | undefined;

  constructor(
    private readonly dialogRef: MatDialogRef<AddLineDialogComponent>,
  ) {
    this.formGroup = new FormGroup<{host: FormControl<string | null>}>({
      host: new FormControl<string | null>(null, Validators.pattern(this.grpcInterceptor.checkRegex))
    });

    this.formGroup.valueChanges.subscribe((value) => {
      if (this.formGroup.valid && value.host) {
        const testFn = () => {
          this.loading.set(true);
          lastValueFrom(
            this.httpClient.get<Environment>(value.host + '/static/environment.json')
              .pipe(catchError(() => of(null)))
          ).then((result) => {
            if (result) {
              this.testedEnvironment = result;
            } else {
              this.testedEnvironment = null;
            }
            this.loading.set(false);
          });
        };
        this.grpcInterceptor.test(value.host, testFn);
      }
    });
  }

  private testFunction() {
    lastValueFrom(
      this.httpClient.get<Environment>('/static/environment.json')
        .pipe(catchError(() => of(null)))
    ).then((result) => {
      if (result) {
        this.testedEnvironment = result;
      } else {
        this.testedEnvironment = null;
      }
    });
  }
}