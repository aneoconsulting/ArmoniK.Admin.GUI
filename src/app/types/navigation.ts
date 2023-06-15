/**
 * Navigation types
 *
 * A sidebar is build using a list of SidebarItems.
 */


export type SidebarLinkName = 'profile' | 'dashboard' | 'applications' | 'sessions' | 'partitions' | 'results' | 'settings' ;
export type SidebarDivider = 'divider';

export type Sidebar = SidebarLinkName | SidebarDivider;

export type SidebarLinkItem = {
  type: 'link';
  id: string;
  display: string;
  icon: string;
  route: string;
};

export type SidebarDividerItem = {
  type: 'divider';
  id: 'divider';
  display: string;
  icon: null;
  route: null;
};

export type SidebarItem = SidebarLinkItem | SidebarDividerItem;
export type SidebarItems = SidebarItem[];
