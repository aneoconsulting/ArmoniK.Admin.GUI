import { User } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { UserService } from '@services/user.service';
import { IndexComponent } from './index.component';
import { PermissionGroup } from './types';

describe('IndexComponent', () => {
  let component: IndexComponent;

  const user: User.AsObject = {
    username: 'ArmoniK',
    permissions: ['Sessions:list', 'Sessions:get', 'Sessions:cancel', 'Tasks:list'],
    roles: ['Operator', 'User']
  };

  const mockUserService = {
    user: user as User.AsObject | undefined
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        { provide: UserService, useValue: mockUserService },
        IconsService
      ]
    }).inject(IndexComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should have a null sharabkeurl', () => {
    expect(component.sharableURL).toBe(null);
  });

  it('should allows to get user', () => {
    expect(component.user).toBe(user);
  });

  it('should get Icons', () => {
    expect(component.getIcon('profile')).toEqual('account_circle');
  });

  describe('grouping permissions', () => {
    it('should group permissions', () => {
      expect(component.groupedPermissions()).toEqual<PermissionGroup[]>([
        {
          name: 'sessions',
          permissions: [
            'list', 'get', 'cancel'
          ]
        },
        {
          name: 'tasks',
          permissions: [
            'list'
          ]
        }
      ]);
    });

    it('should have empty permissions if no users are connected', () => {
      mockUserService.user = undefined;
      expect(component.groupedPermissions()).toEqual([]);
    });
  });
});