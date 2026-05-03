export enum QuestStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  ACTIVE = 'ACTIVE',
  READY_TO_TURN_IN = 'READY_TO_TURN_IN',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'TALK' | 'KILL' | 'COLLECT' | 'EXPLORE' | 'INTERACT';
  targetId: string;
  requiredAmount: number;
  currentAmount: number;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  rewards: {
    experience?: number;
    currency?: number;
    items?: string[];
    reputation?: Record<string, number>;
  };
  consequences?: {
    flagsToAdd?: string[];
    flagsToRemove?: string[];
  };
}

export interface StoryArc {
  id: string;
  title: string;
  description: string;
  questIds: string[];
  currentQuestIndex: number;
  completed: boolean;
}
