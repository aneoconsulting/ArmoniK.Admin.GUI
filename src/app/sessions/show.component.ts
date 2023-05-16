import { AfterViewInit, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { ShowPageComponent } from '@components/show-page.component';
import { UtilsService } from '@services/utils.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-partitions-show',
  template: `
<!-- TODO: Create a function to generate sharable URL -->
<app-show-page [id]="data?.sessionId ?? null" [data]="data" [sharableURL]="'hello'">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="workspaces"></mat-icon>
  <span>Session</span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    SessionsGrpcService
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<SessionRaw>, AfterViewInit {
  data: SessionRaw | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _sessionsGrpcService: SessionsGrpcService,
  ) {}

  ngAfterViewInit(): void {
    this._route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this._sessionsGrpcService.get$(id);
      }),
      map((data) => {
        return data.session ?? null;
      })
    )
    // FIXME: Remove the `as unknown as SessionRaw` cast
      .subscribe((data) => this.data = data as unknown as SessionRaw);
  }
}
