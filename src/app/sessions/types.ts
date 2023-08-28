import {SessionRaw as GrpcSessionRaw, SessionRawEnumField, SessionTaskOptionEnumField, SessionTaskOptionGenericField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, FieldKey } from '@app/types/data';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { FilterDefinition, FilterFor } from './services/sessions-filters.service';

export type SessionRaw = GrpcSessionRaw.AsObject;
export type SessionRawColumnKey = ColumnKey<SessionRaw, TaskOptions> | 'count';
export type SessionRawFieldKey = FieldKey<SessionRaw>;
export type SessionRawListOptions = ListOptions<SessionRaw>;

export type SessionRawField = SessionRawEnumField | SessionTaskOptionEnumField | SessionTaskOptionGenericField;

export type SessionFilterField = SessionRawEnumField | SessionTaskOptionEnumField;
export type SessionFilterDefinition = FilterDefinition<SessionRawEnumField, SessionTaskOptionEnumField>;

export type SessionFilterFor = FilterFor<SessionRawEnumField, SessionTaskOptionEnumField>;
export type SessionRawFiltersOr = FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField>;
export type SessionRawFilter = Filter<SessionRawEnumField, SessionTaskOptionEnumField>;
