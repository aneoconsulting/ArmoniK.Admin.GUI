import { ByteArrayService } from './byte-array.service';

describe('ByteArrayService', () => {
  const service = new ByteArrayService();

  describe('decode', () => {
    it('should return a valid encoded UTF-8 string', () => {
      const encoder = new TextEncoder();
      const initialString = 'I am a valid UTF-8 string !';
      const encodedString: Uint8Array = encoder.encode(initialString);
      expect(service.decode(encodedString)).toEqual(initialString);
    });

    it('should return null without any exception for a non-valid UTF-8 string', () => {
      const invalidUtf8String = new Uint8Array([55, 179, 21]); // 179 represents the invalid character
      expect(service.decode(invalidUtf8String)).toBeNull();
    });
  });

  describe('byteLengthToString', () => {
    it('should compute octets', () => {
      expect(service.byteLengthToString(1.01)).toEqual('1.01 o');
    });

    it('should compute kilo-octets', () => {
      expect(service.byteLengthToString(1010)).toEqual('1.01 Ko');
    });

    it('should compute mega-octets', () => {
      expect(service.byteLengthToString(1010000)).toEqual('1.01 Mo');
    });

    it('should compute giga-octets', () => {
      expect(service.byteLengthToString(1010000000)).toEqual('1.01 Go');
    });

    it('should return null if the byteLength is equal to 0', () => {
      expect(service.byteLengthToString(0)).toBeNull();
    });
  });
});