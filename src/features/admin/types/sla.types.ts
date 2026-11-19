export type SlaPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface SlaPolicy {
  id: string;
  name: string;
  description: string;
  priority: SlaPriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
  businessHoursOnly: boolean;
  isDefault?: boolean;
  isActive: boolean;
  createdAt: string;
}

