import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { TaskDetailComponent } from './components';

@NgModule({
  declarations: [TasksComponent],
  imports: [
    CommonModule,
    ClarityModule,
    TranslateModule,
    RouterModule.forChild([
      { path: '', component: TasksComponent },
      { path: ':id', component: TaskDetailComponent },
    ]),
  ],
})
export class TasksModule {}
