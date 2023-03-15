import { TaskStatus } from "@armonik.admin.gui/shared/data-access";
import { Color } from "./color.type";

export type StoredGroup = {
  name: string;
  color: Color;
  items: TaskStatus[];
}
