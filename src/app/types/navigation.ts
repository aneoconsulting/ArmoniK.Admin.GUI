/**
 * Navigation types
 *
 * A sidebar is build using a list of SidebarItems.
 */
const ALL_SIDEBAR_LINKS = ['dashboard', 'applications', 'sessions', 'partitions', 'results', 'tasks', 'profile', 'divider'] as const;

export type Sidebar = typeof ALL_SIDEBAR_LINKS[number];

export function isSideBar(value: string): value is Sidebar {
  return ALL_SIDEBAR_LINKS.includes(value as Sidebar);
}

export type SidebarLinkItem = {
  type: 'link';
  id: Sidebar;
  display: string;
  route: string;
};

export type SidebarDividerItem = {
  type: 'divider';
  id: 'divider';
  display: string;
  route: null;
};

export type SidebarItem = SidebarLinkItem | SidebarDividerItem;
