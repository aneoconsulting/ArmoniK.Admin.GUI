import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  imports: [
    NavigationComponent,
    RouterModule,
  ],
  templateUrl: 'app.component.html',
})
export class AppComponent {}
