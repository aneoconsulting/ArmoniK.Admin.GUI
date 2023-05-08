import { Injectable } from "@angular/core";

@Injectable()
export class TableService {
  private _columnsKey = 'columns';

  constructor(private _storage: Storage) {}

  /**
   * Save columns to the local storage
   */
  saveColumns(tableName: string, columns: string[]): void {
    const key = this._buildKey(tableName, this._columnsKey);
    this._storage.setItem(key, JSON.stringify(columns));
  }

  /**
   * Restore columns from the local storage
   */
  restoreColumns(tableName: string): string[] | null {
    const key = this._buildKey(tableName, this._columnsKey);
    const columns = this._storage.getItem(key);

    if (columns) {
      return JSON.parse(columns);
    }

    return null;
  }

  /**
   * Build the key to store data in local storage
   */
  private _buildKey(tableName: string, key: string): string {
    return `${tableName}_${key}`;
  }
}
