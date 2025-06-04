import { ByteDecoderService } from './byte-decoder.service';

describe('ByteDecoderService', () => {
  const service = new ByteDecoderService();

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
});