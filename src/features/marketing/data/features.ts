import {
  Inbox,
  Sparkles,
  BookOpen,
  GitFork,
  ShieldCheck,
  BarChart3,
  LucideIcon,
} from 'lucide-react';

export interface ProductFeature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: string;
}

export const PRODUCT_FEATURES: ProductFeature[] = [
  {
    id: 'ticket-management',
    title: 'Intelligent Ticket Management',
    description:
      'Organize, assign, prioritize, and track support requests across IT and customer channels in one unified queue.',
    icon: Inbox,
    highlight: 'Unified omni-channel queue with live SLA trackers.',
  },
  {
    id: 'private-ai',
    title: 'Private AI Assistant',
    description:
      'Generate suggested responses grounded exclusively in approved company knowledge, running privately without external API leaks.',
    icon: Sparkles,
    badge: 'Private Inference',
    highlight: 'Strictly zero training on your internal tickets.',
  },
  {
    id: 'knowledge-base',
    title: 'Integrated Knowledge Base',
    description:
      'Turn technical manuals, policy documents, and past solutions into real-time searchable context for agents and automated workflows.',
    icon: BookOpen,
    highlight: 'Semantic retrieval with strict document permission filtering.',
  },
  {
    id: 'smart-routing',
    title: 'Smart Routing & Triage',
    description:
      'Automatically categorize incoming inquiries and recommend the appropriate team, tier, or agent based on ticket complexity.',
    icon: GitFork,
    highlight: 'Eliminate manual triage bottlenecks.',
  },
  {
    id: 'controlled-automation',
    title: 'Controlled Automation',
    description:
      'Automate routine troubleshooting and password instructions while keeping administrators in full control of sensitive workflows.',
    icon: ShieldCheck,
    badge: 'Human-in-the-Loop',
    highlight: 'Explicit policy bounds on all automated actions.',
  },
  {
    id: 'actionable-reporting',
    title: 'Actionable Reporting',
    description:
      'Monitor ticket volumes, median resolution times, backlog trends, and support workload with privacy-respecting metrics.',
    icon: BarChart3,
    highlight: 'Clear operational clarity without third-party trackers.',
  },
];

export const VALUE_PROPOSITIONS = [
  {
    id: 'resolve-repetitive',
    title: 'Resolve Repetitive Requests',
    description:
      'Free engineers and agents from answering the same VPN and setup questions dozens of times a week.',
    icon: Sparkles,
  },
  {
    id: 'find-answers',
    title: 'Find Answers in Company Knowledge',
    description:
      'Connect internal documentation and run local semantic search so solutions appear instantly beside every ticket.',
    icon: BookOpen,
  },
  {
    id: 'keep-humans-in-control',
    title: 'Keep Humans in Control',
    description:
      'AI drafts recommendations and assists your staff, but human agents review and approve every outgoing answer.',
    icon: ShieldCheck,
  },
  {
    id: 'keep-sensitive-private',
    title: 'Keep Sensitive Information Private',
    description:
      'Deploy on your own infrastructure or secure VPC. Confidential customer and employee data never leaves your perimeter.',
    icon: Inbox,
  },
];
