import { ApplicationRawEnumField, ApplicationRaw as GrpcApplicationRaw  } from '@aneoconsultingfr/armonik.api.angular';
import { FilterDefinition, FilterFor } from '@app/sessions/services/sessions-filters.service';
import { ColumnKey, FieldKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type ApplicationRaw = GrpcApplicationRaw.AsObject;
export type ApplicationRawColumnKey = ColumnKey<ApplicationRaw, never> | 'count';
export type ApplicationRawFieldKey = FieldKey<ApplicationRaw>;
export type ApplicationRawListOptions = ListOptions<ApplicationRaw>;

export type ApplicationFilterField = ApplicationRawEnumField;
export type ApplicationsFiltersDefinition = FilterDefinition<ApplicationRawEnumField>;

export type ApplicationFilterFor = FilterFor<ApplicationRawEnumField>;
export type ApplicationRawFilter = FiltersOr<ApplicationRawEnumField>;
