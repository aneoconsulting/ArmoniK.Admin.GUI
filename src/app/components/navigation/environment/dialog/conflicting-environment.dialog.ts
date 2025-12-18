import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, Inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Environment, Host } from '@services/environment.service';
import { catchError, combineLatest, Observable, of, Subscription } from 'rxjs';

export type ConflictingEnvironmentDialogData = { old: Host, new: Host };

@Component({
  selector: 'app-conflicting-environment-dialog',
  templateUrl: 'conflicting-environment.dialog.html',
  styleUrl: 'conflicting-environment.dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatTooltipModule, MatButtonModule],
})
export class ConflictingEnvironmentDialogComponent implements OnDestroy {
  private readonly httpClient = inject(HttpClient);

  endpoint: string;
  oldEnv = signal<Environment | undefined>(undefined);
  newEnv = signal<Environment | undefined>(undefined);

  private readonly subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) data: ConflictingEnvironmentDialogData
  ) {
    this.init(data);
  }

  private init(data: ConflictingEnvironmentDialogData) {
    this.endpoint = data.new.endpoint;
    this.subscription.add(combineLatest([
      data.old.environment ? of(data.old.environment) : this.hostToEnvironment(data.old.endpoint),
      data.new.environment ? of(data.new.environment) : this.hostToEnvironment(data.new.endpoint)
    ]).subscribe(hosts => {
      this.oldEnv.set(this.partialToCompleteEnv(hosts[0]));
      this.newEnv.set(this.partialToCompleteEnv(hosts[1]));
    }));
  }

  private hostToEnvironment(endpoint: string): Observable<Environment | null> {
    return this.httpClient.get<Environment>(`${endpoint}/static/environment.json`)
      .pipe(catchError(() => of(null)));
  }

  private partialToCompleteEnv(env: Partial<Environment> | null) {
    return {
      color: env?.color || 'red',
      name: env?.name || 'Unknown',
      description: env?.description || 'Unknown',
      version: env?.version || 'Unknown',
    } satisfies Environment;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}