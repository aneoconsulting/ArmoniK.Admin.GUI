import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { Line } from '../types';

@Injectable()
export class DashboardStorageService {

  #storageService = inject(StorageService);

  saveLines(lines: Line[]): void {
    this.#storageService.setItem('dashboard-lines', lines);
  }

  restoreLines(): Line[] | null {
    const storedLines = this.#storageService.getItem<Line[]>('dashboard-lines', true) as Line[] | null;

    if (storedLines) {
      return storedLines;
    }
    return null;
  }
}
