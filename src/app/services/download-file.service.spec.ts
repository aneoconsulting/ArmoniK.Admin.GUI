import { FileFormat } from '@app/types/file.type';
import { downloadFile } from './download-file.service';

describe('download-file function', () => {
  const anchor = {
    href: '',
    download: '',
    click: jest.fn()
  };

  const mockId = 1234;
  const mockDate = '2024 01 01';
  
  global.document.createElement = jest.fn().mockReturnValue(anchor);
  global.URL.createObjectURL = jest.fn();

  global.Date.prototype.getTime = jest.fn(() => mockId);
  global.Date.prototype.toISOString = jest.fn(() => mockDate);

  const name = 'settings';
  const format: FileFormat = 'csv';
  
  const data = JSON.stringify([1, 2, 3]);

  beforeEach(() => {
  });
  
  it('should download the settings', () => {
    downloadFile(data, name, format);
    expect(anchor.download).toEqual(`${mockDate}-${mockId}-${name}.${format}`);
  });

  it('should download the settings with default configuration', () => {
    downloadFile(data);
    expect(anchor.download).toContain(`${mockDate}-${mockId}.json`);
  });
  
  it('should click the anchor', () => {
    downloadFile(data);
    expect(anchor.click).toHaveBeenCalled();
  });
});