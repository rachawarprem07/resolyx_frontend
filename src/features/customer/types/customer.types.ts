export type MessageSender = 'customer' | 'ai' | 'agent' | 'system';

export interface KbCitation {
  id: string;
  title: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  kbCitations?: KbCitation[];
  confidence?: number;
  isEscalated?: boolean;
  agentName?: string;
  feedback?: 'helpful' | 'unhelpful';
}

export type CustomerTicketStatus = 'Open' | 'Investigating' | 'Waiting on Customer' | 'Resolved';
export type CustomerTicketPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface CustomerTicket {
  id: string;
  title: string;
  status: CustomerTicketStatus;
  priority: CustomerTicketPriority;
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedAgent?: string;
  assignedTeam?: string;
  lastMessageSnippet: string;
  messagesCount: number;
}

