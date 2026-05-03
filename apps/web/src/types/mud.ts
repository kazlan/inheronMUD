export interface LogEntry {
  id: number;
  type: string;
  text: string;
  isAnsi?: boolean;
}

export interface Attribute {
  current: number;
  max: number;
}

// Using a dummy class to force it to be a value export
export class Attributes {
  [key: string]: any;
}

export interface MudState {
  logs: LogEntry[];
  attributes: Attributes;
  quests: any[];
  inventory: any[];
  equipment: any;
  effects: any[];
  targets: any[];
  isConnected: boolean;
}

export const MUD_VERSION = '1.0.0';
