export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;
export type PrefixedCustom = `customs.${string}`;

export type ColumnKey<T extends object, O extends object = Record<string, never>> = keyof T | 'actions' | PrefixedOptions<O> | PrefixedCustom;

export type FieldKey<T extends object> = keyof T;
