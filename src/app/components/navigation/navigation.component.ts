import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HealthCheckComponent } from '@app/healthcheck/healthcheck.component';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { SidebarItem } from '@app/types/navigation';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AddSideBarItemDialogComponent } from './add-sidebar-item-dialog/add-sidebar-item.dialog.component';
import { AddSideBarItemDialogResult } from './add-sidebar-item-dialog/types';
import { ChangeLanguageButtonComponent } from './change-language-button.component';
import { EnvironmentComponent } from './environment/environment.component';
import { ExternalServicesComponent } from './external-services/external-services.component';
import { SchemeSwitcherComponent } from './scheme-switcher/scheme-switcher.component';
import { VersionsMenuComponent } from './version-menu/versions-menu.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: 'navigation.component.scss',
  providers: [
    StorageService,
    IconsService,
  ],
  imports: [
    AsyncPipe,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    ChangeLanguageButtonComponent,
    HealthCheckComponent,
    ExternalServicesComponent,
    VersionsMenuComponent,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    EnvironmentComponent,
    SchemeSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly navigationService = inject(NavigationService);
  private readonly iconsService = inject(IconsService);
  private readonly userConnectedGuard = inject(UserConnectedGuard);
  private readonly dialog = inject(MatDialog);

  settingsItem = $localize`Settings`;

  private userConnected = signal(this.userConnectedGuard.canActivate());
  isProfileButtonDisabled = computed(() => !this.userConnected());

  sidebar = this.navigationService.currentSidebar;
  sideBarOpened = true;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.sideBarOpened = this.navigationService.restoreSideBarOpened();
    this.updateUserConnectionStatus();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  drop(event: CdkDragDrop<SidebarItem[]>) {
    moveItemInArray(this.navigationService.currentSidebar, event.previousIndex, event.currentIndex);
  }

  public updateUserConnectionStatus(): void {
    this.userConnected.set(this.userConnectedGuard.canActivate());
  }

  toggleSidebar() {
    this.navigationService.toggleSidebarOpened();
  }

  deleteSideBarItem(index: number) {
    this.navigationService.deleteSidebarItem(index);
  }

  addNewSideBarItem() {
    const dialogRef = this.dialog.open<AddSideBarItemDialogComponent, void, AddSideBarItemDialogResult>(AddSideBarItemDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.navigationService.addSidebarItem(result.item);
      }
    });
  }
}
