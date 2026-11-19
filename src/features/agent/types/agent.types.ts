export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Investigating' | 'Suggested' | 'Resolved' | 'Escalated' | 'Open';

export interface TicketMessage {
  id: string;
  sender: 'customer' | 'agent' | 'ai';
  senderName: string;
  senderRole?: string;
  timestamp: string;
  content: string;
  isInternal?: boolean;
}

export interface AiSuggestedResolution {
  summary: string;
  confidenceScore: number;
  draftReply: string;
  knowledgeBaseSource: string;
  kbUrl?: string;
  matchedKeywords: string[];
}

export interface AgentTicket {
  id: string;
  title: string;
  customerName: string;
  customerEmail: string;
  company: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  slaDeadline: string;
  slaMinutesRemaining: number;
  createdAt: string;
  assignedAgent: string;
  /** Backend user id of the assigned agent (tickets synced from the API). */
  assignedAgentId?: number | null;
  assignedTeam?: string;
  assignedTeamId?: string;
  /** 'manual' | 'rule' when assigned through the backend. */
  assignmentSource?: string | null;
  /** Numeric backend id (the display `id` is the ticket number). */
  backendId?: number;
  description?: string;
  customerTier?: string;
  channel?: string;
  conversation: TicketMessage[];
  aiSuggestion?: AiSuggestedResolution;
  tags: string[];
  csatRating?: number;
  feedbackComment?: string;
}

export interface AgentQueueStats {
  assignedToMe: number;
  breachingSoon: number;
  resolvedToday: number;
  avgResponseMinutes: number;
  csatScore: number;
}

export type KbAttachmentType = 'audio' | 'video' | 'image' | 'doc' | 'archive' | 'file';

export interface KbAttachment {
  id: string;
  name: string;
  type: KbAttachmentType;
  url: string;
  size?: string;
  mimeType?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  solutionMarkdown: string;
  tags: string[];
  author?: string;
  updatedAt?: string;
  viewsCount?: number;
  helpfulCount?: number;
  isAiIndexed?: boolean;
  attachments?: KbAttachment[];
  visibility?: 'all' | 'internal' | 'customer';
  targetRoles?: ('admin' | 'agent' | 'customer')[];
}

