import { Injectable } from '@angular/core';
import { FileFormat } from '@app/types/file.type';

@Injectable()
export default class DownloadService {
  /**
   * Download data into a json or csv file. The file name will be as following: "date-id-name.format".
   * the Id is the current time in seconds. 
   */
  downloadFile(data: BlobPart, name?: string, format?: FileFormat) {
    const blob = new Blob([data], { type: `application/${format ?? 'json'}` });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const id = new Date().getTime();
  
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${date}-${id}${name ? '-' + name : ''}.${format ?? 'json'}`;
    anchor.click();
  }
}