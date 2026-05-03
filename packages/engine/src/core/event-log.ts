import { IEvent, IEventLog } from '../interfaces/event.interface';
import { v4 as uuidv4 } from 'uuid';

export class EventLog implements IEventLog {
  private events: IEvent[] = [];

  log(eventData: Omit<IEvent, 'id' | 'timestamp'>): IEvent {
    const event: IEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      ...eventData,
    };
    
    this.events.push(event);
    
    // In a real scenario, this would also output to a file or a logging service
    // For now, we keep it in memory for the engine's trace
    return event;
  }

  getEvents(filter?: Partial<IEvent>): IEvent[] {
    if (!filter) return [...this.events];
    
    return this.events.filter(event => {
      for (const key in filter) {
        if ((event as any)[key] !== (filter as any)[key]) {
          return false;
        }
      }
      return true;
    });
  }

  clear(): void {
    this.events = [];
  }
}
