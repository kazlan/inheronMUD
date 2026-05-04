import { GameEngine } from '../core/game-engine';
import { WorldFactory } from '../core/world-factory';
import { Player } from '../models/player.model';
import { StatCalculator } from '../core/stat-calculator';
import { CombatManager, CombatParticipant } from '../core/combat-manager';
import { Item, ItemType } from '../models/item.model';

/**
 * InheronMUD Progression Simulator
 * Simulates thousands of play sessions at high speed to analyze balance.
 */
class ProgressionSimulator {
  private engine: GameEngine;
  private stats = {
    totalSessions: 0,
    deaths: 0,
    totalLevelsGained: 0,
    totalCombats: 0,
    lootFound: 0,
    levelDistribution: {} as Record<number, number>,
    causeOfDeath: {} as Record<string, number>,
  };

  constructor() {
    this.engine = new GameEngine();
    WorldFactory.populate(this.engine);
  }

  public run(iterations: number = 1000) {
    console.log(`\n🚀 Iniciando simulación de ${iterations} sesiones...`);
    const startTime = Date.now();

    for (let i = 0; i < iterations; i++) {
      this.simulateSession();
    }

    const duration = Date.now() - startTime;
    this.report(duration);
  }

  private simulateSession() {
    this.stats.totalSessions++;

    // Create a random player
    const classes = this.engine.classesData;
    const races = this.engine.racesData;
    
    if (!classes.length || !races.length) {
      console.error("Faltan datos de clases o razas para la simulación.");
      return;
    }

    const cls = classes[Math.floor(Math.random() * classes.length)];
    const race = races[Math.floor(Math.random() * races.length)];

    const baseStats = {
      fuerza: 5 + (cls.baseStats?.fuerza || 0) + (race.baseStats?.fuerza || 0),
      destreza: 5 + (cls.baseStats?.destreza || 0) + (race.baseStats?.destreza || 0),
      constitucion: 5 + (cls.baseStats?.constitucion || 0) + (race.baseStats?.constitucion || 0),
      ingenio: 5 + (cls.baseStats?.ingenio || 0) + (race.baseStats?.ingenio || 0),
      sabiduria: 5 + (cls.baseStats?.sabiduria || 0) + (race.baseStats?.sabiduria || 0),
      presencia: 5 + (cls.baseStats?.presencia || 0) + (race.baseStats?.presencia || 0),
      percepcion: 5 + (cls.baseStats?.percepcion || 0) + (race.baseStats?.percepcion || 0),
    };

    const player = new Player(`sim_${this.stats.totalSessions}`, 'SimPlayer', baseStats, cls.id, race.id, 'start');
    player.hpCurrent = StatCalculator.calculate(player).hpMax;

    // Simulation loop: Combat until Level 10 or Death
    let limit = 0;
    while (player.level < 10 && limit < 1000) {
      const success = this.simulateAdventure(player);
      if (!success) {
        this.stats.deaths++;
        break;
      }
      limit++;
    }

    this.stats.totalLevelsGained += (player.level - 1);
    this.stats.levelDistribution[player.level] = (this.stats.levelDistribution[player.level] || 0) + 1;
  }

  private simulateAdventure(player: Player): boolean {
    // Find a suitable mob (approx level)
    const mobs = Array.from(this.engine.entities.npcs.values()).filter(n => (n as any).isMob || n.behaviorId.includes('hostile'));
    if (mobs.length === 0) return true; // Should not happen

    const targetMob = mobs[Math.floor(Math.random() * mobs.length)];
    
    // Build equipment object for combat participant
    const eq: Record<string, any> = {};
    for (const [slot, itemId] of Object.entries(player.equipment)) {
      const item = this.engine.entities.getItem(itemId);
      if (item) eq[slot] = item.toJSON();
    }

    // Simulate Combat
    const playerDerived = StatCalculator.calculate(player);
    const participants: CombatParticipant[] = [
      {
        entityId: player.id,
        name: player.name,
        isPlayer: true,
        iniciativa: playerDerived.iniciativa,
        hpMax: playerDerived.hpMax,
        hpCurrent: player.hpCurrent!,
        energyMax: playerDerived.energyMax,
        energyCurrent: playerDerived.energyMax,
        resources: {},
        equipment: eq
      },
      {
        entityId: targetMob.id,
        name: targetMob.name,
        isPlayer: false,
        iniciativa: targetMob.stats.destreza + targetMob.stats.percepcion,
        hpMax: 20 + (targetMob.level * 10),
        hpCurrent: 20 + (targetMob.level * 10),
        energyMax: 20,
        energyCurrent: 20,
        resources: {}
      }
    ];

    const combat = new CombatManager(participants);
    this.stats.totalCombats++;

    // Fast Combat Loop
    let rounds = 0;
    while (combat.active && rounds < 100) {
      combat.processRound();
      rounds++;
    }

    // Check result
    const pPart = participants.find(p => p.isPlayer);
    if (!pPart || pPart.hpCurrent <= 0) {
      this.stats.causeOfDeath[targetMob.name] = (this.stats.causeOfDeath[targetMob.name] || 0) + 1;
      return false;
    }

    // Victory! Sync HP
    player.hpCurrent = pPart.hpCurrent;
    
    // Gain XP
    player.addExperience(25 + (targetMob.level * 5));

    // Simple Loot Chance (10%)
    if (Math.random() < 0.1) {
      this.stats.lootFound++;
      // Simulate finding a basic weapon upgrade
      if (!player.equipment['weapon']) {
          const weapon = new Item('Espada de Simulación', '', ItemType.EQUIPMENT, 'sim_sword_' + Date.now());
          weapon.equipSlot = 'weapon';
          weapon.metadata = { damage: 2 };
          this.engine.registerItem(weapon);
          player.equipment['weapon'] = weapon.id;
      }
    }

    // Regeneration between combats (20% HP)
    const maxHp = StatCalculator.calculate(player).hpMax;
    player.hpCurrent = Math.min(player.hpCurrent + (maxHp * 0.2), maxHp);

    return true;
  }

  private report(duration: number) {
    const survivalRate = ((this.stats.totalSessions - this.stats.deaths) / this.stats.totalSessions * 100).toFixed(1);
    console.log(`\n--- RESULTADOS DE SIMULACIÓN ---`);
    console.log(`Tiempo total: ${duration}ms (${(duration / 1000).toFixed(2)}s)`);
    console.log(`Sesiones simuladas: ${this.stats.totalSessions}`);
    console.log(`Tasa de Supervivencia (Nivel 10): ${survivalRate}%`);
    console.log(`Combates totales: ${this.stats.totalCombats}`);
    console.log(`Loot hallado: ${this.stats.lootFound}`);
    console.log(`Nivel promedio alcanzado: ${(1 + this.stats.totalLevelsGained / this.stats.totalSessions).toFixed(2)}`);

    console.log(`\nDistribución de Niveles Finales:`);
    Object.entries(this.stats.levelDistribution)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .forEach(([lvl, count]) => {
        const percent = (Number(count) / this.stats.totalSessions * 100).toFixed(1);
        console.log(` Nivel ${lvl}: ${count} (${percent}%)`);
      });

    console.log(`\nMayores Peligros (Causas de Muerte):`);
    Object.entries(this.stats.causeOfDeath)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([mob, count]) => {
        console.log(` - ${mob}: ${count} bajas`);
      });
  }
}

// Execute
const sim = new ProgressionSimulator();
sim.run(1000);
