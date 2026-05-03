# InheronMUD Refinement Scratchpad

## 1. Visual Polish: Experience & Level Up
- **Issue**: The dark blue ANSI color (`<blue>`) for experience gain and level up messages is hard to read on dark backgrounds and "horrible" according to user feedback.
- **Action**: Change `<blue>` to `<yellow>` or `<cyan>` in `ranvier-test/bundles/bundle-example-player-events/player-events.js`.

## 2. Loot System Implementation
- **Issue**: NPCs have `lootable` behavior in YAML, but the behavior is not implemented in the JS code. No loot drops on death.
- **Action**: 
    - Create `ranvier-test/bundles/bundle-example-combat/behaviors/npc/lootable.js`.
    - Implement logic to listen for `killed` event and drop items from `metadata.loot` or `metadata.lootTable`.
    - Create loot for Aethelgard mobs in `loot-pools.yml`.

## 3. UI: Context Panel Persistence
- **Issue**: The Detail Panel (Context Panel) stays open after a mob is killed, even though the mob is gone from the room.
- **Action**: 
    - Verify `App.tsx` useEffect dependencies.
    - Ensure `room` data in `useMUD.ts` is updated immediately when an NPC is removed.
    - Check if `npcRemoved` event in the server correctly triggers a `room` update to the client.

## 4. Combat Mechanics & Balance
- **Damage Formula**: Currently `(WeaponDamage + Strength) / 3.5 * Speed`.
    - *Observation*: A level 2 character hitting for 25 damage is too much for early game mobs (who have ~20-40 HP).
    - *Action*: Rebalance the divisor or add level-based mitigation.
- **Accuracy (Hit/Miss)**:
    - *Issue*: Hits are currently 100% guaranteed.
    - *Action*: Implement an accuracy check in `Combat.makeAttack`. Use `dexterity` vs `agility` (or similar attributes).
- **Weapon Skills**:
    - *Observation*: No weapon-specific skills/proficiencies exist.
    - *Action*: Plan a simple weapon skill system (e.g., `sword`, `axe`, `mace`) that increases hit chance or damage.

## 5. Metadata Safety
- **Issue**: Previous crashes were caused by missing metadata objects before `setMeta`.
- **Action**: Ensure all scripts use the `initMeta` pattern or check existence before `setMeta`.
