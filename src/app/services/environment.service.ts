import { Injectable } from '@angular/core';

export interface Environment {
  color: string,
  name: string,
  description: string,
  version: string,
}

@Injectable()
export class EnvironmentService {
  #environment: Environment;

  getEnvironment(): Environment {
    return this.#environment;
  }

  setEnvironment(environment: Environment): void {
    this.#environment = environment;
  }
}
