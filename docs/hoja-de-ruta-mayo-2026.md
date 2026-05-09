# Hoja de Ruta de Desarrollo — InheronMUD
**Periodo:** 9 – 18 de Mayo 2026  
**Prioridad:** Estabilización > Refactor > Nuevas features  
**Contexto:** Basada en la auditoría de código del 2026-05-09 y los documentos de diseño existentes.

---

## Principio Rector

> Antes de construir la casa, asegurar los cimientos. Cada día debe dejar el servidor más robusto, más tipado y más cercano a la especificación. Las features nuevas solo se añaden sobre código estable.

---

## Fase 0 — Seguridad y Bugs Críticos (Día 1)

### Objetivo
Cerrar las vulnerabilidades activas y los bugs que corrompen datos.

### Tareas

| # | Tarea | Archivo(s) | Estimación |
|---|---|---|---|
| 0.1 | **Hashear contraseñas** con `bcrypt`. Migrar las existentes con un script. | `session.ts`, `database.ts`, nuevo `scripts/migrate-passwords.ts` | 2h |
| 0.2 | **Eliminar `new Function()`** en `evaluateFormula`. Implementar un parser seguro de expresiones aritméticas (soportando `NdM`, `+`, `-`, `*`, `/`, `floor()` y variables de stats). | `skill-manager.ts` | 2h |
| 0.3 | **Persistir `bardState`** en la DB. Añadir columna `bardState TEXT` a la tabla Player (o guardarlo dentro de `metadata`). Asegurar que `Database.savePlayer` y `Database.loadPlayer` lo serialicen. | `database.ts`, `session.ts` | 1h |
| 0.4 | **Unificar procesamiento de muerte** en `game-engine.ts`. Mover toda la lógica de death a un único método `handlePlayerDeath(playerId)` invocado una sola vez. | `game-engine.ts` | 1.5h |
| 0.5 | **Caducidad de combates huérfanos.** Añadir al tick un barrido que elimine combates donde `active === true` pero no hay participantes vivos, o donde han pasado más de 5 minutos sin actividad. | `game-engine.ts` | 1h |

**Entregable:** Servidor seguro, sin pérdida de datos de bardo, sin bugs de muerte doble.

---

## Fase 1 — Tipado y Modelos (Días 2-3)

### Objetivo
Reemplazar el uso de `any` por interfaces tipadas. Esto previene regresiones y documenta el contrato entre módulos.

### Tareas

| # | Tarea | Detalle |
|---|---|---|
| 1.1 | **Definir `ActiveEffect` interface** | `id`, `name`, `type: 'buff' | 'debuff' | 'damage' | 'heal'`, `duration`, `startTime`, `tickInterval?`, `magnitude?`, `sourceSkillId?`, `threadWeight?`, `echoOnExpire?`, `echoEffect?`, `isEcho?`, `aoe?`, etc. |
| 1.2 | **Definir `SkillData` interface** (los datos del YAML) | Separar de `SkillDef` (que incluye el `execute`). `damageFormula`, `estrofa`, `repercussion`, `onHit`, `attributes` como campos tipados. |
| 1.3 | **Definir `CombatAction` interface** | Lo que ocurre en una ronda: `actorId`, `targetId`, `type`, `damage`, `isEvaded`, `isCrit`, etc. |
| 1.4 | **Tipar `Entity.metadata`** | Crear sub-interfaces: `PlayerMetadata`, `NPCMetadata`, `ItemMetadata` con campos conocidos. |
| 1.5 | **Tipar `Room.scenery`** | `Record<string, SceneryEntry>` donde `SceneryEntry = string | { description: string; interactions?: ... }`. |
| 1.6 | **Tipar `CombatParticipant`** | Eliminar `(participant as any).hasFled`, `(p as any)._armoniaXActive`. Añadir campos opcionales al interface. |
| 1.7 | **Actualizar `Room.toJSON()`** | Incluir `scenery`, `areaId` en la serialización. |

**Entregable:** Todas las interfaces en `models/interfaces/`, importadas por los managers. Zero `as any` en paths críticos.

---

## Fase 2 — Refactor Estructural (Días 3-4)

### Objetivo
Descomponer los God Objects sin cambiar funcionalidad.

### Tareas

| # | Tarea | De | A |
|---|---|---|---|
| 2.1 | **Descomponer `CommandManager`** | 1 archivo, 1395 LOC | 6 módulos: `commands/{movement,inventory,combat,social,economy,info}.ts` + un `CommandRouter` central |
| 2.2 | **Extraer utilidades de dirección** | 4 copias en 3 archivos | `utils/directions.ts` con `normalize()`, `opposite()`, `toSpanish()` |
| 2.3 | **Extraer lógica de combate de `GameEngine`** | `game-engine.ts` (combat tick, rondas, muerte, XP, loot) | `core/combat-lifecycle.ts` (o expandir `CombatManager`) |
| 2.4 | **Corregir `RespawnManager`** | `require()` dinámico | Import estático de `Item` |
| 2.5 | **Eliminar `console.log` de debug** | `command-manager.ts` (look) | Usar `EventLog` o eliminar |

**Entregable:** Misma funcionalidad, archivos manejables, imports limpios.

---

## Fase 3 — Bardo: Alinear con Especificación (Días 5-6)

### Objetivo
Implementar correctamente Estrofa, Trama y Sostener Compás según el documento de diseño del Bardo.

### Tareas

| # | Tarea | Impacto |
|---|---|---|
| 3.1 | **Estrofa correcta**: Trackear `lastFamilyUsed`. Solo incrementar si la familia del skill es distinta. Decrementar si se repite 3x seguidas. Cap a 5. | Balance de combate del bardo |
| 3.2 | **Estribillo a Estrofa 3**: Activar bonificaciones de habilidades que tengan `estribilloBonus` cuando `estrofa >= 3`. | Profundidad de combate |
| 3.3 | **Límite de Trama**: Implementar conteo de hilos activos (`threadWeight` en los efectos). Bloquear aplicación de nuevos efectos bardos si se excede el máximo según nivel. | Decisiones tácticas |
| 3.4 | **Sostener Compás correcto**: Coste creciente, selección de efecto objetivo (no global), solo efectos bardos. | Consistencia con diseño |
| 3.5 | **Fuentes de Aplauso**: Otorgar aplauso por: crítico aliado, fallo de enemigo afectado por debuff bardo, completar objetivo grupal. Respetar máximo por nivel. | Recurso heroico funcional |
| 3.6 | **Consumo de Aplauso**: Implementar al menos 1 habilidad que consuma Aplauso (ej: potenciar la siguiente habilidad). | Ciclo de gameplay completo |

**Entregable:** Bardo jugable según spec nivel 1-5. Estrofa, Trama y Aplauso funcionan según diseño.

---

## Fase 4 — Sistema de Quests Declarativo (Días 7-8)

### Objetivo
Reemplazar la lógica hardcodeada del Anciano Sabio con un sistema data-driven.

### Tareas

| # | Tarea | Detalle |
|---|---|---|
| 4.1 | **Definir formato YAML para quests** | `data/system/quests.yml` con estructura: `id`, `title`, `giver`, `stages[]`, `conditions`, `rewards`, `onComplete`. |
| 4.2 | **Implementar `QuestManager`** | Motor que carga quests del YAML, verifica condiciones (flags, kills, items), avanza stages, otorga rewards. |
| 4.3 | **Conectar triggers** | Al matar NPC (`onKill`), al hablar con NPC (`onTalk`), al entrar en sala (`onEnter`), al recoger item (`onPickup`). |
| 4.4 | **Refactorizar `getQuestIndicator`** | De `if (npcId === 'anciano_sabio')` a consulta al `QuestManager`. |
| 4.5 | **Migrar quest de lobos** | Convertir la quest hardcodeada del Anciano Sabio a formato YAML como caso de prueba. |
| 4.6 | **UI de Crónica** | Asegurar que `getFormattedCronica` lea datos del `QuestManager` en lugar de la estructura ad-hoc actual. |

**Entregable:** Quest del Anciano Sabio funcionando vía YAML. Framework listo para añadir más quests sin código nuevo.

---

## Fase 5 — Contenido y Polish (Días 9-10)

### Objetivo
Con la base estable, añadir contenido y pulir la experiencia del jugador.

### Tareas

| # | Tarea | Detalle |
|---|---|---|
| 5.1 | **Sistema de regeneración fuera de combate** | Regen gradual de HP y Energía/Voz basado en stats cuando no estás en combate. Reemplazar el `heal()` fijo de 20HP. |
| 5.2 | **Save inteligente** | Flush inmediato para cambios críticos (nivel, equipo, quest). Debounce 5s para HP/energía. |
| 5.3 | **Sincronización de reloj** | Enviar `serverTime` en cada mensaje `COMBAT_UPDATE` para que el cliente calcule offsets. |
| 5.4 | **Normalización de nombres** | Añadir normalización de acentos a `matchEntityName` para que "poción" coincida con "pocion". |
| 5.5 | **Contenido: 2ª zona completa** | Verificar que Colinas de los Conejos Acorazados tiene suficientes salas, NPCs, items y spawners para 30min de gameplay. |
| 5.6 | **Tests E2E básicos** | Script que conecta vía WebSocket, crea personaje, se mueve, mata un conejo, recoge loot, equipa item, y verifica resultados. |

---

## Visión Semanal

```
Día 1 (Hoy)     ████████████████  Fase 0: Seguridad y bugs críticos
Día 2-3         ████████████████  Fase 1: Tipado + Interfaces
Día 3-4         ████████████████  Fase 2: Refactor estructural
Día 5-6         ████████████████  Fase 3: Bardo según spec
Día 7-8         ████████████████  Fase 4: Sistema de quests
Día 9-10        ████████████████  Fase 5: Contenido y polish
```

---

## Criterios de "Listo" por Fase

| Fase | Criterio |
|---|---|
| 0 | Zero vulnerabilidades conocidas. `bardState` sobrevive reinicio. Muerte procesada 1 sola vez. |
| 1 | `grep -r "as any" packages/engine/src/core` retorna < 5 hits (solo en puntos necesarios como JSON parsing). |
| 2 | Ningún archivo > 400 LOC. Ninguna función > 80 LOC. |
| 3 | Un bardo puede: ganar Estrofa alternando familias, perder Estrofa repitiendo, activar Estribillo, alcanzar el límite de Trama y recibir error, usar Sostener Compás con coste correcto. |
| 4 | La quest de lobos funciona sin ningún `if (npcId === ...)` en el código. |
| 5 | Un tester puede jugar 1 hora sin bugs visibles. Save persiste todo el estado. |

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Refactor rompe funcionalidad existente | Alta | Alto | Hacer refactors uno a uno con test manual después de cada paso |
| Migración de BD borra datos | Media | Crítico | Backup de `dev.db` antes de cualquier migración de schema |
| El tipado fuerte revela bugs ocultos | Alta | Medio | Tratar cada error de compilación como un bug corregido, no como un obstáculo |
| Scope creep (añadir features durante refactor) | Alta | Medio | Regla estricta: cada PR es o refactor O feature, nunca ambos |

---

## Siguientes Pasos Después de Esta Hoja de Ruta

Una vez completadas las 5 fases, estaremos en posición de abordar (por orden de prioridad del documento de sistemas pendientes):

1. **Sistema de muerte y derrota** — Ya parcialmente implementado, necesita formalización.
2. **Sistema de party/grupo** — Necesario para testeo multijugador real.
3. **Segunda clase jugable** — Caballero del Alba como contraste mecánico al Bardo.
4. **Crafting básico** — Cocina de mazmorra como primer sistema de profesión.
5. **Reputación con NPCs** — Conectar las interacciones actuales con un sistema de afinidad.
