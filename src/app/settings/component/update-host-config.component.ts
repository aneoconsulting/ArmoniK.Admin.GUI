import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { HealthCheckGrpcService } from '@app/healthcheck/services/healthcheck-grpc.service';
import { GrpcHostInterceptor } from '@app/interceptors/grpc.interceptor';
import { SpinnerComponent } from '@components/spinner.component';
import { GRPC_INTERCEPTORS } from '@ngx-grpc/core';
import { IconsService } from '@services/icons.service';
import { catchError, lastValueFrom, of } from 'rxjs';

@Component({
  selector: 'app-update-host-config',
  templateUrl: 'update-host-config.component.html',
  styleUrl: 'update-host-config.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    SpinnerComponent,
  ],
  providers: [
    HealthCheckGrpcService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateHostConfigComponent implements OnInit {
  readonly grpcInterceptor = inject(GRPC_INTERCEPTORS) as GrpcHostInterceptor;
  private readonly healtCheckService = inject(HealthCheckGrpcService);
  private readonly iconsService = inject(IconsService);

  refresh = signal(false);
  connectionError = signal<string | null>(null);
  validTest = signal<boolean | null>(null);

  readonly hostForm = new FormControl<string | null>('', { validators: [Validators.pattern(this.grpcInterceptor.checkRegex), Validators.required] });

  ngOnInit(): void {
    this.hostForm.setValue(this.grpcInterceptor.host);
  }

  inputChange() {
    this.validTest.set(null);
  }

  updateConfig() {
    const host = this.hostForm.getRawValue();
    if (host !== null && host !== '' && this.grpcInterceptor.checkRegex.test(host)) {
      this.grpcInterceptor.setHost(host);
    }
  }

  testConnection() {
    const testFn = () => {
      this.refresh.set(true);
      lastValueFrom(this.healtCheckService.list$().pipe(
        catchError(() => of('Could not connect.'))
      )).then((result) => {
        this.refresh.set(false);
        if (typeof result === 'string') {
          this.connectionError.set(result);
          this.validTest.set(false);
        } else {
          this.validTest.set(true);
          this.connectionError.set(null);
        }
      });
    };
    this.grpcInterceptor.test(this.hostForm.getRawValue(), testFn);
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  clearHost() {
    this.hostForm.reset();
    this.grpcInterceptor.clearHost();
  }
}