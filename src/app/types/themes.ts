export const ALL_THEMES = ['light-blue', 'light-pink', 'dark-green', 'dark-purple'];

export type Theme = typeof ALL_THEMES[number];

export function isTheme(value: string): value is Theme {
  return ALL_THEMES.includes(value);
}

export const COLOR_SCHEME = ['light dark', 'light', 'dark'];

export type ColorScheme = typeof COLOR_SCHEME[number];

export function isColorTheme(value: string): value is ColorScheme {
  return COLOR_SCHEME.includes(value);
}