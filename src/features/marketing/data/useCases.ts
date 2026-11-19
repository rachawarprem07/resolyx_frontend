import { Monitor, Users } from 'lucide-react';

export interface HelpdeskUseCase {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof Monitor;
  examples: {
    title: string;
    description: string;
    tag: string;
  }[];
  keyBenefits: string[];
}

export const USE_CASES: HelpdeskUseCase[] = [
  {
    id: 'it-helpdesk',
    badge: 'Internal Operations',
    title: 'IT Helpdesk',
    description:
      'Help employees get technical support while reducing repetitive work for IT teams.',
    icon: Monitor,
    examples: [
      {
        title: 'VPN not connecting',
        description: 'Diagnoses client cert issues and provides OS-specific setup guidance.',
        tag: 'Network & Access',
      },
      {
        title: 'Software installation',
        description: 'Verifies software whitelist policy and provides self-service download steps.',
        tag: 'Workstation',
      },
      {
        title: 'Password reset',
        description: 'Guides staff through secure self-service MFA reset procedures.',
        tag: 'Identity & Auth',
      },
      {
        title: 'Access request',
        description: 'Routes hardware or repository access tickets to appropriate department lead.',
        tag: 'Governance',
      },
    ],
    keyBenefits: [
      'Reduces median time-to-first-response for internal staff',
      'Keeps corporate security credentials and network logs strictly inside your firewall',
      'Integrates with internal runbooks and employee IT knowledge bases',
    ],
  },
  {
    id: 'customer-helpdesk',
    badge: 'Customer Facing',
    title: 'Customer Helpdesk',
    description:
      'Help support teams deliver consistent responses and manage customer requests from one workspace.',
    icon: Users,
    examples: [
      {
        title: 'Product questions',
        description: 'Retrieves verified product specs and compatibility notes in seconds.',
        tag: 'Inquiry',
      },
      {
        title: 'Service issues',
        description:
          'Correlates customer incidents with active system status and maintenance notes.',
        tag: 'Incident',
      },
      {
        title: 'Troubleshooting',
        description: 'Steps customers through systematic diagnostics with verified guide links.',
        tag: 'Technical Support',
      },
      {
        title: 'Customer complaints',
        description:
          'Highlights priority SLA urgency and prepares empathetic, policy-aligned responses.',
        tag: 'Escalation',
      },
    ],
    keyBenefits: [
      'Ensures uniform, tone-consistent responses across tier-1 and tier-2 teams',
      'Eliminates the risk of exposing sensitive proprietary data to third-party AI APIs',
      'Empowers agents to draft and approve high-context resolutions with one click',
    ],
  },
];
