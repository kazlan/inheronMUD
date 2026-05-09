# Auditoría de Código — InheronMUD Game Server
**Fecha:** 2026-05-09  
**Alcance:** `packages/engine`, `apps/api`, `apps/web` (puntos clave)  
**Objetivo:** Identificar inconsistencias con las especificaciones, deuda técnica, bugs latentes y oportunidades de refactorización.

---

## 1. Visión General de la Arquitectura Actual

```
                    apps/api
        ┌──────────────────────────────┐
        │  server.ts (Fastify + WS)    │
        │  session.ts (Auth + Routing) │
        └──────────┬───────────────────┘
                   │
        ┌──────────▼────────────────────────────────┐
        │          GameEngine (God Object, 696 LOC)  │
        │  ┌──────────────┐  ┌──────────────┐       │
        │  │CommandManager│  │ SkillManager │       │
        │  │  (1395 LOC)  │  │  (329 LOC)   │       │
        │  └──────────────┘  └──────────────┘       │
        │  ┌──────────────┐  ┌──────────────┐       │
        │  │CombatManager │  │EffectsManager│       │
        │  │  (187 LOC)   │  │  (179 LOC)   │       │
        │  └──────────────┘  └──────────────┘       │
        │  ┌──────────────┐  ┌──────────────┐       │
        │  │  AIManager   │  │RespawnManager│       │
        │  └──────────────┘  └──────────────┘       │
        │  ┌──────────────┐  ┌──────────────┐       │
        │  │EntityManager │  │StatCalculator│       │
        │  └──────────────┘  └──────────────┘       │
        │  ┌──────────────┐  ┌──────────────┐       │
        │  │ReactiveSkill │  │ WorldFactory │       │
        │  └──────────────┘  └──────────────┘       │
        └───────────────────────────────────────────┘
```

> **ADVERTENCIA:** `GameEngine` es un **God Object** de 696 líneas que concentra tick processing, combate, muerte, XP, loot, respawn de jugadores, armonías de bardo, y la gestión completa del ciclo de vida del combate. Esto viola el principio de responsabilidad única y dificulta las pruebas unitarias.

---

## 2. Problemas Críticos

### 2.1 CRÍTICO — Seguridad: Contraseñas en Texto Plano

```typescript
// session.ts:85
if (account?.password === password || !account?.password) {
```

- Las contraseñas se almacenan y comparan como texto plano.
- La condición `!account?.password` permite login sin contraseña si el campo está vacío.
- **Acción:** Implementar hashing con `bcrypt` o `argon2`. Migrar contraseñas existentes.

### 2.2 CRÍTICO — Inyección de Código: `evaluateFormula`

```typescript
// skill-manager.ts:326
try { return Math.floor(new Function(`return ${expression}`)()); } catch { return 0; }
```

- Usa `new Function()` para evaluar fórmulas de daño. Si un YAML malintencionado o corrupto inyecta JavaScript en el campo `damageFormula`, se ejecutará en el servidor.
- **Acción:** Reemplazar con un parser de expresiones matemáticas seguro (ej: `mathjs` modo sandbox, o un evaluador propio con AST).

### 2.3 CRÍTICO — Doble Procesamiento de Muerte

La muerte de jugadores se procesa **dos veces** en `game-engine.ts`:

| Ubicación | Líneas | Comportamiento |
|-----------|--------|----------------|
| Dentro del bucle de ronda | 119–178 | Aplica penalización de XP, mueve a plaza con 10% HP |
| Bloque `!combat.active` | 273–296 | Restaura HP al máximo y mueve a plaza de nuevo |

El segundo bloque se ejecuta cuando el combate termina (misma iteración del tick). Un jugador que muere podría ser procesado por ambos, resultando en estados inconsistentes.

### 2.4 ALTO — Fuga de Memoria: `activeCombats` nunca caduca

Los combates se crean con `new CombatManager(...)` y se guardan en un `Map`. Si un combate queda en estado `active: true` pero no tiene participantes (bug de desconexión, etc.), nunca se limpiará.

---

## 3. Inconsistencias con las Especificaciones del Bardo

### 3.1 Estrofa — Implementación vs. Diseño

| Especificación | Implementación actual |
|---|---|
| Máximo: **5** | Nunca se valida un máximo. Se incrementa sin tope. |
| Gana +1 al usar **familia distinta** a la anterior | Gana +1 siempre que el skill tenga `estrofa.gainFamily`, sin comprobar si la familia es diferente. |
| Baja -1 si se repite una misma familia **tres veces seguidas** | No implementado. `lastFamilyUsed` y `repeatedFamilyCount` existen en el modelo pero nunca se actualizan. |
| A Estrofa 3 se activa el **Estribillo** | No implementado. Solo se comprueba `>= 3` para activar Trama gratuita. |

### 3.2 Trama — Implementación vs. Diseño

| Especificación | Implementación actual |
|---|---|
| Límite de hilos activos (3/4/5 según nivel) | No existe concepto de "hilos". `tramaMax` se define en `BardState` pero nunca se consulta. |
| Efectos menores = 1 hilo, mayores = 2 | No implementado. Los efectos no tienen `threadWeight`. |
| Error por límite de Trama | No implementado. |

### 3.3 Sostener Compás — Implementación vs. Diseño

| Especificación | Implementación actual |
|---|---|
| Nivel de desbloqueo: 3 | No se valida nivel mínimo. |
| Coste: 6 Voz (menor) o 10 Voz (principal) | Usa el `energyCost` genérico del YAML (no diferencia modos). |
| Modos: congelar, prolongar, convertir a eco | Único modo: extender duración flat +15s a **todos** los efectos de **todos** los participantes. |
| Coste creciente sobre mismo efecto | No implementado. |
| Solo afecta efectos **bardos** | Afecta cualquier buff/debuff de cualquier origen. |

### 3.4 Ecos — No Implementados

La especificación define un sistema completo de "Ecos" (versiones residuales de efectos). El `EffectsManager` tiene lógica de `echoEffect` en el tick, pero:
- Ningún efecto del YAML actual define `echoOnExpire` o `echoEffect`.
- No hay UI para diferenciar ecos de efectos normales (excepto un check de nombre en `PulsePanel`).

### 3.5 Armonías — Parcialmente Implementadas

- ✅ **Armonía de Vanguardia:** Detectada y aplicada (evasión +10%).
- ✅ **Armonía de Ridículo:** Detectada, otorga Estrofa/Aplauso en fallo enemigo.
- ❌ **Armonía de Remiendo:** No implementada.
- ❌ **Armonía de Nombre:** No implementada.
- ⚠️ Las armonías se recalculan con `(p as any)._armoniaXActive`, almacenando estado como propiedades dinámicas no tipadas en los participantes del combate. Esto es frágil.

### 3.6 Aplauso — Parcialmente Implementado

| Especificación | Implementación actual |
|---|---|
| Se gana por: crítico aliado, fallo enemigo por debuff, objetivo grupal, testigos, etc. | Solo se gana por Armonía de Ridículo (fallo crítico del enemigo). |
| Máximo: 3 (nivel 1-9), 4 (nivel 10+), 5 (nivel 20+) | Se limita a `Math.min(4, ...)` hardcodeado. |
| Se consume para potenciar habilidades | No hay mecanismo de consumo implementado. |

---

## 4. Deuda Técnica y Olores de Código

### 4.1 `CommandManager` — Archivo Monolítico (1395 líneas)

Este archivo concentra **toda** la lógica de comandos del juego: look, move, open, interact, get, drop, equip, unequip, score, kill, talk, flee, heal, list, buy, sell, skills, cast, prompt, who, help, admin, y getFormattedCronica.

**Propuesta:** Descomponer en módulos por dominio:
- `commands/movement.ts` — look, move, open
- `commands/inventory.ts` — get, drop, equip, unequip
- `commands/combat.ts` — kill, flee, cast, heal, getPulso
- `commands/social.ts` — talk, say, tell, who
- `commands/economy.ts` — list, buy, sell
- `commands/info.ts` — score, skills, help, cronica, prompt

### 4.2 Tipado Débil: Abuso de `any`

| Archivo | Ocurrencias de `any` |
|---|---|
| `entity.model.ts` | `activeEffects: any[]`, `metadata: Record<string, any>` |
| `combat-manager.ts` | `(participant as any).hasFled`, `(p as any)._armoniaXActive` |
| `skill-manager.ts` | `(skill as any).damageFormula`, `(skill as any).estrofa`, etc. |
| `effects-manager.ts` | `entity: any`, `effect: any` |
| `game-engine.ts` | `(player as any).isDead` |

Casi toda la comunicación entre módulos se hace con `any`, lo que elimina la seguridad de tipos de TypeScript. Los efectos, skills y metadata carecen de interfaces definidas.

### 4.3 Duplicación de Lógica de Dirección

La tabla de alias de direcciones (norte/south/n/s/etc.) se repite **cuatro veces**:
1. `CommandManager.move()` — líneas 204-214
2. `CommandManager.move()` (opuestos) — líneas 244-251
3. `CommandManager.open()` (opuestos) — líneas 315-322
4. `Session.handleGameCommand()` — líneas 291-296

**Propuesta:** Extraer a `utils/directions.ts` con funciones: `normalizeDirection()`, `getOpposite()`, `translateToSpanish()`.

### 4.4 `console.log` en Código de Producción

El `CommandManager.look()` contiene múltiples `console.log` de debug (líneas 112, 153, 158, 162, 166). Estos deberían usar el sistema `EventLog` existente o eliminarse.

### 4.5 Quest Hardcodeada

El sistema de quests del Anciano Sabio está completamente hardcodeado:
- `getQuestIndicator()` compara `npcId === 'anciano_sabio'` directamente.
- La variable `lobos_muertos` se busca por nombre literal.
- No existe un sistema declarativo de quests. Cada nueva quest requerirá más `if/else`.

### 4.6 `bardState` No Persistido en DB

El campo `bardState` se incluye en el `player.toJSON()` pero **no se guarda en la tabla `Player` de Prisma**. La persistencia depende de que `metadata` lo contenga implícitamente (no lo hace — se almacena como campo separado en el modelo).

**Resultado:** El estado del bardo (Estrofa, Aplauso, Trama, freeSustainAvailable) se **pierde al reiniciar el servidor**.

### 4.7 `respawn-manager.ts` usa `require()` dinámico

```typescript
// respawn-manager.ts:90, 106
const itemClone = new (require('../models/item.model').Item)(...)
```

Esto rompe el tree-shaking, genera warnings en bundlers, y es innecesario dado que `Item` podría importarse estáticamente.

---

## 5. Problemas de Sincronización Motor-Cliente

### 5.1 Efecto Doble-Impresión

El `SkillManager.executeSkill()` devuelve el log como `message` en el `SkillResult`. Simultáneamente emite `combat_message` con log vacío `[]` al caster. Si `session.ts` imprime tanto el `RESPONSE.message` como el `COMBAT_UPDATE.combatLog`, el jugador no debería ver doble. Sin embargo, **otros jugadores en el combate** reciben el log completo vía `combat_message`, lo cual es correcto.

**Riesgo:** Si en el futuro se cambia la estrategia de emisión, el doble-print reaparecerá.

### 5.2 Timers de Efectos Desincronizados

Los efectos usan `Date.now()` como `startTime` en el servidor. El cliente calcula el tiempo restante con su propio `Date.now()`. Si los relojes difieren, las barras de progreso serán imprecisas. No hay mecanismo de sincronización de reloj.

### 5.3 Save Debounce de 5 Segundos

```typescript
// server.ts:173
}, 5000); // Debounce for 5 seconds
```

Si el servidor se cae dentro de los 5 segundos posteriores a un cambio crítico (subir de nivel, equipar item), el progreso se pierde. Considerar un flush inmediato para cambios de nivel/equipo y debounce solo para HP/energía.

---

## 6. Problemas Menores pero Acumulativos

| # | Problema | Archivo | Impacto |
|---|---|---|---|
| 1 | `combat.active` nunca se sincroniza al cambiar HP externamente | `game-engine.ts` | Un NPC podría morir por efecto de veneno sin que el combate lo detecte hasta la siguiente ronda |
| 2 | `heal()` siempre cura 20 HP, ignorando stats y nivel | `command-manager.ts:988` | Inútil en niveles altos |
| 3 | `flee()` tiene 75% de éxito (`> 0.75`) pero el comentario dice 75% | `command-manager.ts:960` | La probabilidad real de fallo es 25%, no 75%. La lógica está correcta, el comentario confunde. |
| 4 | Los NPC agresivos llaman a `commands.kill(targetPlayer.id, npc.name)` | `ai-manager.ts:238` | Esto ejecuta el flujo del *jugador* atacando al NPC, no del NPC atacando al jugador |
| 5 | `matchEntityName` no normaliza acentos | `command-manager.ts:68` | "pocíon" no coincide con "pocion" |
| 6 | Items comprados se crean con ID `originalId_timestamp` | `command-manager.ts:1056` | Si el jugador compra dos del mismo item en el mismo ms, tendrán el mismo ID |
| 7 | `Room.toJSON()` no incluye `scenery` ni `areaId` | `room.model.ts:36` | La UI no recibe datos de scenery desde el serializado |

---

## 7. Priorización de Refactorizaciones

### Urgente (Antes de más desarrollo)
1. **Hash de contraseñas** — Seguridad crítica
2. **Eliminar `new Function()`** — Inyección de código
3. **Persistir `bardState` en DB** — Pérdida de datos en cada reinicio
4. **Unificar procesamiento de muerte** — Bug activo

### Importante (Próxima iteración)
5. **Descomponer `CommandManager`** — Mantenibilidad
6. **Definir interfaces para Effect, Skill, CombatAction** — Reemplazar `any`
7. **Extraer lógica de combate de `GameEngine`** — SRP
8. **Extraer utilidades de dirección** — DRY
9. **Eliminar `require()` dinámico en RespawnManager**

### Deseable (Refactor continuo)
10. **Implementar Estrofa correctamente** (familia distinta, penalización por repetición)
11. **Implementar límite de Trama**
12. **Sistema de quests declarativo**
13. **Reemplazar `console.log` por EventLog**
14. **Sincronización de reloj servidor-cliente para efectos**
