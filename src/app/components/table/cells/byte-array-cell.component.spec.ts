import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { ByteDecoderService } from '@services/byte-decoder.service';
import { IconsService } from '@services/icons.service';
import { ByteArrayComponent } from './byte-array-cell.component';

describe('ByteArrayComponent', () => {
  let component: ByteArrayComponent;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const mockByteDecoderService = {
    decode: jest.fn((value) => (value.content as string).includes('invalid') ? null : (value.content as string)),
  };

  const mockClipboard = {
    copy: jest.fn()
  };

  let dataContent = '';
  for(let i = 0; i !== 128; i++) {
    dataContent += 'a';
  }

  const data = {
    content: '', // The decode function is mocked to only return null when the string contains "invalid",
    byteLength: 10000,
  }; 
  const label = 'Opaque ID';

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ByteArrayComponent,
        { provide: ByteDecoderService, useValue: mockByteDecoderService },
        { provide: IconsService, useValue: mockIconsService },
        { provide: Clipboard, useValue: mockClipboard },
      ]
    }).inject(ByteArrayComponent);

    data.content = `${dataContent}`;
    component.data = data as unknown as Uint8Array;
    component.label = label;
  });

  it('should load', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    describe('valid string with more than 128 characters', () => {
      it('should decode the data', () => {
        expect(component.decodedData).toEqual(data.content);
      });

      it('should set the byteLength', () => {
        expect(component.byteLength).toEqual('10.00 Ko');
      });

      it('should set the label', () => {
        expect(component.label).toEqual(label);
      });

      it('should set the buffered array', () => {
        expect(component['byteArray']).toEqual(data);
      });
    });

    describe('valid string with less than 128 characters', () => {
      beforeEach(() => {
        component.byteLength = null;
        data.content = 'valid string';
        component.data = data as unknown as Uint8Array;
      });

      it('should decode the data', () => {
        expect(component.decodedData).toEqual(data.content);
      });
      
      it('should set the byteLength', () => {
        expect(component.byteLength).toBeNull();
      });

      it('should set the label', () => {
        expect(component.label).toEqual(label);
      });

      it('should set the buffered array', () => {
        expect(component['byteArray']).toEqual(data);
      });
    });

    describe('invalid string', () => {
      beforeEach(() => {
        data.content = 'invalid string';
        component.data = data as unknown as Uint8Array;
      });

      it('should decode the data', () => {
        expect(component.decodedData).toBeNull();
      });

      it('should set the byteLength', () => {
        expect(component.byteLength).toEqual('10.00 Ko');
      });

      it('should set the label', () => {
        expect(component.label).toEqual(label);
      });

      it('should set the buffered array', () => {
        expect(component['byteArray']).toEqual(data);
      });
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

  it('should copy the content properly', () => {
    component.copy();
    expect(mockClipboard.copy).toHaveBeenCalledWith(dataContent);
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