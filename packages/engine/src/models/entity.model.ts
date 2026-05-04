import { v4 as uuidv4 } from 'uuid';

export abstract class Entity {
  public readonly id: string;
  public name: string;
  public description: string;
  public metadata: Record<string, any> = {};
  public activeEffects: any[] = [];

  constructor(name: string, description: string = '', id?: string) {
    this.id = id || uuidv4();
    this.name = name;
    this.description = description;
  }

  /**
   * Serializes the entity to a plain object.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      metadata: this.metadata,
      activeEffects: this.activeEffects,
      type: this.constructor.name,
    };
  }
}
