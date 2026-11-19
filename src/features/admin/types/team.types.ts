export type RoutingStrategy =
  | 'Round-Robin'
  | 'Least Loaded'
  | 'Skill-Based'
  | 'Manual Broadcast';

export interface SupportTeam {
  id: string;
  /** Numeric id in the backend. */
  backendId?: number;
  name: string;
  description: string;
  leadName: string;
  leadEmail: string;
  leadUserId?: number | null;
  membersCount: number;
  activeTicketsCount: number;
  slaTargetHours: number;
  routingStrategy: RoutingStrategy;
  memberNames: string[];
  /** Backend user ids of the members. */
  memberIds?: number[];
  isActive?: boolean;
  createdAt: string;
}
