import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AppShowComponent } from '@app/types/components';
import { ShowPageComponent } from '@components/show-page.component';
import { ShareUrlService } from '@services/share-url.service';
import { UtilsService } from '@services/utils.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="data?.name ?? null" [data]="data" [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="workspaces"></mat-icon>
  <span i18n="Page title"> Result </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    ResultsGrpcService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent implements AppShowComponent<ResultRaw>, OnInit, AfterViewInit {
  sharableURL = '';
  data: ResultRaw | null = null;

  #shareURLService = inject(ShareUrlService);

  constructor(
    private _route: ActivatedRoute,
    private _resultsGrpcService: ResultsGrpcService,
  ) {}

  ngOnInit(): void {
    this.sharableURL = this.#shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this._route.params.pipe(
      map(params => params['id']),
      switchMap((id) => {
        return this._resultsGrpcService.get$(id);
      }),
      map((data) => {
        return data.result ?? null;
      })
    )
      .subscribe((data) => this.data = data);
  }
}
