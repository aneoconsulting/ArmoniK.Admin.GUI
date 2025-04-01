import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GrpcHostInterceptor } from '@app/interceptors/grpc.interceptor';
import { SpinnerComponent } from '@components/spinner.component';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { Environment } from '@services/environment.service';
import { catchError, of, Subscription, switchMap } from 'rxjs';

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
export class AddEnvironmentDialogComponent implements OnDestroy {
  private readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;
  private readonly httpClient = inject(HttpClient);

  readonly formGroup: FormGroup<{host: FormControl<string | null>}>;

  readonly loading = signal(false);
  testedEnvironment: Environment | null | undefined;

  private readonly subscription = new Subscription();

  constructor() {
    this.formGroup = new FormGroup<{host: FormControl<string | null>}>({
      host: new FormControl<string | null>(null, Validators.pattern(this.grpcInterceptor.checkRegex))
    });

    this.subscription.add(this.formGroup.valueChanges.pipe(switchMap((value) => {
      if (this.formGroup.valid && value.host !== '') {
        this.loading.set(true);
        return this.httpClient.get<Environment>(value.host + '/static/environment.json')
          .pipe(catchError(() => of(null)));
      }
      return of(undefined);
    })).subscribe((value) => {
      this.testedEnvironment = value;
      this.loading.set(false);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}