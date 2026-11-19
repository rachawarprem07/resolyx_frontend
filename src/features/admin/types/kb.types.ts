export type KbAttachmentType = 'audio' | 'video' | 'image' | 'doc' | 'archive' | 'file';

export interface KbAttachment {
  id: string;
  name: string;
  type: KbAttachmentType;
  url: string;
  size?: string;
  mimeType?: string;
}

export interface KbCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt?: string;
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
