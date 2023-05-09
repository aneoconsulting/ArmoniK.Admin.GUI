import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { SortDirection } from "@angular/material/sort";

export type ApplicationColumn = keyof ApplicationRaw.AsObject | 'actions'

export type FilterField = keyof ApplicationRaw.AsObject

export interface ModifyColumnsDialogData {
  currentColumns: ApplicationColumn[]
  availableColumns: ApplicationColumn[]
}

export interface Filter {
  field: FilterField | null
  value: string | null
}

export interface FiltersDialogData {
  availableFiltersFields: FilterField[],
  filters: Filter[]
}

// TODO: create a generic interface to use for filters
export interface ListOptions<T extends string> {
  pageIndex: number
  pageSize: number
  sort: {
    active: T
    direction: SortDirection
  },
  // TODO: remove '?'
  filters?: {
    [key in T]: string | null
  }
}

export type ListApplicationsOptions = ListOptions<FilterField>

export interface AutoRefreshDialogData {
  value: number
}
