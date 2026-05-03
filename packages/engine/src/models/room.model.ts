import { Entity } from './entity.model';

export interface Exit {
  direction: string;
  targetRoomId: string;
  description?: string;
  hidden?: boolean;
  locked?: boolean;
}

export class Room extends Entity {
  public exits: Exit[] = [];
  public entities: string[] = []; // IDs of NPCs and Items in the room

  constructor(name: string, description: string = '', id?: string) {
    super(name, description, id);
  }

  addExit(exit: Exit): void {
    this.exits.push(exit);
  }

  addEntity(entityId: string): void {
    if (!this.entities.includes(entityId)) {
      this.entities.push(entityId);
    }
  }

  removeEntity(entityId: string): void {
    this.entities = this.entities.filter(id => id !== entityId);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      exits: this.exits,
      entities: this.entities,
    };
  }
}
