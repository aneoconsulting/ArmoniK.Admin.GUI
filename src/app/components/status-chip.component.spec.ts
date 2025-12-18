import { TestBed } from '@angular/core/testing';
import { StatusLabelColor } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { StatusChipComponent } from './status-chip.component';

describe('StatusChipComponent', () => {
  let component: StatusChipComponent;

  const mockIconsService = {
    getIcon: jest.fn(icon => icon),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        StatusChipComponent,
        { provide: IconsService, useValue: mockIconsService },
      ],
    }).inject(StatusChipComponent);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should have a set label', () => {
      expect(component.label).toBeDefined();
    });

    it('should have a set color', () => {
      expect(component.color).toBeDefined();
    });

    it('should not have a set icon', () => {
      expect(component.icon).toBeUndefined();
    });
  });

  describe('Setting status', () => {
    describe('With valid and complete status data', () => {
      const newStatusLabelColor: StatusLabelColor = {
        color: 'yellow',
        label: 'Running',
        icon: 'heart',
      };

      beforeEach(() => {
        component.status = newStatusLabelColor;
      });

      it('should set the label properly', () => {
        expect(component.label).toBe(newStatusLabelColor.label);
      });

      it('should set the label properly', () => {
        expect(component.color).toBe(newStatusLabelColor.color);
      });

      it('should set the icon properly', () => {
        expect(component.icon).toBe(newStatusLabelColor.icon);
      });
    });

    describe('With incomplete status data', () => {
      beforeEach(() => {
        component.status = {
          color: undefined as unknown as string,
          label: undefined as unknown as string,
          icon: '',
        };
      });

      it('should set the label as "Unknown"', () => {
        expect(component.label).toEqual('Unknown');
      });

      it('should set the color as grey (default)', () => {
        expect(component.color).toEqual('grey');
      });

      it('should set the icon as undefined', () => {
        expect(component.icon).toBeUndefined();
      });
    });
  });
});