const ALL_GROUPS = ['applications', 'partitions', 'sessions', 'tasks', 'results', 'submitter', 'dashboard', 'profile', 'healthcheck'] as const;
export type Group = typeof ALL_GROUPS[number];

export type PermissionGroup = {
  name: Group;
  permissions: string[];
};

export function isGroup(value: string): value is Group {
  return ALL_GROUPS.includes(value as Group);
}