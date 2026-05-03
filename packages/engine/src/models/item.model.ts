import { Entity } from './entity.model';

export enum ItemType {
  EQUIPMENT = 'EQUIPMENT',
  CONSUMABLE = 'CONSUMABLE',
  QUEST = 'QUEST',
  CURRENCY = 'CURRENCY',
  TRASH = 'TRASH',
}

export class Item extends Entity {
  public type: ItemType;
  public weight: number = 0;
  public value: number = 0;
  public equipSlot?: string;
  public metadata: Record<string, any> = {};

  constructor(
    name: string,
    description: string,
    type: ItemType,
    id?: string
  ) {
    super(name, description, id);
    this.type = type;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      type: this.type,
      weight: this.weight,
      value: this.value,
      equipSlot: this.equipSlot,
      metadata: this.metadata,
    };
  }
}
