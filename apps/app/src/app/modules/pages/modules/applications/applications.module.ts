import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { RouterModule } from '@angular/router';
import { TitleService } from '../../../core/services';
import { TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
  ],
})
export class ApplicationsModule {
  constructor(
    private titleService: TitleService,
    private translateService: TranslateService
  ) {
    this.titleService.setTitle(
      this.translateService.instant('applications.title')
    );
  }
}
