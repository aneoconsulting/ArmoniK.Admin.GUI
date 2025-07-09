import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-json',
  templateUrl: 'json.component.html',
  imports: [
    JsonPipe
  ],
  styles: [`
  section {
    margin-left: 1rem;
  }
  p {
    margin: 0;
  }
    `]
})
export class JsonComponent {
  private _data: object;

  keys: (keyof object)[];
  
  @Input({ required: true }) set data(entry: object | null) {
    if(entry) {
      this.keys = Object.keys(entry).map(key => key.replace('_', '')) as keyof object;
      this._data = entry;
    }
  }

  get data(): object {
    return this._data;
  }

  isArray(key: keyof object): boolean {
    return this.data[key] && (this.data[key] as Array<string>).length;
  }

  isObject(key: keyof object): boolean {
    return (this._data[key] as unknown) instanceof Object;
  }
}