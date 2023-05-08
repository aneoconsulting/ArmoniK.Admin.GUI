import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { SortDirection } from "@angular/material/sort";

export type ApplicationColumn = keyof ApplicationRaw.AsObject

export interface ModifyColumnsDialogData {
  currentColumns: ApplicationColumn[]
  availableColumns: ApplicationColumn[]
}

export interface Filter {
  name: ApplicationColumn | null
  value: string | null
}

export interface FiltersDialogData {
  availableColumns: ApplicationColumn[],
  filters: Filter[]
}

export interface ListOptions<T extends string> {
  pageIndex: number
  pageSize: number
  sort: {
    active: T
    direction: SortDirection
  }
}

export type ListApplicationsOptions = ListOptions<ApplicationColumn>
