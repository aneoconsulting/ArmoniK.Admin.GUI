import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';

@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: TasksComponent }]),
  ],
})
export class TasksModule {}
