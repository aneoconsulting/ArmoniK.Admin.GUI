export const ALL_THEMES = ['light-blue', 'light-pink', 'dark-green', 'dark-purple'];

export type Theme = typeof ALL_THEMES[number];

export function isTheme(value: string): value is Theme {
  return ALL_THEMES.includes(value);
}