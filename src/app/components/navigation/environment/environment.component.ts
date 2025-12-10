import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { rotateFull } from '@app/shared/animations';
import { ConfirmationDialogComponent } from '@components/dialogs/confirmation/confirmation.dialog';
import { ConfirmationDialogData } from '@components/dialogs/confirmation/type';
import { Environment, EnvironmentService, Host } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { catchError, Observable, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { AddEnvironmentDialogComponent } from './dialog/add-environment.dialog';
import { ConflictingEnvironmentDialogComponent, ConflictingEnvironmentDialogData } from './dialog/conflicting-environment.dialog';

@Component({
  selector: 'app-environment',
  templateUrl: 'environment.component.html',
  styleUrl: 'environment.component.scss',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  providers: [
    EnvironmentService
  ],
  animations: [
    rotateFull,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnvironmentComponent implements OnInit, AfterViewInit, OnDestroy {
  environment = signal<Environment | null>(null);
  defaultEnvironment: Environment | null = null;
  defaultEnvironmentError = false;
  private readonly host$ = new Subject<void>();

  @ViewChild(MatMenuTrigger) private readonly trigger: MatMenuTrigger | null = null;

  openedMenu = false;

  private readonly subscription = new Subscription();

  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);
  private readonly httpClient = inject(HttpClient);
  readonly environmentService = inject(EnvironmentService);

  ngOnInit(): void {
    const hostSubscription = this.host$.pipe(
      startWith(),
      switchMap(() => {
        if (this.environmentService.currentHost?.environment) {
          return of(this.environmentService.currentHost?.environment);
        }
        return this.hostToEnvironment(this.environmentService.currentHost?.endpoint ?? null);
      }),
    ).subscribe((environment) => {
      this.environment.set(this.partialToCompleteEnv(environment));
    });

    this.hostToEnvironment(null).subscribe((value) => {
      this.defaultEnvironment = this.partialToCompleteEnv(value);
      this.defaultEnvironmentError = value === null;
    });

    this.subscription.add(hostSubscription);

    this.host$.next();
  }

  ngAfterViewInit(): void {
    if (this.trigger) {
      this.subscription.add(this.trigger.menuClosed.subscribe(() => {
        this.openedMenu = false;
      }));
      this.subscription.add(this.trigger.menuOpened.subscribe(() => {
        this.openedMenu = true;
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  selectEnvironment(envHost: Host | null) {
    if (envHost && this.environmentService.hosts.some(h => h.endpoint === envHost.endpoint)) {
      this.environment.set(this.partialToCompleteEnv(envHost.environment ?? null));
      this.environmentService.selectHost(envHost);
    } else {
      this.environment.set(this.defaultEnvironment);
      this.environmentService.selectHost(null);
    }
  }

  private hostToEnvironment(endpoint: string | null): Observable<Environment | null> {
    return this.httpClient.get<Environment>(`${endpoint ?? ''}/static/environment.json`)
      .pipe(catchError(() => of(null)));
  }

  openNewEnvDialog() {
    const dialogRef = this.dialog.open<AddEnvironmentDialogComponent, void, Host>(AddEnvironmentDialogComponent);

    dialogRef.afterClosed().subscribe(value => {
      if (value && value.endpoint) {
        let endpoint = value.endpoint.trim();
        if (endpoint.at(-1) === '/') {
          endpoint = endpoint.slice(0, -1);
        }
        value.endpoint = endpoint;
        const old = this.environmentService.hosts.find(h => h.endpoint === endpoint);
        if (old) {
          this.openConflictingEnvDialog(old, value);
        } else {
          this.environmentService.addEnvironment(value);
        }
        
      }
    });
  }

  openConflictingEnvDialog(oldHost: Host, newHost: Host) {
    const dialogref = this.dialog.open<ConflictingEnvironmentDialogComponent, ConflictingEnvironmentDialogData>(ConflictingEnvironmentDialogComponent, {
      data: {
        old: oldHost,
        new: newHost,
      },
    });

    dialogref.afterClosed().subscribe(value => {
      if (value) {
        this.environmentService.removeEnvironment(oldHost);
        this.environmentService.addEnvironment(newHost);
      }
    });
  }

  deleteEnv(host: Host) {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData>(ConfirmationDialogComponent, {
      data: {
        title: $localize`Removing an environment`,
        content: [$localize`Do you really want to remove this environment ?`],
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.environmentService.removeEnvironment(host);

        if (host === this.environmentService.currentHost) {
          this.selectEnvironment(null);
        }
      }
    });
  }

  private partialToCompleteEnv(env: Partial<Environment> | null) {
    return {
      color: env?.color || 'red',
      name: env?.name || 'Unknown',
      description: env?.description || 'Unknown',
      version: env?.version || 'Unknown',
    } satisfies Environment;
  }
}