export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  customLogoUrl: string | null;
  setCustomLogoUrl: (url: string | null) => void;
}

export type TicketStatus = 'new' | 'investigating' | 'suggested' | 'resolved';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: {
    name: string;
    role: 'customer' | 'agent' | 'ai';
    avatarUrl?: string;
  };
  content: string;
  timestamp: string;
  isAiSuggestion?: boolean;
}

export interface TicketPreviewData {
  id: string;
  title: string;
  category: 'IT Helpdesk' | 'Customer Helpdesk';
  status: TicketStatus;
  priority: TicketPriority;
  requester: string;
  department: string;
  messages: TicketMessage[];
  suggestedAction?: {
    type: 'reply' | 'resolve' | 'escalate';
    confidence: number;
    sources: string[];
    suggestedText: string;
  };
}
