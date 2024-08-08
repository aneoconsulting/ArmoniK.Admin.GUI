import { Field } from '../column.type';
import { DataRaw } from '../data';

export abstract class InspectionService<T extends DataRaw> {
  abstract readonly fields: Field<T>[];
}