import { Quest, StoryArc, QuestStatus } from '../interfaces/quest.interface';

export class CronicaViva {
  public playerId: string;
  public activeQuests: Map<string, Quest> = new Map();
  public completedQuests: string[] = [];
  public activeArcs: Map<string, StoryArc> = new Map();
  public memoryFlags: Set<string> = new Set();
  public variables: Map<string, string> = new Map();

  constructor(playerId: string) {
    this.playerId = playerId;
  }

  setVariable(key: string, value: string): void {
    this.variables.set(key, value);
  }

  getVariable(key: string): string {
    return this.variables.get(key) || '0';
  }

  addQuest(quest: Quest): void {
    this.activeQuests.set(quest.id, quest);
  }

  completeQuest(questId: string): void {
    const quest = this.activeQuests.get(questId);
    if (quest) {
      quest.status = QuestStatus.COMPLETED;
      this.completedQuests.push(questId);
      this.activeQuests.delete(questId);
      
      // Apply consequences (Memory Flags)
      if (quest.consequences?.flagsToAdd) {
        quest.consequences.flagsToAdd.forEach(flag => this.memoryFlags.add(flag));
      }
    }
  }

  hasFlag(flag: string): boolean {
    return this.memoryFlags.has(flag);
  }

  setFlag(flag: string): void {
    this.memoryFlags.add(flag);
  }

  removeFlag(flag: string): void {
    this.memoryFlags.delete(flag);
  }

  toJSON() {
    return {
      playerId: this.playerId,
      activeQuests: Array.from(this.activeQuests.values()),
      completedQuests: this.completedQuests,
      activeArcs: Array.from(this.activeArcs.values()),
      memoryFlags: Array.from(this.memoryFlags),
      variables: Object.fromEntries(this.variables)
    };
  }
}
