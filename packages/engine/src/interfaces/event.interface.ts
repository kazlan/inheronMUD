export interface IEvent {
  id: string;
  timestamp: number;
  type: string;
  actorId?: string;
  targetId?: string;
  roomId?: string;
  data: Record<string, any>;
  metadata?: {
    request_id?: string;
    command_id?: string;
    duration_ms?: number;
  };
}

export interface IEventLog {
  log(event: Omit<IEvent, 'id' | 'timestamp'>): IEvent;
  getEvents(filter?: Partial<IEvent>): IEvent[];
}
