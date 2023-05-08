import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";

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
