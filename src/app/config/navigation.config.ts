import type { NavItem, NavSection } from '@/types/navigation';

export const HEADER_NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
];

export const FOOTER_NAV_SECTIONS: NavSection[] = [
  {
    title: 'Product',
    items: [
      { label: 'Intelligent Ticketing', href: '#features' },
      { label: 'Private AI Assistant', href: '#features' },
      { label: 'Knowledge Base', href: '#features' },
      { label: 'Smart Routing', href: '#features' },
      { label: 'Audit & Reporting', href: '#features' },
    ],
  },
  {
    title: 'Solutions',
    items: [
      { label: 'IT Helpdesk', href: '#use-cases' },
      { label: 'Customer Helpdesk', href: '#use-cases' },
      { label: 'Internal Operations', href: '#use-cases' },
      { label: 'Knowledge Ingestion', href: '#how-it-works' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { label: 'Private Inference', href: '#privacy' },
      { label: 'Knowledge Access Controls', href: '#privacy' },
      { label: 'Human-in-the-Loop', href: '#privacy' },
      { label: 'Self-Hosted Readiness', href: '#privacy' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Documentation', href: '/placeholder?feature=Documentation' },
      { label: 'Architecture Guide', href: '/placeholder?feature=Architecture%20Guide' },
      { label: 'API Reference', href: '/placeholder?feature=API%20Reference' },
      { label: 'Release Notes', href: '/placeholder?feature=Release%20Notes' },
    ],
  },
];
