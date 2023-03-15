import { Color } from "./color.type";
import { Item } from "./item.type";

export type Group = {
  name: string;
  color: Color;
  items: Item[];
}
