export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}
