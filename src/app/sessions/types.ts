import {SessionRaw as GrpcSessionRaw, SessionRawEnumField, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, FieldKey } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type SessionRaw = GrpcSessionRaw.AsObject;
export type SessionRawColumnKey = ColumnKey<SessionRaw, TaskOptions> | 'count' | `options.options.${string}`;
export type SessionRawFieldKey = FieldKey<SessionRaw>;
export type SessionRawListOptions = ListOptions<SessionRaw>;

export type SessionRawField = SessionRawEnumField | SessionTaskOptionEnumField | string;

export type SessionFilterField = SessionRawEnumField | SessionTaskOptionEnumField | { for: string, index: number };
export type SessionFilterDefinition = FilterDefinition<SessionRawEnumField, SessionTaskOptionEnumField>;

export type SessionFilterFor = FilterFor<SessionRawEnumField, SessionTaskOptionEnumField>;
export type SessionRawFilters = FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField>;
export type SessionRawFilter = Filter<SessionRawEnumField, SessionTaskOptionEnumField>;
