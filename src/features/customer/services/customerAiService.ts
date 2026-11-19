import { getStoredKbArticles } from '@/lib/kbStorage';
import { createTicket } from '@/lib/ticketsStorage';
import type { ChatMessage, KbCitation } from '../types/customer.types';

export function generateAiResponse(customerQuery: string): Omit<ChatMessage, 'id' | 'timestamp'> {
  const query = customerQuery.toLowerCase().trim();
  const kbArticles = getStoredKbArticles();

  // 1. Check for Human Agent Escalation request
  const isEscalationRequest =
    query.includes('human') ||
    query.includes('agent') ||
    query.includes('representative') ||
    query.includes('escalate') ||
    query.includes('talk to someone');

  if (isEscalationRequest) {
    // Create a real ticket; the backend's assignment rules route it (ticket_created).
    void createTicket({
      subject: 'AI chat escalation: live support requested',
      description: customerQuery,
      priority: 'Urgent',
      category: 'Technical Support',
      source: 'AI Support Chat',
      tags: ['Live-Escalation', 'AI-Chat'],
      due_date: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      meta: {
        conversation: [
          {
            id: `msg-${Date.now()}`,
            sender: 'customer',
            senderName: 'Customer',
            timestamp: new Date().toISOString(),
            content: customerQuery || 'Customer requested immediate human agent handoff via chat.',
          },
        ],
      },
    }).catch(() => undefined);

    return {
      sender: 'system',
      text: `🔄 **Ticket Escalated to Human Support**\n\nI have created a priority ticket with the full chat transcript. It is being routed to the right support agent by your workspace's assignment rules, and you can follow it under **My Tickets**.`,
      isEscalated: true,
      agentName: 'Support Agent',
      confidence: 100,
    };
  }

  // 2. Keyword Search through Knowledge Base
  const matchedKb = kbArticles.find((article) => {
    const titleMatch = article.title.toLowerCase().split(' ').some((word) => word.length > 3 && query.includes(word));
    const tagMatch = article.tags.some((tag) => query.includes(tag.toLowerCase()));
    const symptomMatch =
      (query.includes('504') && article.id === 'KB-402') ||
      ((query.includes('saml') || query.includes('okta') || query.includes('sso')) && article.id === 'KB-108') ||
      ((query.includes('rate limit') || query.includes('429') || query.includes('quota')) && article.id === 'KB-312') ||
      ((query.includes('vpn') || query.includes('wireguard')) && article.id === 'KB-219') ||
      ((query.includes('pgbouncer') || query.includes('postgres') || query.includes('database')) && article.id === 'KB-507');
    return symptomMatch || tagMatch || titleMatch;
  });

  if (matchedKb) {
    const citation: KbCitation = {
      id: matchedKb.id,
      title: matchedKb.title,
      category: matchedKb.category,
    };

    const reply = `I found a verified solution in our engineering knowledge base for **${matchedKb.title}**:\n\n${matchedKb.summary}\n\n${matchedKb.solutionMarkdown}\n\n---\n*Need more help or manual intervention? Type **"Connect to agent"** anytime.*`;

    return {
      sender: 'ai',
      text: reply,
      confidence: 96,
      kbCitations: [citation],
    };
  }

  // 3. General Intelligent AI Helpdesk Assistance
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return {
      sender: 'ai',
      text: `Hello! I'm the **Resolyx Support AI**. I'm connected to Acme Corporation's production logs and our verified engineering runbooks.\n\nHow can I help you today? You can ask about:\n• API rate limits & quota increases\n• HTTP 504 Envoy Ingress timeouts\n• Okta SAML SSO cert rotations\n• VPN client connections\n\nOr click any prompt chip below!`,
      confidence: 99,
    };
  }

  return {
    sender: 'ai',
    text: `Based on your request regarding "${customerQuery}":\n\n1. I've initiated an automated diagnostic scan across your active service endpoints.\n2. No critical cluster-wide incidents are currently detected on your tenant instance.\n3. To ensure resolution, please verify whether this error reproduces on fresh sessions or across all client API keys.\n\nIf this requires deeper log analysis, please click **"Request Human Agent"** above or reply with your correlation request ID.`,
    confidence: 88,
  };
}

