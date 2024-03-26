import { IconsService } from './icons.service';

describe('IconsService', () => {
  const service = new IconsService();

  describe('getIcon', () => {
    it('Should return the correct icon (3 tests)', () => {
      expect(service.getIcon('refresh')).toEqual('refresh');
      expect(service.getIcon('fill')).toEqual('format_color_fill');
      expect(service.getIcon('arrow-down')).toEqual('arrow_drop_down');
    });

    it('Should throw an error when the icon name is invalid', () => {
      expect(() => {service.getIcon('this-icon-does-not-exists');})
        .toThrowError('Icon \'this-icon-does-not-exists\' not found');
    });
  });

  describe('getPageIcon', () => {
    it('Should return the correct icon (3 tests)', () => {
      expect(service.getPageIcon('applications')).toEqual('apps');
      expect(service.getPageIcon('tasks')).toEqual('adjust');
      expect(service.getPageIcon('profile')).toEqual('account_circle');
    });
  });
});