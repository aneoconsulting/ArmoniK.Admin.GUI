import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { ThemeService } from '@services/theme.service';
import { ThemeSelectorComponent } from './theme-selector.component';

describe('ThemeSelectorComponent', () => {
  let component: ThemeSelectorComponent;
  let fixture: ComponentFixture<ThemeSelectorComponent>;

  const mockThemeService = {
    changeTheme: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ThemeSelectorComponent,
        { provide: ThemeService, useValue: mockThemeService },
        IconsService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('fill')).toEqual('format_color_fill');
  });

  it('should update theme', () => {
    const newTheme = 'light-pink';
    component.updateTheme(newTheme);
    expect(mockThemeService.changeTheme).toHaveBeenCalledWith(newTheme);
  });
});