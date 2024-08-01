import { Field } from '../column.type';
import { DataRaw } from '../data';

export abstract class AbstractInspectionService<T extends DataRaw> {
  abstract readonly fields: Field<T>[];
}