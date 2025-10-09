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
import { Environment, EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { catchError, combineLatest, concatMap, from, mergeMap, Observable, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { AddEnvironmentDialogComponent } from './dialog/add-environment.dialog';

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
  private readonly host$ = new Subject<void>();
  environment = signal<Environment | null>(null);
  defaultEnvironment: Environment | null = null;

  private readonly hostList$ = new Subject<void>();
  readonly environmentList: Map<string, Environment | null> = new Map();

  @ViewChild(MatMenuTrigger) private readonly trigger: MatMenuTrigger;

  openedMenu = false;

  private readonly subscription = new Subscription();

  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);
  private readonly httpClient = inject(HttpClient);

  readonly environmentService = inject(EnvironmentService);

  ngOnInit(): void {
    const hostSubscription = this.host$.pipe(
      startWith(),
      switchMap(() => this.httpClient.get<Partial<Environment>>(`${this.environmentService.currentHost ?? ''}/static/environment.json`)),
      catchError((error) => {
        console.error(error);
        return of({} as Partial<Environment>); // Returns environment with undefined fields
      })
    ).subscribe((environment) => {
      this.environment.set(this.partialToCompleteEnv(environment));
    });

    const hostListSubscription = this.hostList$.pipe(
      startWith(),
      concatMap(() => from(this.environmentService.hosts)),
      mergeMap((host) => combineLatest([of(host), this.hostToEnvironment(host)]))
    ).subscribe(([host, value]) => {
      this.environmentList.set(host, value);
    });

    this.httpClient.get<Partial<Environment>>('/static/environment.json').subscribe((value) => {
      this.defaultEnvironment = this.partialToCompleteEnv(value);
    });

    this.subscription.add(hostSubscription);
    this.subscription.add(hostListSubscription);

    this.host$.next();
    this.hostList$.next();
  }

  ngAfterViewInit(): void {
    this.subscription.add(this.trigger.menuClosed.subscribe(() => {
      this.openedMenu = false;
    }));
    this.subscription.add(this.trigger.menuOpened.subscribe(() => {
      this.openedMenu = true;
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  selectEnvironment(envHost: string | null) {
    if (envHost && this.environmentService.hosts.includes(envHost)) {
      const env = this.environmentList.get(envHost);
      if (env) {
        this.environment.set(env);
        this.environmentService.selectHost(envHost);
      }
    } else {
      this.environment.set(this.defaultEnvironment);
      this.environmentService.selectHost(null);
    }
  }

  private hostToEnvironment(envAdress: string): Observable<Environment | null> {
    return this.httpClient.get<Environment>(`${envAdress}/static/environment.json`)
      .pipe(catchError(() => of(null)));
  }

  openNewEnvDialog() {
    const dialogRef = this.dialog.open<AddEnvironmentDialogComponent, void, string>(AddEnvironmentDialogComponent);

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.environmentService.addEnvironment(value);
        this.hostList$.next();
      }
    });
  }

  deleteEnv(host: string) {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmationDialogData>(ConfirmationDialogComponent, {
      data: {
        title: $localize`Removing an environment`,
        content: [$localize`Do you really want to remove this environment ?`],
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.environmentService.removeEnvironment(host);
        this.hostList$.next();

        if (host === this.environmentService.currentHost) {
          this.selectEnvironment(null);
        }
      }
    });
  }

  private partialToCompleteEnv(partial: Partial<Environment>) {
    return {
      color: partial.color || 'red',
      name: partial.name || 'Unknown',
      description: partial.description || 'Unknown',
      version: partial.version || 'Unknown',
    } satisfies Environment;
  }
}