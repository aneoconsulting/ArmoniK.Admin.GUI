import { IconsService } from './icons.service';

describe('IconsService', () => {
  const service = new IconsService();

  describe('getIcon', () => {
    it('Should return the correct icon (3 tests)', () => {
      expect(service.getIcon('refresh')).toEqual('refresh');
      expect(service.getIcon('fill')).toEqual('format_color_fill');
      expect(service.getIcon('arrow-down')).toEqual('arrow_drop_down');
    });

    it('Should return the default icon if the icon is invalid', () => {
      expect(service.getIcon('invalid-icon')).toEqual('radio_button_unchecked');
    });

    it('should return the default icon if the icon is null', () => {
      expect(service.getIcon(null)).toEqual('radio_button_unchecked');
    });

    it('should return the default icon if the icon is undefined', () => {
      expect(service.getIcon(undefined)).toEqual('radio_button_unchecked');
    });
  });

  describe('getAllIcons', () => {
    it('should return a list of icons', () => {
      expect(service.getAllIcons()).toEqual(Object.keys(service.icons));
    });
  });
});