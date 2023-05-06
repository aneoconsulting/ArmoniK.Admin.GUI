import { Params } from "@angular/router";
import { Observable } from "rxjs";

export type AppNavLink = {
  path: string | string[];
  label: string;
  queryParams?: Record<string, string | number | boolean>;
  queryParams$?: Observable<Params>;
  shape: string;
};
