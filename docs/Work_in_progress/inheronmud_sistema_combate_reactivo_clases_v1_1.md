# InheronMUD — Sistema de Combate Reactivo y Extensión a Clases

**Documento técnico y de diseño**  
**Ámbito:** combate general, Pulso de Combate, recursos, estados, eventos, clases base y especializaciones 1–39  
**Versión:** v1.1  
**Estado:** propuesta implementable con ajustes de UX y rendimiento  
**Cambios v1.1:** divulgación progresiva de UI, comandos `ver efectos`/`pulso ?`, colores por bucket, reglas de testigos para Aplauso, reacciones simultáneas, acciones gratuitas, cache agresivo del ReactiveSkillService, alcance del NotableActionBuffer y manejo de intents desincronizados.

---

## 0. Resumen ejecutivo

El combate de InheronMUD debe ser **táctico, legible, reactivo y textual**.

No queremos un sistema donde el jugador solo escriba:

```text
cast hechizo_1
cast hechizo_2
attack goblin
```

Queremos un sistema donde cada turno el motor lea la escena y proponga opciones útiles mediante el **Pulso de Combate**, sin quitar al jugador el control.

El combate se basa en:

1. **Acciones por turno**
   - acción principal;
   - acción menor;
   - reacción;
   - acciones gratuitas limitadas.

2. **Estados y efectos**
   - buffs;
   - debuffs;
   - marcas;
   - efectos de sala;
   - efectos narrativos;
   - efectos persistentes de memoria/Crónica.

3. **Recursos de clase**
   - cada clase tiene un recurso primario;
   - algunas tienen recurso secundario;
   - los recursos definen su ritmo.

4. **Combos reactivos**
   - los estados abren oportunidades;
   - el Pulso de Combate recomienda acciones según contexto.

5. **Entorno**
   - la sala importa;
   - algunos rasgos modifican habilidades;
   - la exploración y el combate comparten información.

6. **Eventos notables**
   - acciones heroicas, críticas, salvamentos, interrupciones, descubrimientos y protección de nombres generan eventos que otras habilidades pueden consumir.

7. **Divulgación progresiva**
   - el prompt por defecto debe ser breve;
   - la explicación detallada se pide con comandos concretos;
   - evitamos “ceguera por scroll”.

---

## 1. Filosofía de combate

El combate en InheronMUD debe sentirse como una escena viva.

Principios:

- **Leer antes de golpear:** mirar el estado del enemigo, del grupo y de la sala debe importar.
- **No ocultar la táctica:** el sistema debe explicar por qué una acción es buena, pero solo cuando el jugador lo pida o sea crítico.
- **Evitar parálisis por elección:** Pulso de Combate propone acciones.
- **Permitir maestría:** el jugador experto puede usar comandos manuales y preparar combos.
- **Texto claro:** cada acción debe decir qué ocurre y qué cambia.
- **Bosses resistentes, no inmunes aburridos:** los controles se reducen, transforman o aplican versiones menores.
- **El entorno juega:** fuego, agua, eco, público, memoria, sombra, campanas o altura pueden cambiar la pelea.
- **El lore tiene mecánica:** nombres, Crónica, Corrientes y Cámara deben tener impacto técnico.
- **UX primero:** en cada turno se muestra lo esencial; el detalle vive en comandos secundarios.

---

## 2. Estructura del turno

Cada criatura en combate dispone normalmente de:

| Tipo | Uso |
|---|---|
| Acción principal | ataques fuertes, hechizos, skills principales |
| Acción menor | mantener, moverse, cambiar recurso, usar consumible rápido |
| Reacción | responder a disparadores durante la ronda |
| Acción gratuita | efectos puntuales limitados, no spameables |

Ejemplo:

```yaml
turnEconomy:
  mainAction: 1
  minorAction: 1
  reaction: 1
  freeActions:
    maxPerRound: 2
```

### 2.1 Acción principal

Usada para:

- atacar;
- lanzar hechizos;
- aplicar debuffs fuertes;
- curar;
- preparar habilidades potentes;
- activar mecánicas de clase.

### 2.2 Acción menor

Usada para:

- sostener efectos;
- reposicionarse;
- cambiar objetivo;
- usar habilidades ligeras;
- cambiar modo;
- activar recursos secundarios.

### 2.3 Reacción

Se activa ante eventos:

- enemigo prepara conjuro;
- aliado cae por debajo de cierto umbral de vida;
- enemigo falla;
- enemigo intenta huir;
- aliado recibe estado;
- boss anuncia habilidad;
- una trampa se activa.

Ejemplo:

```yaml
reactionTrigger:
  id: enemy_starts_spell
  visibleIf:
    actorCanDetectIntent: true
```

### 2.4 Acción gratuita

Las acciones gratuitas existen, pero no deben ensuciar el Pulso por defecto.

Ejemplos:

- soltar una frase breve;
- cambiar foco visual;
- marcar objetivo ya conocido;
- activar un beneficio pasivo limitado;
- aceptar una sugerencia de Pulso sin coste adicional;
- inspección mínima si el sistema la considera gratuita.

Reglas:

- máximo 2 por ronda, salvo excepciones;
- no pueden causar daño directo fuerte;
- no deben generar bucles de recursos;
- pueden aparecer en Pulso solo si son urgentes o muy contextuales;
- se muestran con etiqueta `[gratis]`.

Ejemplo:

```text
Pulso:
1) Interponer Escudo → Tilo
2) Golpe de Guardia → Conejo
3) Marcar objetivo → Conejo [gratis]
```

En modo compacto, las acciones gratuitas solo aparecen si quedan huecos o si el modo del jugador lo permite.

---

## 3. Divulgación progresiva de la interfaz

El sistema debe evitar que cada turno ocupe veinte líneas.

### 3.1 Prompt compacto por defecto

```text
Turno de Jorge
PV 42/58 · Voz 84 · 🎶2 · 👏1 · T 3/4
Estados: 🟪 Distraído 2r · 🟨 Zumbido 1r

Pulso:
1) Coda Inoportuna → Conejo
2) Sostener Himno
3) Balada → Tilo
4) Corte de Maelis
5) Paso de Liria
6) Resonancia

Escribe 1-6, comando, `pulso ?` o `ver efectos`.
```

### 3.2 Detalle bajo demanda

Comando:

```text
pulso ?
```

Salida:

```text
Pulso detallado

1. Coda Inoportuna → Conejo
   Razón: Conejo está Distraído y tienes Estrofa 3.
   Resultado esperado: daño sónico + Expuesto.

2. Sostener Himno
   Razón: Himno de la Primera Chapa expira este turno.
   Resultado esperado: +1 ronda de duración.
```

### 3.3 Consultar una opción concreta

```text
1?
```

Salida:

```text
1) Coda Inoportuna → Conejo
Coste: 25 Voz + Estrofa 3.
Requiere: enemigo con debuff bardo.
Motivo: Conejo está Distraído.
Resultado: daño sónico, consume Distraído y aplica Expuesto.
```

### 3.4 Comando `ver efectos`

Para no saturar el flujo de turno, los efectos viven en una vista separada.

```text
ver efectos
```

Salida:

```text
Efectos activos

Tú:
- Paso de Liria (1r): +2 Evasión, +1 Iniciativa.

Grupo:
- Himno de la Primera Chapa (2r): +1 Precisión, Moral x1.

Conejo Acorazado:
- Distraído (2r): -2 Precisión, -1 Evasión.
- Zumbido (1r): -1 Concentración.

Sala:
- Resonancia de Sala (3r): acoustic, mejora sonido.
```

### 3.5 Comando `ver recursos`

```text
ver recursos
```

Salida:

```text
Recursos de clase
Voz: 84/125
Estrofa: 2/5
Aplauso: 1/4
Trama: 3/4
```

---

## 4. Colores, iconos y buckets

El cliente textual puede usar color si está disponible, pero nunca debe depender solo del color.

### 4.1 Buckets del Pulso

| Bucket | Color sugerido | Icono | Uso |
|---|---|---|---|
| offense | Rojo | 🟥 | daño/remate |
| defense | Azul | 🟦 | protección/supervivencia |
| heal | Verde | 🟩 | curación |
| control | Violeta | 🟪 | debuff/CC |
| sustain | Amarillo | 🟨 | mantener/renovar |
| utility | Blanco | ◻️ | utilidad general |
| environment | Verde oscuro | 🌿 | sala/terreno |
| reaction | Cian | ⚡ | respuesta |
| memory | Dorado/pergamino | 📜 | Crónica/nombres |

Ejemplo:

```text
1) 🟥 Coda Inoportuna → Conejo
2) 🟨 Sostener Himno
3) 🟩 Balada → Tilo
4) ⚡ Corte de Maelis
5) 🟦 Paso de Liria
6) 🌿 Resonancia
```

### 4.2 Estados

| Icono | Tipo | Ejemplos |
|---|---|---|
| 🟩 | Curación/sostén | Balada de Remiendo |
| 🟦 | Defensa/protección | Paso de Liria, Escudo |
| 🟨 | Sónico/concentración | Zumbido, Ritmo Cortado |
| 🟪 | Control/social | Distraído, Burlado |
| 🟥 | Daño/vulnerabilidad | Expuesto, Sangrado |
| ⬛ | Sombra/memoria peligrosa | Borrón, Olvido |
| ✨ | Moral/inspiración | Moral, Inspirado |
| 📜 | Crónica/pistas | Tinta de Voz |

---

## 5. Estados y efectos

Todo efecto temporal debe tener estructura común.

```yaml
effectInstance:
  id: distraido
  name: Distraído
  type: debuff
  sourceSkillId: bardo.copla_pegadiza.1
  sourceActorId: player_123
  targetId: mob_conejo_01
  duration: 3
  durationType: rounds
  tags: [mental, bard, debuff]
  modifiers:
    accuracy: -2
    evasion: -1
  stackPolicy: refresh
  dispelPolicy:
    canBePurged: true
    onPurge:
      releaseThread: true
```

### 5.1 Tipos de efectos

| Tipo | Descripción |
|---|---|
| `buff` | mejora al objetivo |
| `debuff` | perjudica al objetivo |
| `dot` | daño periódico |
| `hot` | curación periódica |
| `mark` | marca explotable |
| `stance` | postura o modo |
| `room_effect` | afecta a la sala |
| `narrative_flag` | afecta Crónica, pistas o nombres |
| `reaction_window` | abre una reacción temporal |
| `cooldown_marker` | evita repetir efectos especiales |

### 5.2 Políticas de apilamiento

```yaml
stackPolicy:
  type: refresh # refresh | stack | ignore | replace | intensify
  maxStacks: 3
```

| Política | Uso |
|---|---|
| `refresh` | reinicia duración |
| `stack` | acumula cargas |
| `ignore` | si ya existe, no hace nada |
| `replace` | reemplaza versión menor por mayor |
| `intensify` | mejora efecto si ya estaba activo |

### 5.3 Purgas y resistencias

Si un efecto es resistido:

- no se aplica;
- no ocupa hilos;
- no activa armonías;
- puede generar efecto parcial si la skill lo define.

Si un efecto es purgado:

- se elimina;
- libera recursos asociados;
- puede activar `onPurge`;
- puede dejar Eco si la skill lo permite.

```yaml
onResist:
  applyPartial:
    id: irritado_leve
    duration: 1

onPurge:
  releaseThread: true
  sourceGain:
    estrofa: 1
    condition: ifEffectWasSustained
```

---

## 6. Recursos de clase

Cada clase debe tener:

- recurso primario;
- recurso secundario o medidor táctico;
- reglas de ganancia;
- reglas de gasto;
- interacción con Pulso.

Tabla inicial:

| Clase | Recurso primario | Recurso secundario | Estilo |
|---|---|---|---|
| Guardián del Alba | Guardia | Juramento | tanque/protección |
| Duelista de Academia | Estilo | Ventaja | precisión, counters |
| Monje de Candaluz | Disciplina | Combo | ritmo corporal |
| Explorador de Frontera | Instinto | Marca | rastreo, posición |
| Arcanista de las Cinco Corrientes | Maná | Sobrecarga | caster puro |
| Clérigo del Sol Quieto | Devoción | Gracia | sanación/protección |
| Bardo de Crónica Viva | Voz | Estrofa/Aplauso/Trama | soporte/control/memoria |
| Artífice de Gremio | Preparación | Carga de Kit | herramientas/trampas |

---

## 7. Pulso de Combate

El **Pulso de Combate** propone acciones rápidas según la escena.

No juega por el jugador. Ordena oportunidades.

### 7.1 Salida compacta por defecto

```text
Pulso:
1) 🟥 Coda Inoportuna → Conejo
2) 🟨 Sostener Himno
3) 🟩 Balada → Tilo
4) ⚡ Corte de Maelis
5) 🟦 Paso de Liria
6) 🌿 Resonancia
```

### 7.2 Salida detallada bajo demanda

```text
pulso ?
```

Muestra razones, coste y resultado esperado.

### 7.3 Consultar una opción

```text
2?
```

Muestra detalle solo de la opción 2.

### 7.4 Comandos

```text
pulso
pulso ?
1
1?
usar 2
rapida 3
1 slime
pulso modo ofensivo
pulso modo manual
```

### 7.5 Tags reactivos

```yaml
reactiveTags:
  - opener
  - finisher
  - sustain
  - interrupt
  - exploit_state
  - defensive
  - heal
  - protect_ally
  - reposition
  - environment
  - setup
  - cleanse
  - control
  - resource_builder
  - resource_dump
  - anti_boss
  - social
  - memory
  - free_action
```

### 7.6 Estructura YAML

```yaml
reactive:
  enabled: true
  bucket: offense
  tags: [finisher, exploit_state]
  basePriority: 40
  targetPolicy: enemy
  conditions:
    - id: target_has_exploitable_state
      if:
        targetHasAnyEffect: [distraido, desestabilizado, expuesto]
      addPriority: 50
      reason: "El objetivo tiene un estado que puedes explotar."
    - id: resource_available
      if:
        actorResourceAtLeast:
          voz: 25
      addPriority: 10
    - id: no_resource
      if:
        actorResourceBelow:
          voz: 25
      unavailable: true
```

### 7.7 Buckets

Para evitar seis ataques iguales:

```js
const buckets = {
  offense: 2,
  defense: 2,
  sustain: 1,
  utility: 1,
  environment: 1,
  reaction: 1,
  free_action: 1
};
```

### 7.8 Modos

| Modo | Prioridad |
|---|---|
| táctico | mezcla equilibrada |
| ofensivo | daño, remates |
| defensivo | supervivencia |
| soporte | curas, protección |
| explorador | sala, pistas, entorno |
| manual | solo muestra Pulso si el jugador lo pide |

### 7.9 Conocimiento limitado

Pulso no debe sugerir lo que el personaje no sabe.

Ejemplos:

- no sugiere interrumpir un conjuro oculto;
- no sugiere desactivar una trampa no detectada;
- no explota un estado invisible;
- no revela debilidades no descubiertas.

```yaml
requiresKnowledge:
  - target.intentVisible
  - target.stateKnown
```

---

## 8. ReactiveSkillService

### 8.1 Responsabilidad

El servicio debe:

- leer contexto;
- evaluar skills disponibles;
- calcular puntuación;
- diversificar resultados;
- devolver 3–6 sugerencias;
- adjuntar razones si se piden;
- respetar conocimiento limitado.

### 8.2 Contexto

```js
const context = {
  actor,
  party,
  enemies,
  room,
  combatState,
  visibleIntents,
  recentEvents,
  knownClues,
  worldFlags,
  playerPreferences
};
```

### 8.3 Pseudocódigo

```js
class ReactiveSkillService {
  suggest(actor, combat, limit = 6, detail = false) {
    const cacheKey = this.buildCacheKey(actor, combat, detail);
    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const context = this.buildContext(actor, combat);

    const scored = actor.skills.getAvailable()
      .filter(skill => skill.reactive?.enabled)
      .map(skill => this.scoreSkill(skill, context, detail))
      .filter(option => option.available);

    const diversified = this.diversify(scored, context.playerPreferences);

    const result = diversified
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    this.cache.set(cacheKey, result);
    return result;
  }

  scoreSkill(skill, context, detail) {
    let score = skill.reactive?.basePriority ?? 0;
    const reasons = [];

    for (const condition of skill.reactive?.conditions ?? []) {
      const result = this.evaluateCondition(condition, context);

      if (result.unavailable) {
        return { skill, available: false };
      }

      if (result.matches) {
        score += condition.addPriority ?? 0;
        if (detail && condition.reason) reasons.push(condition.reason);
      }
    }

    return {
      skill,
      available: true,
      score,
      reasons
    };
  }
}
```

### 8.4 Rendimiento y cache agresivo

Para evitar latencia:

- cachear sugerencias por actor/turno;
- no recalcular en cada render;
- invalidar solo ante cambios relevantes;
- separar vista compacta y vista detallada;
- evaluar primero condiciones baratas;
- no usar IA generativa para decisiones de turno.

#### Cache key sugerida

```js
const cacheKey = {
  combatId,
  round,
  actorId,
  actorResourceVersion,
  actorEffectsVersion,
  partyCriticalStateVersion,
  enemyVisibleStateVersion,
  roomCombatVersion,
  visibleIntentVersion,
  preferenceMode,
  detail
};
```

#### Invalidadores

Solo invalidar Pulso cuando cambie algo de esta lista:

- recursos críticos del actor;
- efectos visibles del actor;
- efectos visibles de enemigos;
- vida de aliados cruza umbral relevante;
- se crea/resuelve un intent visible;
- cambia la sala;
- se crea una NotableAction relevante;
- el jugador cambia modo de Pulso;
- muere o desaparece el objetivo sugerido.

---

## 9. NotableActionBuffer

Algunas habilidades consumen “acciones notables recientes”.

Ejemplo:

- Relato Fidedigno;
- Crónica Compartida;
- habilidades de liderazgo;
- reacciones heroicas;
- Aplauso;
- reputación en combate.

### 9.1 Implementación recomendada

El `NotableActionBuffer` debe vivir como servicio/singleton vinculado al `CombatManager`, no como datos sueltos en cada skill.

```js
class NotableActionBuffer {
  constructor(combatId) {
    this.combatId = combatId;
    this.events = [];
  }

  add(event) {}
  query(filter) {}
  consume(eventId, consumerId) {}
  expire(round) {}
  cleanup() {}
}
```

### 9.2 Alcance

Por defecto:

- en combate: vinculado a `combatId`;
- duración: 3 rondas;
- al terminar combate: se limpia;
- algunos eventos pueden promocionarse a `sceneNotableAction`.

Fuera de combate:

- vinculado a `sceneId`;
- duración: hasta fin de escena;
- puede registrarse en Crónica si una habilidad lo hace.

Si el jugador huye de una sala:

- los eventos de combate normales no viajan;
- los eventos promocionados a escena pueden seguir disponibles si el motor mantiene `sceneId`;
- `Crónica` puede registrar el evento como recuerdo persistente si una habilidad lo consume.

```yaml
notableActionScope:
  combat:
    defaultDurationRounds: 3
    cleanupOnCombatEnd: true
  scene:
    defaultDuration: scene
    requiresPromotion: true
```

### 9.3 Estructura

```yaml
notableAction:
  id: evt_12345
  scope: combat
  type: critical_hit
  actorId: player_guerrero
  targetId: mob_boss
  round: 4
  expiresInRounds: 3
  tags: [combat, heroic, damage]
  magnitude: 12
  witnessedBy:
    - player_bardo
    - npc_silo
  consumedBy: []
```

### 9.4 Tipos iniciales

```yaml
notableActionTypes:
  - critical_hit
  - saved_ally
  - healed_ally_under_threshold
  - interrupted_boss
  - discovered_clue
  - protected_npc
  - resisted_major_state
  - protected_name
  - exploited_environment
  - defeated_elite
  - blocked_lethal_damage
  - purged_major_debuff
```

### 9.5 Reglas

- duración base: 3 rondas;
- fuera de combate: hasta final de escena;
- puede ser consumido por una habilidad;
- puede ser leído por Pulso;
- puede generar Aplauso;
- puede quedar registrado en Crónica.

---

## 10. Testigos y Aplauso

Para evitar que el Aplauso sea imposible en solo play o infinito en tabernas, se definen reglas de testigos.

### 10.1 Qué cuenta como testigo

Cuenta como testigo válido si tiene alguno de estos tags:

```yaml
validWitnessTags:
  - intelligent
  - social_active
  - party_member
  - important_npc
  - summoned_companion
  - memory_anchor
```

No cuentan por defecto:

- decoración;
- animales sin tag especial;
- mobs sin inteligencia social;
- multitudes genéricas sin `crowd_active`;
- objetos parlantes sin `memory_anchor`.

### 10.2 Aplauso sin testigos

El Bardo puede ganar Aplauso en solo play por hazañas notables.

Ejemplos:

- crítico importante;
- enemigo falla por debuff bardo;
- interrupción peligrosa;
- sobrevivir a golpe letal;
- proteger nombre;
- descubrir pista importante.

Los testigos aumentan probabilidad, calidad o límite, pero no son obligatorios.

### 10.3 Cap por ronda

```yaml
applauseRules:
  baseGainCapPerRound: 1
  bonusFromWitnessesCapPerRoundFormula: "min(1, floor(presencia / 20))"
  maxWitnessBonusPerScene: 3
```

Interpretación:

- el Bardo puede ganar 1 Aplauso por ronda normalmente;
- testigos pueden añadir bonus limitado;
- Presencia alta puede mejorar el techo;
- evitar granjas infinitas de taberna.

### 10.4 Calidad del testigo

```yaml
witnessQuality:
  party_member: 1
  intelligent: 1
  social_active: 1
  important_npc: 2
  memory_anchor: 2
```

---

## 11. Intents visibles y desincronización

Para que reacciones y Pulso funcionen, el motor debe representar intenciones enemigas.

```yaml
intent:
  id: intent_fireball_01
  actorId: mob_mago
  type: spell_cast
  skillId: mob.fireball
  targetId: player_1
  visible: true
  detectionDifficulty: 14
  tags: [spell, fire, verbal, interruptible]
  resolvesAt: end_of_round
```

### 11.1 Ejemplos

| Intent | Reacción |
|---|---|
| conjuro verbal | Corte de Maelis |
| carga física | Guardia Alta |
| disparo apuntado | Paso evasivo |
| boss rugiendo | Himno defensivo |
| ritual | interrupción/romper foco |
| huida | perseguir/interceptar |

### 11.2 Desincronización de intents

Puede ocurrir que:

- el enemigo muera;
- cambie de objetivo;
- el intent sea cancelado;
- el jugador tarde en elegir;
- otro aliado resuelva antes la amenaza.

Reglas:

- cada sugerencia guarda `intentId` y `targetVersion`;
- al ejecutar, se revalida;
- si ya no es válida, se ofrecen alternativas;
- no se gasta recurso si falla por desincronización del motor.

Mensaje:

```text
La oportunidad ha cambiado: el Escriba sin Rostro ya no está canalizando.
No gastas Voz.

Opciones rápidas:
1) Nota Cortante → Escriba
2) Copla Pegadiza → Escriba
3) Pulso
```

---

## 12. Reacciones simultáneas

Puede haber varias reacciones contra el mismo disparador.

Ejemplo:

- Bardo quiere usar Corte de Maelis;
- Guardián quiere Interponer Escudo;
- Clérigo quiere Escudo de Fe.

### 12.1 Sistema de prioridad

Cada reacción tiene:

```yaml
reaction:
  priority: 50
  category: interrupt # interrupt | protect | mitigate | counter | movement
  targetPolicy: triggering_event
```

Orden sugerido:

1. cancelación/interrupción;
2. protección letal;
3. mitigación;
4. contraataque;
5. movimiento.

### 12.2 Resolución

Opción inicial recomendada: **orden por iniciativa de reacción**.

```yaml
reactionResolution:
  method: initiative_then_priority
  allowMultipleIfCategoriesDiffer: true
```

Reglas:

- si una reacción cancela el evento, las demás se revalidan;
- si ya no aplican, no consumen recurso;
- si aún aplican parcialmente, el jugador puede confirmar en modo avanzado;
- en MVP, se puede permitir solo una reacción por evento y priorizar la de mayor urgencia.

### 12.3 UX

En modo simple:

```text
Varias reacciones son posibles.
1) Corte de Maelis — intentar interrumpir
2) Interponer Escudo — proteger a Tilo
3) Escudo de Fe — mitigar daño
```

En auto-pulso, se sugiere la más urgente, pero el jugador puede elegir.

---

## 13. Boss policy

Los bosses no deben ser inmunes a todo, pero los controles deben transformarse.

```yaml
bossPolicy:
  controlReduction: true
  stun:
    convertTo: stagger
  knockdown:
    convertTo: destabilized
  silence:
    convertTo: castPowerReduction
  exposed:
    reducedEffect:
      nextDamageTakenPercent: 10
      internalCooldownRounds: 3
```

### 13.1 Reglas generales

| Control normal | Contra boss |
|---|---|
| stun | stagger |
| knockdown | desestabilizado |
| silence | reducción de potencia |
| fear | penalización menor |
| charm | inmune o efecto narrativo |
| exposed | bonus reducido |
| interrupt | reduce/corta fase menor |
| root | ralentiza |
| taunt | sube amenaza, no fuerza siempre |

---

## 14. Entorno y salas

Las salas deben tener tags y propiedades que el combate pueda leer.

```yaml
room:
  id: villaclara_campo_norte_01
  tags: [outdoor, grass, public, acoustic]
  combat:
    terrain: open
    cover: low
    hazards: []
    current: alba_minor
  exploration:
    memoryDifficulty: 12
    echoes:
      - clue_trail_rabbits
```

### 14.1 Tags iniciales

| Tag | Uso |
|---|---|
| `acoustic` | mejora sonido, canto, eco |
| `public` | testigos, Aplauso, social |
| `memory` | Crónica, nombres, pistas |
| `dungeon_living` | reloj de mazmorra |
| `holy` | curación/protección |
| `water` | electricidad, reflejos, Marea |
| `fire` | Brasa, quemaduras |
| `shadow` | Sombra, Borrón |
| `high_ground` | arquería, saltos |
| `narrow` | tanques, bloqueos |
| `cover` | defensa contra distancia |
| `trap_possible` | tramperos, artífices |

### 14.2 Fallback de sala

Si una sala no tiene tags especiales:

- las habilidades de entorno deben dar respuesta neutra;
- no deben fallar en silencio;
- WorldFactory debería advertir de salas sin tags, pero no romper juego.

Mensaje:

```text
No detectas rasgos tácticos claros en la sala.
```

---

## 15. Corrientes en combate

Aunque el sistema de Corrientes merece documento propio, el combate debe preverlas desde ya.

```yaml
current:
  id: alba_minor
  type: alba
  intensity: minor
  modifiers:
    healingOutputPercent: 5
    shadowResistance: 1
```

### 15.1 Corrientes base

| Corriente | Efecto de combate sugerido |
|---|---|
| Alba | curación, claridad, anti-Sombra |
| Raíz | control, resistencia, crecimiento |
| Brasa | daño, impulso, riesgo |
| Marea | adaptación, movilidad, estados fluidos |
| Sombra | ocultación, memoria, miedo, Borrón |

### 15.2 Intensidad

| Intensidad | Impacto |
|---|---|
| none | sin efecto |
| minor | ±5% o ±1 |
| moderate | ±10% o ±2 |
| major | mecánicas de zona |
| unstable | eventos/repercusiones |

---

## 16. UI de combate

### 16.1 Vista compacta común

```text
PV 58/72 · Energía 42/60 · Guardia 2 · Estados: Inspirado, Sangrado leve
```

### 16.2 Vista con Pulso

```text
Es tu turno.

PV 58/72 · Guardia 3/5 · Juramento 1/3

Pulso:
1) 🟦 Interponer Escudo → Liria
2) 🟥 Golpe de Guardia → Conejo
3) 🟪 Provocar → Conejo
4) 🟦 Avance Seguro
5) 🟩 Beber poción menor
6) ◻️ Analizar enemigo
```

### 16.3 Vista de estados

```text
ver efectos
```

```text
Estados activos:
- Moral x1 (2r): +1 Precisión, +1 resistencia mental.
- Distraído (2r): -2 Precisión, -1 Evasión.
- Desestabilizado (1r): vulnerable a derribo.
```

### 16.4 Niveles de detalle configurables

```text
ui combate compacto
ui combate normal
ui combate detallado
```

| Modo | Muestra |
|---|---|
| compacto | recursos + Pulso corto |
| normal | recursos + Pulso + estados clave |
| detallado | razones, costes, efectos y logs ampliados |

---

# 17. Clases base y extensión del sistema

## 17.1 Guardián del Alba

### Rol

Tanque, protección, amenaza, juramentos, defensa de grupo.

### Recursos

| Recurso | Uso |
|---|---|
| Guardia | absorber/proteger |
| Juramento | habilidades fuertes y reacciones heroicas |

### Estados propios

| Estado | Efecto |
|---|---|
| Guardia Alta | +bloqueo |
| Interpuesto | protege aliado |
| Juramento Activo | mejora skills defensivas |
| Firme | resiste empujes/control |
| Marca de Amenaza | enemigo penalizado si ignora al Guardián |

### Skills reactivas ejemplo

```yaml
id: guardian.interponer_escudo.1
reactive:
  bucket: defense
  tags: [protect_ally, reaction]
  basePriority: 40
  conditions:
    - if:
        allyHpBelowPercent: 35
      addPriority: 50
      reason: "Un aliado está en peligro."
    - if:
        enemyIntentTargetsAlly: true
      addPriority: 40
      reason: "Un enemigo prepara un ataque contra un aliado."
```

Pulso típico:

| Condición | Sugerencia |
|---|---|
| aliado bajo HP | Interponer Escudo |
| enemigo ignora tanque | Provocar |
| boss carga golpe | Guardia Alta |
| grupo agrupado | Estandarte defensivo |
| Guardián con Guardia alta | Castigo del Juramento |

---

## 17.2 Duelista de Academia

### Rol

DPS técnico, evasión, counters, precisión, duelos.

### Recursos

| Recurso | Uso |
|---|---|
| Estilo | mejora ataques precisos |
| Ventaja | se gana por esquivar, fintar o posicionarse |

### Estados

| Estado | Efecto |
|---|---|
| En Guardia | puede contraatacar |
| Ventaja | habilita remates |
| Marcado para Duelo | interacciones 1v1 |
| Desarmado | pierde ataque de arma |
| Fuera de Línea | vulnerable a estocadas |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| enemigo falla | Riposte |
| enemigo Expuesto | Estocada precisa |
| Ventaja alta | Remate elegante |
| enemigo prepara ataque | Finta |
| enemigo con escudo | Desarme |

---

## 17.3 Monje de Candaluz

### Rol

DPS ágil, interrupciones, combos, movilidad, autosostén.

### Recursos

| Recurso | Uso |
|---|---|
| Disciplina | técnicas internas |
| Combo | cadenas de golpes |

### Estados

| Estado | Efecto |
|---|---|
| Centrado | mejora resistencia/control |
| Combo 1/2/3 | desbloquea técnicas |
| Desestabilizado | vulnerable a derribo |
| Respiración Serena | regeneración/defensa |
| Silencio de Campana | penaliza casters |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| enemigo Desestabilizado | Barrido de Campana |
| enemigo casteando | Golpe al Aliento |
| Combo 3 | Palma Resonante |
| Monje bajo HP | Respiración Interior |
| enemigo rápido | Anclar Postura |

---

## 17.4 Explorador de Frontera

### Rol

Rastreo, arquería, trampas, control de terreno, supervivencia.

### Recursos

| Recurso | Uso |
|---|---|
| Instinto | reacciones, rastreo |
| Marca | debilita objetivo y habilita disparos |

### Estados

| Estado | Efecto |
|---|---|
| Marcado | recibe bonus de disparos |
| Enredado | pierde movilidad |
| Rastro Vivo | permite seguimiento |
| Camuflado | reduce ser objetivo |
| Terreno Leído | bonus en sala |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| enemigo marcado | Disparo Certero |
| enemigo se acerca | Trampa Rápida |
| sala con vegetación | Camuflaje |
| rastro visible | Seguir Rastro |
| enemigo volador | Disparo de Ala |

---

## 17.5 Arcanista de las Cinco Corrientes

### Rol

Caster puro, daño, control, barreras, interacción con Corrientes.

### Recursos

| Recurso | Uso |
|---|---|
| Maná | lanzar hechizos |
| Sobrecarga | potencia extra con riesgo |

### Estados

| Estado | Efecto |
|---|---|
| Sobrecargado | más poder, riesgo |
| Canalizando | prepara hechizo |
| Afinidad de Corriente | mejora escuela |
| Inestable | riesgo de repercusión |
| Escudo Arcano | absorbe daño |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| enemigos agrupados | Explosión Arcana |
| enemigo mojado | Rayo |
| enemigo enraizado | Brasa |
| Sobrecarga alta | Estabilizar |
| Corriente de sala fuerte | Sintonizar Corriente |
| boss con barrera | Disipar Sello |

---

## 17.6 Clérigo del Sol Quieto

### Rol

Sanación fuerte, protección, verdad, limpieza, anti-Sombra.

### Recursos

| Recurso | Uso |
|---|---|
| Devoción | hechizos sagrados |
| Gracia | reacciones y milagros menores |

### Estados

| Estado | Efecto |
|---|---|
| Bendecido | bonus general |
| Escudo de Fe | absorción |
| Purificado | limpia debuff |
| Luz Quieta | resiste miedo/Sombra |
| Juramento Verdadero | anti-falsedad |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| aliado bajo HP | Curación Mayor |
| grupo con miedo | Luz Quieta |
| enemigo Sombra | Exorcismo |
| aliado con veneno | Purificar |
| daño entrante fuerte | Escudo de Fe |
| nombre atacado | Oración de Verdad |

---

## 17.7 Bardo de Crónica Viva

### Rol

Soporte, control, memoria, buffs, debuffs, Pulso táctico.

### Recursos

| Recurso | Uso |
|---|---|
| Voz | canciones |
| Estrofa | ritmo/combo |
| Aplauso | clímax/Crónica |
| Trama | límite de efectos activos |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| efecto expira | Sostener Compás |
| enemigo Distraído | Coda Inoportuna |
| aliado herido | Balada de Remiendo |
| grupo sin Moral | Himno |
| sala con eco | Canto de Resonancia |
| enemigo casteando | Corte de Maelis |

---

## 17.8 Artífice de Gremio

### Rol

Herramientas, trampas, consumibles, sellos, control técnico, soporte.

### Recursos

| Recurso | Uso |
|---|---|
| Preparación | usar planes y kits |
| Carga de Kit | herramientas listas |

Pulso típico:

| Condición | Sugerencia |
|---|---|
| enemigo acorazado | Aceite Corrosivo |
| aliado envenenado | Antídoto Rápido |
| sala con trampa | Desactivar |
| enemigo en zona | Activar Trampa |
| boss con mecánica | Analizar Patrón |
| recurso bajo | Reorganizar Kit |

---

## 18. Estados comunes del sistema

### 18.1 Estados físicos

| Estado | Efecto |
|---|---|
| Sangrado | daño periódico |
| Cansado | reduce acciones/recursos |
| Derribado | pierde movilidad/acción menor |
| Desestabilizado | vulnerable a derribo |
| Ralentizado | menos iniciativa/movimiento |
| Enredado | no puede reposicionarse |
| Expuesto | recibe más daño |
| Aturdido | control fuerte, limitado en bosses |

### 18.2 Estados mentales/sociales

| Estado | Efecto |
|---|---|
| Asustado | reduce precisión/resistencia |
| Confundido | acción incierta |
| Inspirado | mejora precisión/resistencia |
| Burlado | penaliza ignorar |
| Distraído | reduce precisión/evasión |
| Fascinado | pierde reacción o acción menor |
| Fuera de Compás | concentración/preparación reducida |

### 18.3 Estados mágicos/narrativos

| Estado | Efecto |
|---|---|
| Nombre Anclado | resiste Borrón/Olvido |
| Olvido Menor | penaliza memoria/identidad |
| Borrón | amenaza nombre/display |
| Juramento Falso | altera lealtad/verdad |
| Tinta de Voz | pista protegida |
| Resonancia de Sala | sala activa |
| Corriente Afinada | bonus por corriente |

---

## 19. Sistema de recursos común

Cada recurso debe definir:

```yaml
resource:
  id: guardia
  maxFormula: "base + constitucion * 2"
  regen:
    onRoundStart: 2
    onBlock: 1
  spendRules:
    canGoNegative: false
```

Campos:

- `id`;
- `displayName`;
- `maxFormula`;
- `regenRules`;
- `spendRules`;
- `onGain`;
- `onSpend`;
- `uiPriority`.

---

## 20. Skill schema común

```yaml
id: bardo.copla_pegadiza.1
name: Copla Pegadiza I
class: bardo_cronica_viva
level: 2
family: copla
type: spell
actionType: main
target: enemy
range: medium
cost:
  voz: 14
requirements:
  learned: true
  notSilenced: true
attributes:
  dc: presencia
save:
  type: mental
  difficultyFormula: "10 + presencia + floor(level / 2)"
effects:
  onFailedSave:
    apply:
      id: distraido
      duration: 3
reactive:
  enabled: true
  bucket: control
  basePriority: 30
messages:
  cast: "Cantas una copla imposible de ignorar."
  hit: "$target queda Distraído."
  miss: "$target resiste la copla."
```

Campos mínimos:

- `id`;
- `name`;
- `class`;
- `level`;
- `type`;
- `actionType`;
- `target`;
- `cost`;
- `effects`;
- `messages`;
- `reactive`.

### 20.1 Complejidad del YAML reactivo

Para evitar que cada skill tenga bloques `reactive` inmanejables, se permite usar plantillas.

```yaml
reactiveTemplate: exploit_debuff_finisher
reactiveOverrides:
  targetEffects: [distraido, burlado, zumbido]
  reason: "El objetivo tiene un efecto bardo que puedes convertir en Expuesto."
```

Plantillas iniciales:

- `basic_attack`
- `low_hp_heal`
- `protect_ally`
- `interrupt_visible_intent`
- `exploit_debuff_finisher`
- `sustain_expiring_effect`
- `environment_opportunity`
- `cleanse_dangerous_state`
- `resource_builder`
- `boss_mitigation`

---

## 21. CombatManager: responsabilidades

- [ ] Crear combate.
- [ ] Ordenar turnos.
- [ ] Gestionar acción principal/menor/reacción/gratuitas.
- [ ] Resolver intents.
- [ ] Emitir eventos.
- [ ] Procesar efectos por ronda.
- [ ] Llamar a ReactiveSkillService.
- [ ] Registrar NotableActions.
- [ ] Aplicar bossPolicy.
- [ ] Gestionar muerte/huida/desconexión.
- [ ] Limpiar efectos temporales.
- [ ] Gestionar cache de Pulso.

---

## 22. EffectsManager: responsabilidades

- [ ] Aplicar efectos.
- [ ] Quitar efectos.
- [ ] Refrescar duración.
- [ ] Apilar stacks.
- [ ] Procesar ticks.
- [ ] Calcular modificadores.
- [ ] Resolver purgas.
- [ ] Disparar onApply/onExpire/onPurge.
- [ ] Crear ecos.
- [ ] Informar a HarmonyService.
- [ ] Informar a ReactiveSkillService para invalidar cache.

---

## 23. EventBus

El combate necesita eventos comunes.

```yaml
event:
  type: enemy_missed_attack
  actorId: mob_1
  targetId: player_1
  round: 3
  tags: [combat, miss]
```

Eventos mínimos:

- `skill_used`;
- `skill_hit`;
- `skill_missed`;
- `effect_applied`;
- `effect_resisted`;
- `effect_purged`;
- `effect_expired`;
- `damage_dealt`;
- `healing_done`;
- `ally_saved`;
- `critical_hit`;
- `enemy_intent_visible`;
- `enemy_intent_resolved`;
- `room_effect_applied`;
- `notable_action_created`;
- `combat_started`;
- `combat_ended`;
- `pulse_cache_invalidated`.

---

## 24. Limpieza de efectos

Al morir, huir o desconectarse:

- efectos personales del actor deben expirar;
- efectos de sala deben limpiarse si dependían del actor;
- hilos de Trama deben liberarse;
- reacciones pendientes deben cancelarse;
- buffs persistentes deben revisarse;
- NotableActions pueden conservarse si son de escena, no de actor.

```yaml
cleanupPolicy:
  onSourceDeath:
    removeEffectsWithSource: true
    convertSustainedEffectsToEcho: false
  onCombatEnd:
    removeCombatEffects: true
    preserveSceneEffects: true
  onDisconnect:
    preserveSceneEffectsForSeconds: 60
    removeCombatOnlyEffects: true
```

---

## 25. Implementación por fases

## Fase 1 — Núcleo mínimo

Objetivo: que el combate soporte recursos, turnos, efectos simples y Pulso básico.

- [ ] acción principal;
- [ ] acción menor;
- [ ] reacción básica;
- [ ] acción gratuita limitada;
- [ ] recursos por clase;
- [ ] EffectsManager ampliado;
- [ ] estados con duración;
- [ ] EventBus;
- [ ] NotableActionBuffer básico;
- [ ] Pulso con 3 sugerencias compactas;
- [ ] `pulso ?`;
- [ ] `1?`;
- [ ] `ver efectos`;
- [ ] YAML común de skills.

## Fase 2 — MVP: El Pulso de Cobre

- [ ] Bardo nivel 1–5:
  - Voz;
  - Estrofa;
  - Trama 3 hilos;
  - Nota Cortante;
  - Paso de Liria;
  - Copla Pegadiza;
  - Sostener Compás;
  - Canto de Resonancia;
  - Himno de la Primera Chapa.
- [ ] Guardián nivel 1–5:
  - Guardia;
  - Juramento básico;
  - Interponer Escudo;
  - Guardia Alta;
  - Provocar;
  - Golpe de Guardia.
- [ ] Conejo Acorazado.
- [ ] Sala con tag `acoustic`.
- [ ] 5 estados:
  - Distraído;
  - Moral;
  - Zumbido;
  - Guardia Alta;
  - Desestabilizado.
- [ ] Pulso por clase con 3 sugerencias.

## Fase 3 — Estados y entorno

- [ ] room.tags;
- [ ] Resonancia de Sala;
- [ ] intents visibles;
- [ ] efectos de sala;
- [ ] bossPolicy básica;
- [ ] reacciones contextuales.

## Fase 4 — Todas las clases 1–10

- [ ] Guardián 1–10;
- [ ] Duelista 1–10;
- [ ] Monje 1–10;
- [ ] Explorador 1–10;
- [ ] Arcanista 1–10;
- [ ] Clérigo 1–10;
- [ ] Bardo 1–10;
- [ ] Artífice 1–10;
- [ ] Pulso por clase.

## Fase 5 — Profundidad táctica

- [ ] Armonías;
- [ ] Ecos;
- [ ] Tramas avanzadas;
- [ ] combos por clase;
- [ ] eventos notables avanzados;
- [ ] Crónica en combate.

## Fase 6 — Especializaciones 20–39

- [ ] especializaciones por clase;
- [ ] recursos secundarios avanzados;
- [ ] Pulso avanzado;
- [ ] bosses con mecánicas;
- [ ] integración de Corrientes.

---

## 26. Checklist técnica general

## Núcleo

- [ ] CombatManager por turnos.
- [ ] Action economy.
- [ ] ResourcesManager.
- [ ] EffectsManager ampliado.
- [ ] EventBus.
- [ ] NotableActionBuffer.
- [ ] ReactiveSkillService.
- [ ] HarmonyService.
- [ ] RoomEffectService.
- [ ] BossPolicyResolver.
- [ ] UI textual de combate.
- [ ] Sistema de divulgación progresiva.
- [ ] Comandos `ver efectos`, `pulso ?`, `1?`.

## Datos

- [ ] YAML schema de skills.
- [ ] YAML schema de estados.
- [ ] YAML schema de recursos.
- [ ] YAML schema de clases.
- [ ] YAML schema de salas.
- [ ] YAML schema de Corrientes.
- [ ] YAML schema de reactive templates.
- [ ] Validación de YAML.
- [ ] IDs estables.

## UX

- [ ] vista compacta de estado.
- [ ] vista de estados activos.
- [ ] vista compacta de Pulso.
- [ ] vista detallada bajo demanda.
- [ ] razones de sugerencias.
- [ ] comandos cortos 1–6.
- [ ] fallback manual.
- [ ] modos de Pulso.
- [ ] colores/iconos por bucket.
- [ ] límites de líneas por turno.

## Balance

- [ ] límites de control en bosses.
- [ ] límites de stack.
- [ ] coste creciente de mantenimiento.
- [ ] cooldowns internos.
- [ ] cap de Aplauso por ronda.
- [ ] definición de testigos válidos.
- [ ] logging de uso.
- [ ] tests de daño/curación.

---

## 27. Testing recomendado

## Unitarios

- [ ] aplicar efecto.
- [ ] expirar efecto.
- [ ] refrescar efecto.
- [ ] stackear efecto.
- [ ] resistir efecto.
- [ ] purgar efecto.
- [ ] procesar tick.
- [ ] calcular recurso.
- [ ] gastar recurso.
- [ ] regenerar recurso.
- [ ] generar evento.
- [ ] crear NotableAction.
- [ ] expirar NotableAction.
- [ ] consultar Pulso compacto.
- [ ] consultar Pulso detallado.
- [ ] invalidar cache de Pulso.
- [ ] resolver reacción simultánea.
- [ ] revalidar intent desincronizado.

## Integración

- [ ] combate 1v1.
- [ ] combate grupo.
- [ ] reacción a intent visible.
- [ ] dos reacciones al mismo intent.
- [ ] boss con control reducido.
- [ ] sala con tags.
- [ ] muerte limpia efectos.
- [ ] desconexión limpia efectos.
- [ ] Pulso cambia al cambiar estado.
- [ ] NotableAction expira.
- [ ] `ver efectos` no altera estado.
- [ ] `1?` muestra detalle correcto.
- [ ] acción sugerida no gasta recurso si intent ya no es válido.

## UX

- [ ] prompt compacto no supera límite de líneas.
- [ ] textos claros.
- [ ] no saturar pantalla.
- [ ] mostrar razones útiles bajo demanda.
- [ ] modo manual funciona.
- [ ] jugador puede usar comandos largos.
- [ ] iconos no son imprescindibles para entender.

---

## 28. Decisiones pendientes

- [ ] ¿Cuántos recursos máximos por clase permitimos en UI compacta?
- [ ] ¿Pulso muestra 3 o 6 sugerencias por defecto en móvil?
- [ ] ¿Las reacciones se eligen automáticamente o el Pulso las prepara?
- [ ] ¿Los efectos de escena persisten al reiniciar servidor?
- [ ] ¿Cuánto dura una NotableAction fuera de combate?
- [ ] ¿Las Corrientes se calculan por sala, zona o región?
- [ ] ¿Habrá cooldown global por familia?
- [ ] ¿Cómo se muestran los estados ocultos?
- [ ] ¿Qué se considera “testigo” válido para Aplauso?
- [ ] ¿Los jugadores pueden configurar prioridades del Pulso?
- [ ] ¿Cuántas líneas máximas debe ocupar un turno en cliente móvil?
- [ ] ¿Qué modo de UI será el predeterminado: compacto o normal?

---

## 29. Veredicto

El nuevo combate de InheronMUD debe construirse alrededor de una idea:

> El jugador no elige de una lista muerta de comandos. Lee una escena viva y decide qué oportunidad convertir en acción.

El Bardo fue el prototipo perfecto porque exige Trama, recursos, eventos, sala y Pulso.  
Pero el sistema no debe quedarse en el Bardo.  
Todas las clases deben usar el mismo núcleo:

- estados;
- recursos;
- oportunidades;
- reacciones;
- entorno;
- eventos notables;
- Pulso.

La clave de producción será la UX: **mostrar poco por defecto y permitir mucho detalle bajo demanda**.  
Si esto se respeta, InheronMUD tendrá un combate textual moderno, legible, profundo y con identidad propia.
