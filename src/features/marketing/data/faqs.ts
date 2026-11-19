export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'what-is-resolyx',
    question: 'What is Resolyx?',
    answer:
      'Resolyx is an AI-powered helpdesk engineered for IT support and customer support teams. It brings ticket queues, company knowledge base indexing, and private AI assistance into a unified workspace, enabling organizations to resolve repetitive requests quickly while maintaining strict data governance.',
  },
  {
    id: 'how-private-ai-works',
    question: 'How does private AI work?',
    answer:
      'Instead of piping your confidential support tickets and documentation to third-party multi-tenant AI services, Resolyx is architected for private inference. The AI model runs on infrastructure you control—such as an on-premises GPU server, dedicated private cloud instance, or sovereign VPC—ensuring zero data transmission outside your security boundary.',
  },
  {
    id: 'does-it-send-to-public-apis',
    question: 'Does Resolyx send data to public AI APIs?',
    answer:
      'No. In its target private deployment mode, Resolyx does not send customer tickets, agent messages, or internal knowledge documents to public AI vendors. Your internal records remain entirely within your private perimeter, preventing unauthorized data mining or model retraining on your proprietary knowledge.',
  },
  {
    id: 'can-teams-use-without-ai',
    question: 'Can teams use Resolyx without AI?',
    answer:
      'Yes. Resolyx provides a full-featured ticketing system with queues, assignments, SLA priorities, tag workflows, and standard markdown knowledge bases. Teams can operate Resolyx purely as a classical helpdesk or selectively enable private AI capabilities on specific departments or queues as needed.',
  },
  {
    id: 'can-responses-be-reviewed',
    question: 'Can AI responses be reviewed before sending?',
    answer:
      'Yes, and by default human oversight is enforced. When Resolyx generates an AI response, it appears in a suggestion staging panel alongside cited knowledge sources. Human agents review, edit, or approve the draft with a single click before anything is transmitted to the requester.',
  },
  {
    id: 'it-and-customer-support',
    question: 'Does Resolyx support both IT and customer support?',
    answer:
      'Yes. Resolyx provides tailored workflows for both internal IT helpdesks (hardware provisioning, access management, VPN troubleshooting) and external customer helpdesks (product questions, bug reports, service triage), with role-based access control separating sensitive internal IT documentation from public support knowledge.',
  },
  {
    id: 'infrastructure-required',
    question: 'What infrastructure is required?',
    answer:
      'Resolyx frontend runs on modern standard web browsers. For backend deployment and private AI inference, the planned architecture supports containerized workloads (Docker / Kubernetes) capable of connecting to your choice of private LLM runtime (e.g., vLLM, Ollama, or self-hosted enterprise model servers) on either self-hosted hardware or dedicated cloud instances.',
  },
];
