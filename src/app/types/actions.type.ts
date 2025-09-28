import { DataRaw } from './data';

export type GrpcAction<T extends DataRaw> = {
  label: string,
  icon: string,
  click: (value: T[]) => void,
  condition?: (value: T[]) => boolean,
  key?: string
}