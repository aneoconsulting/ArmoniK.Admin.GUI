import { User } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { UserService } from '@services/user.service';
import { IndexComponent } from './index.component';
import { PermissionGroup } from './types';

describe('IndexComponent', () => {
  let component: IndexComponent;

  const returnedUrl = 'some-url';
  const mockShareUrlService = {
    generateSharableURL: jest.fn(() => returnedUrl),
  };

  const user: User.AsObject = {
    username: 'ArmoniK',
    permissions: ['Sessions:list', 'Sessions:get', 'Sessions:cancel', 'Tasks:list'],
    roles: ['Operator', 'User']
  };

  const mockUserService = {
    user: user
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: UserService, useValue: mockUserService },
        IconsService
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialisation', () => {
    it('should init the sharableUrl', () => {
      expect(component.sharableURL).toBe(returnedUrl);
    });
  });

  it('should allows to get user', () => {
    expect(component.user).toBe(user);
  });

  it('should get Icons', () => {
    expect(component.getIcon('profile')).toEqual('account_circle');
  });

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
});