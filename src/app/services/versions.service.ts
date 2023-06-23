import { Injectable } from '@angular/core';

@Injectable()
export class VersionsService {
  core: string | null = null;
  api: string | null = null;
}
