import { TaskStatus } from "@armonik.admin.gui/shared/data-access";

export type Item = {
  value: number;
  id: TaskStatus;
  name: string;
}

// TODO: add more colors
export type Color = 'grey' | 'orange' | 'green' | 'red' | 'yellow' | 'amber';

export type Group = {
  name: string;
  color: Color;
  items: Item[];
}

export type StoredGroup = {
  name: string;
  color: Color;
  items: TaskStatus[];
}

export type StoredRemovedItem = TaskStatus;
