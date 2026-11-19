export interface HeroTicketItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  title: string;
  timeAgo: string;
  previewText?: string;
  isActive?: boolean;
}

export interface HeroAIResponse {
  agentTitle: string;
  badgeText: string;
  responseText: string;
  isAutoResolved: boolean;
  statusLabel: string;
}

export interface HeroMetricsData {
  resolutionRateGrowth: string;
  aiResolveRate: string;
}
