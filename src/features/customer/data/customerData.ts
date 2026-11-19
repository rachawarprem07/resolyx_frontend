import type { ChatMessage, CustomerTicket } from '../types/customer.types';

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'MSG-001',
    sender: 'ai',
    text: `👋 **Welcome to Resolyx AI Support!**\n\nI am your private AI Support Copilot. Ask me anything regarding your account, tickets, or service, or pick a prompt below to get instant answers.`,
    timestamp: 'Just now',
    confidence: 100,
  },
];

export const QUICK_PROMPTS = [
  'How do I create a support ticket?',
  'Check status of my active tickets',
  'Request account configuration assistance',
  'Connect to Human Support Agent',
];

export const MOCK_CUSTOMER_TICKETS: CustomerTicket[] = [];
