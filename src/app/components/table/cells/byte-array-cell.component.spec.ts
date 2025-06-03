import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { ByteArrayComponent } from './byte-array-cell.component';

describe('ByteArrayComponent', () => {
  let component: ByteArrayComponent;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const data = {
    buffer: {
      byteLength: 10000,
    },
  } as Uint8Array;
  const label = 'Opaque ID';

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ByteArrayComponent,
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(ByteArrayComponent);

    component.data = data;
    component.label = label;
  });

  it('should load', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the byteLength', () => {
      expect(component.byteLength).toEqual('10.00 Ko');
    });

    it('should set the label', () => {
      expect(component.label).toEqual(label);
    });

    it('should set the buffered array', () => {
      expect(component['array']).toEqual(data.buffer);
    });
  });

  describe('download', () => {
    const anchor = {
      href: '',
      download: '',
      click: jest.fn(),
      remove: jest.fn(),
    } as unknown as HTMLAnchorElement;

    const url = 'some-random-URL';

    const revokeObjectUrlSpy = jest.fn();

    beforeEach(() => {
      global.URL.createObjectURL = jest.fn(() => url);
      global.URL.revokeObjectURL = revokeObjectUrlSpy;

      const documentCreateElementSpy = jest.spyOn(document, 'createElement');
      documentCreateElementSpy.mockReturnValueOnce(anchor);

      jest.useFakeTimers().setSystemTime(new Date('2025-01-01'));

      component.download();
    });

    it('should set the href of the anchor as the URL', () => {
      expect(anchor.href).toEqual(url);
    });

    it('should set the download of the anchor as the document name', () => {
      expect(anchor.download).toEqual('2025-01-01-opaque-id');
    });

    it('should click the anchor', () => {
      expect(anchor.click).toHaveBeenCalled();
    });

    it('should revoke the object URL', () => {
      expect(revokeObjectUrlSpy).toHaveBeenCalledWith(url);
    });

    it('should remove the anchore', () => {
      expect(anchor.remove).toHaveBeenCalled();
    });
  });

  it('should retrieve the icons properly', () => {
    const icon = 'heart';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });

  describe('computeByteLength', () => {
    it('should compute octets', () => {
      component['computeByteLength'](1.01);
      expect(component.byteLength).toEqual('1.01 o');
    });

    it('should compute kilo-octets', () => {
      component['computeByteLength'](1010);
      expect(component.byteLength).toEqual('1.01 Ko');
    });

    it('should compute mega-octets', () => {
      component['computeByteLength'](1010000);
      expect(component.byteLength).toEqual('1.01 Mo');
    });

    it('should compute giga-octets', () => {
      component['computeByteLength'](1010000000);
      expect(component.byteLength).toEqual('1.01 Go');
    });
  });
});