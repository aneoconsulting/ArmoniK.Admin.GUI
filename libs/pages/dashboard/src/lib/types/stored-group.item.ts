import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Color } from './color.type';

export type StoredGroup = {
  name: string;
  color: Color;
  items: TaskStatus[];
};
