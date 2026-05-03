export enum ActionType {
  ATTACK = 'ATTACK',
  SKILL = 'SKILL',
  DEFEND = 'DEFEND',
  ITEM = 'ITEM',
  MOVE = 'MOVE',
  FLEE = 'FLEE'
}

export interface ICombatAction {
  id: string;
  name: string;
  type: ActionType;
  actorId: string;
  targetId?: string;
  cost: {
    energy?: number;
    resource?: { name: string; value: number };
  };
  execute: (engine: any, combat: any) => ICombatResult;
}

export interface ICombatResult {
  success: boolean;
  damage?: number;
  effectApplied?: string;
  log: string;
  resourceChanges?: Record<string, number>;
}

export interface IStatusEffect {
  id: string;
  name: string;
  duration: number; // in rounds
  onRoundStart?: (participant: any) => void;
  onRoundEnd?: (participant: any) => void;
  modifiers?: Record<string, number>;
}
