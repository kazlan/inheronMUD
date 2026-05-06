# InheronMUD — Bardo de Crónica Viva y Pulso de Combate

**Documento de diseño implementable**  
**Ámbito:** Bardo niveles 1–39 + sistema reactivo de skills  
**Estado:** borrador consolidado para implementación  
**Objetivo:** definir una primera clase completa con recursos, habilidades, estados, mensajes al jugador, trenzado de efectos y sistema de sugerencias tácticas.


---

## Revisión incorporada tras Ojo Externo

Esta versión incorpora una revisión crítica externa centrada en tres áreas: persistencia de acciones notables, claridad de interfaz y reducción de riesgo técnico del sistema reactivo.

### Cambios principales

- Se añade el sistema `NotableActionBuffer`, necesario para que habilidades como `Relato Fidedigno`, `Crónica Compartida`, `Testigo Improbable` y varias ramas de Cronista funcionen con datos reales del motor.
- Se aclara la interacción entre `Voz Quebrada`, Voz y Aplauso.
- Se define qué ocurre cuando un efecto sostenido es purgado, resistido o eliminado por una mecánica de boss.
- Se divide la UI del Bardo en vista compacta, vista táctica y vista depuración para evitar saturación textual.
- Se especifica que `Pulso de Combate` empieza como heurístico determinista, con una futura capa opcional de preferencias aprendidas.
- Se añaden reglas de rendimiento para `ReactiveSkillService`.
- Se añade limpieza obligatoria de Trama al morir, desconectarse o abandonar combate.
- Se refuerza la utilidad del Cronista de Nombres en contenido de combate puro mediante usos alternativos de memoria, identificación, resistencia y registro de patrones.
- Se define un MVP reducido: Bardo nivel 1-5, Voz, Estrofa, Trama básica y Pulso con 3 sugerencias.

---

---

## 1. Principios de diseño

El **Bardo de Crónica Viva** no es un soporte genérico ni un músico decorativo. Es una clase que altera la escena mediante voz, memoria, testigos, reputación, ritmo y Crónica.

Su jugabilidad debe girar alrededor de:

- mantener varios efectos activos;
- trenzar buffs, debuffs y ecos;
- leer el estado de jugador, grupo, enemigo y sala;
- convertir acciones memorables en recursos;
- proteger nombres, recuerdos y pistas;
- controlar sin convertirse en mago puro;
- apoyar sin reemplazar del todo al Clérigo;
- hacer daño suficiente para jugar solo, pero sin competir con Arcanista o Duelista.

La frase de diseño:

> El Bardo no lanza canciones. Mantiene varias versiones posibles de la escena hasta que una de ellas se vuelve verdad.

---

## 2. Atributos relevantes

### Presencia

Atributo principal del Bardo.

Representa voz, carisma, fuerza escénica, autoridad emocional, control del público y capacidad de imponer una versión cantada de lo que está ocurriendo.

Afecta a:

- potencia de canciones;
- dificultad de resistir coplas;
- curaciones bardas;
- duración y fuerza de moral;
- Voz máxima;
- interacción social;
- anclajes de nombre y Crónica.

Fórmulas base:

```yaml
vozMaxima: 100 + presencia * 5 + bonuses
dcBarda: 10 + presencia + floor(level / 2)
curacionBarda: base + presencia * coefficient
```

### Ingenio

Atributo secundario técnico.

Representa improvisación, lectura de patrones, ironía táctica, rumores, habilidad para detectar incoherencias y transformar una escena rara en ventaja útil.

Afecta a:

- Rumor Andante;
- Canto de Resonancia;
- Contraestrofas;
- Pregunta con Eco;
- reducción de repercusiones;
- lectura de documentos, contradicciones y escenas sociales.

### Percepción

Atributo sensorial.

Representa oído, atención, lectura del entorno, detección de intenciones enemigas y percepción de oportunidades.

Afecta a:

- interrupciones;
- detección de preparación enemiga;
- Canto de Resonancia;
- Canción de Sala;
- iniciativa;
- detectar pistas sonoras.

### Destreza

Atributo defensivo menor.

Afecta a:

- evasión;
- Paso de Liria;
- Paso Sincopado;
- uso de armas ligeras;
- reposicionamiento.

### Sabiduría

Atributo de resistencia.

Afecta a:

- resistencia a miedo;
- resistencia a Sombra;
- resistencia a Cámara;
- efectos de Nombre Anclado;
- especialización Cronista de Nombres.

### Constitución

Atributo de aguante.

Afecta a:

- vida;
- resistencia física;
- resistencia a veneno/cansancio;
- pérdida de Voz por estados físicos graves.

---

## 3. Recursos del Bardo

### Voz

Recurso principal.

```yaml
resource:
  id: voz
  name: Voz
  maxFormula: "100 + presencia * 5 + bardLevelBonuses"
  regenPerRoundFormula: "8 + floor(presencia / 2)"
```

Uso:

- canciones;
- coplas;
- notas;
- baladas;
- contraestrofas;
- sostener efectos.

Visualización:

```text
Voz: 84/125
```

En combate:

```text
🎵 Voz 84/125 · Estrofa 2/5 · Aplauso 1/4 · Trama 3/4
```

### Estrofa

Recurso de ritmo y composición.

- Máximo: 5.
- Empieza en 0.
- Gana +1 al usar una familia distinta a la anterior.
- No sube con Sostener Compás.
- Baja -1 si se repite una misma familia tres veces seguidas.
- A Estrofa 3 se activa el **Estribillo**.

```yaml
resource:
  id: estrofa
  min: 0
  max: 5
  gain:
    onDifferentFamilyUsed: 1
  loss:
    onThirdRepeatedFamily: 1
```

Mensajes:

```text
🎶 La nueva frase encaja con la anterior. Estrofa +1.
```

```text
Has encontrado el estribillo. Algunas canciones ganan efectos adicionales.
```

```text
La melodía se vuelve previsible. Estrofa -1.
```

### Aplauso

Recurso heroico/narrativo.

- Máximo inicial: 3.
- Nivel 10: máximo 4.
- Nivel 20+: máximo 5, según especialización.

Se gana cuando:

- un aliado hace crítico;
- un enemigo falla por un debuff bardo;
- el grupo completa objetivo en combate;
- hay testigos de una acción notable;
- se protege un nombre;
- se descubre o registra una pista relevante;
- se activa una armonía importante.

Visualización:

```text
Aplauso: 1/4
```

Mensaje:

```text
👏 La escena responde. Ganas 1 Aplauso.
```

---

## 4. Sistema de Trama

La **Trama** representa los efectos bardos activos que el personaje mantiene en escena.

### Límite de Trama

| Nivel | Límite |
|---:|---:|
| 1–9 | 3 hilos |
| 10–19 | 4 hilos |
| 20+ | 5 hilos, según especialización |

Reglas:

- efecto menor: 1 hilo;
- efecto mayor: 2 hilos;
- instantáneos: 0 hilos;
- ecos: 0 hilos salvo excepción;
- efectos de sala pueden ocupar 1 hilo si están activos en combate.

```yaml
bardWeave:
  maxThreads:
    level1: 3
    level10: 4
    level20: 5
  majorEffectWeight: 2
```

Visualización:

```text
Trama activa: 3/4
- Himno de la Primera Chapa: 2r
- Copla Pegadiza sobre Conejo Acorazado: 2r
- Balada de Remiendo sobre Tilo: 3r
```

Error por límite:

```text
Tu Trama ya sostiene demasiados hilos. Debes dejar caer uno o usar Cambiar el Hilo.
```

---

## 5. Sostener Compás

### Desbloqueo

Nivel 3.

### Tipo

Acción menor o acción principal.

### Coste

- Acción menor: 6 Voz.
- Acción principal: 10 Voz.

### Efecto como acción menor

Prolonga +1 ronda un efecto bardo menor activo.

### Efecto como acción principal

Elige una opción:

1. Congelar duración de hasta 2 efectos menores este turno.
2. Prolongar +1 ronda un efecto mayor.
3. Convertir hasta 2 efectos que expirarían este turno en Eco.

### Coste creciente sobre el mismo efecto

| Veces sostenido | Coste |
|---:|---:|
| 1ª | 6 Voz |
| 2ª | 9 Voz |
| 3ª | 14 Voz |
| 4ª | no permitido antes de nivel 20 |

```yaml
id: bardo.sostener_compas.1
name: Sostener Compás
class: bardo_cronica_viva
level: 3
family: nucleo
type: skill
target: own_bard_effects
actionModes:
  minor:
    cost:
      voz: 6
    effect:
      extendOneMinorEffect: 1
  main:
    cost:
      voz: 10
    effect:
      freezeTwoMinorEffectsThisRound: true
      orExtendOneMajorEffect: 1
      orConvertExpiringEffectsToEcho:
        max: 2
sustainCostScaling:
  repeatedOnSameEffect: [6, 9, 14]
  maxBeforeLevel20: 3
```

Mensajes:

```text
🎼 Mantienes el compás de Himno de la Primera Chapa. El efecto durará 1 ronda más.
```

```text
La melodía empieza a tensarse. Sostenerla otra vez costará más Voz.
```

```text
No hay ningún hilo bardo que puedas sostener ahora mismo.
```

---

## 6. Cambiar el Hilo

### Desbloqueo

Nivel 10.

### Tipo

Acción menor.

### Coste

8 Voz.

### Efecto

Retira voluntariamente un efecto bardo activo y gana:

- +1 Estrofa;
- la siguiente habilidad de familia distinta cuesta -4 Voz.

```yaml
id: bardo.cambiar_hilo.1
name: Cambiar el Hilo
class: bardo_cronica_viva
level: 10
family: nucleo
type: skill
actionType: minor
target: own_bard_effect
cost:
  voz: 8
effect:
  removeEffect: selectedOwnBardEffect
  gain:
    estrofa: 1
  nextDifferentFamilyCostReduction: 4
```

Mensaje:

```text
Sueltas un hilo antes de que ahogue la melodía. Estrofa +1.
```

---

## 7. Ecos

Un **Eco** es la versión residual de un efecto bardo sostenido o especialmente bien trenzado.

Un efecto deja Eco si:

- fue sostenido al menos una vez;
- estaba activo cuando el Bardo tenía Estrofa 3+;
- la skill indica `echoOnExpire: true`;
- una especialización lo permite.

Duración base del Eco: 1 ronda.

Ejemplos:

| Efecto original | Eco |
|---|---|
| Himno de la Primera Chapa | +1 Moral |
| Copla Pegadiza | -1 Precisión |
| Paso de Liria | +1 Evasión |
| Balada de Remiendo | curación menor final |
| Verso de Fennel | +1 resistencia mental/memoria |
| Canto de Resonancia | conserva pista detectada en UI |

Mensaje:

```text
El Himno de la Primera Chapa termina, pero deja un eco de valor en el grupo.
```

---

## 8. Armonías

Las **Armonías** se activan cuando varias piezas de la Trama se combinan.

Reglas:

- no ocupan hilo;
- no se lanzan manualmente;
- se recalculan al inicio y final de ronda;
- su efecto debe ser pequeño, pero tácticamente útil.

### Armonía de Vanguardia

Requiere:

- Himno de la Primera Chapa;
- Paso de Liria.

Efecto:

- aliados afectados ganan +1 Iniciativa;
- el primer aliado que cambie posición no sufre penalización.

Mensaje:

```text
🎶 Armonía de Vanguardia: el grupo encuentra el paso común.
```

### Armonía de Ridículo

Requiere:

- Copla Pegadiza;
- Síncopa Burlona sobre el mismo enemigo.

Efecto:

- si ese enemigo falla un ataque, el Bardo gana +1 Estrofa;
- una vez por combate, si falla por 5 o más, gana +1 Aplauso.

Mensaje:

```text
🎭 Armonía de Ridículo: el enemigo empieza a perder contra su propio ritmo.
```

### Armonía de Remiendo

Requiere:

- Balada de Remiendo;
- Himno del Valor Prestado.

Efecto:

- próxima curación sobre el objetivo +15%;
- si el objetivo estaba Asustado, reduce el estado un grado.

### Armonía de Nombre

Requiere:

- Verso de Fennel;
- Relato Fidedigno o una pista registrada.

Efecto:

- +1 resistencia contra Borrón/Olvido;
- si el objetivo resiste memoria, genera 1 Aplauso.

---

## 9. Estados principales del Bardo

### Zumbido

```yaml
id: zumbido
name: Zumbido
type: debuff
duration: 2
threadWeight: 1
modifiers:
  concentration: -1
  interruptResistance: -1
tags: [bard, sonic, minor, debuff]
```

UI:

```text
Zumbido (2r): -1 Concentración, -1 resistencia a interrupción.
```

Mensaje:

```text
La nota deja un zumbido fino alrededor de Conejo Acorazado.
```

### Distraído

```yaml
id: distraido
name: Distraído
type: debuff
duration: 3
threadWeight: 1
modifiers:
  accuracy: -2
  evasion: -1
tags: [bard, mental, copla, debuff]
```

UI:

```text
Distraído (3r): -2 Precisión, -1 Evasión.
```

### Burlado

```yaml
id: burlado
name: Burlado
type: debuff
duration: 2
threadWeight: 1
tags: [bard, social, control]
rules:
  ifAttacksNonBard:
    accuracy: -2
  ifAttacksBardAndMisses:
    bardGain:
      estrofa: 1
```

UI:

```text
Burlado (2r): -2 Precisión si no ataca al Bardo.
```

### Inspirado leve

```yaml
id: inspirado_leve
name: Inspirado leve
type: buff
duration: 2
modifiers:
  accuracy: 1
  mentalResistance: 1
tags: [bard, morale, buff]
```

UI:

```text
Inspirado leve (2r): +1 Precisión, +1 resistencia mental.
```

### Moral

```yaml
id: moral
name: Moral
type: buff
duration: 3
maxStacks: 3
modifiersByStack:
  accuracy: 1
  mentalResistance: 1
tags: [morale, bard, stackable]
```

Cada stack:

- +1 Precisión;
- +1 resistencia mental.

UI:

```text
Moral x1 (3r): +1 Precisión, +1 resistencia mental.
```

### Resonancia de Sala

```yaml
id: resonancia_sala
name: Resonancia de Sala
type: room_effect
duration: 3
threadWeight: 1
tags: [bard, exploration, room, resonance]
```

Efectos por rasgo de sala:

| Rasgo | Efecto |
|---|---|
| acoustic | Nota Cortante +1 daño |
| public | Himnos +1 duración si hay testigos |
| memory | Baladas y nombres +1 tirada |
| dungeon_living | revela reloj/pulso |
| archive | mejora detectar contradicción |
| holy | curas bardas +1 |
| water | revela eco/reflejo/ruta |

UI:

```text
Resonancia de Sala (3r): este lugar responde a la Voz.
```

### Voz Quebrada

```yaml
id: voz_quebrada
name: Voz Quebrada
type: debuff
duration: 1
modifiers:
  vozCostMultiplier: 1.25
tags: [bard, repercussion]
```

UI:

```text
Voz Quebrada (1r): tus habilidades de Voz cuestan un 25% más.
```

### Irritado leve

```yaml
id: irritado_leve
name: Irritado leve
type: marker
duration: 1
tags: [bard, social, partial]
effects:
  nextCoplaAgainstTarget:
    bonus: 1
```

UI:

```text
Irritado leve (1r): la próxima Copla contra este objetivo tiene +1.
```

### Ritmo Cortado

```yaml
id: ritmo_cortado
name: Ritmo Cortado
duration: 1
threadWeight: 0
modifiers:
  concentration: -1
  initiative: -1
tags: [bard, interrupt, echo_like]
```

UI:

```text
Ritmo Cortado (1r): -1 Concentración, -1 Iniciativa.
```

---

# 10. Bardo nivel 1–10: habilidades detalladas

## Nivel 1 — Nota Cortante I

```yaml
id: bardo.nota_cortante.1
name: Nota Cortante I
class: bardo_cronica_viva
level: 1
family: nota
type: spell
actionType: main
target: enemy
range: medium
cost:
  voz: 12
attributes:
  power: presencia
  accuracy: percepcion
damage:
  type: sonic
  formula: "6 + presencia * 0.7 + level * 0.6"
onHit:
  chanceEffects:
    - effect: zumbido
      chance: 25
      duration: 2
      chanceIfTargetHasAny:
        effects: [distraido, burlado]
        chance: 40
estrofa:
  gainFamily: nota
repercussion:
  onCriticalFailure:
    applyToSelf: voz_quebrada
    duration: 1
```

Efecto:

- daño sónico a un enemigo;
- 25% de aplicar Zumbido 2r;
- 40% si el objetivo ya tiene Distraído o Burlado;
- fallo crítico aplica Voz Quebrada.

Mensaje:

```text
Tensas una nota fina como hilo de plata y la lanzas contra Conejo Acorazado.
```

```text
La nota corta el aire y golpea a Conejo Acorazado. Daño sónico: 9.
```

```text
Conejo Acorazado queda con Zumbido (2r).
```

---

## Nivel 1 — Paso de Liria I

```yaml
id: bardo.paso_liria.1
name: Paso de Liria I
class: bardo_cronica_viva
level: 1
family: danza
type: skill
actionType: minor
target: self
cost:
  voz: 8
duration: 2
attributes:
  defense: destreza
  sustain: presencia
effects:
  apply:
    - id: paso_liria
      duration: 2
      threadWeight: 1
      modifiers:
        evasion: 2
        initiative: 1
      tags: [bard, danza, mobility, buff]
estrofa:
  gainFamily: danza
echoOnExpire:
  id: eco_paso_liria
  condition: sustainedOrEstrofa3
```

Efecto:

- +2 Evasión;
- +1 Iniciativa;
- duración 2r;
- permite reposicionamiento menor;
- si deja Eco: +1 Evasión 1r.

Mensaje:

```text
Recuerdas el paso errante de Liria Sietecuerdas. Tus pies encuentran huecos donde antes había peligro.
```

UI:

```text
Paso de Liria (2r): +2 Evasión, +1 Iniciativa.
```

---

## Nivel 2 — Copla Pegadiza I

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
attributes:
  dc: presencia
  nuance: ingenio
save:
  type: mental
  difficultyFormula: "10 + presencia + floor(level / 2)"
durationByTarget:
  normal: 3
  elite: 2
  boss: 1
onFailedSave:
  applyEffect:
    id: distraido
onSuccessfulSave:
  applyEffect:
    id: irritado_leve
    duration: 1
onTargetOffensiveMiss:
  chance:
    base: 25
    gain:
      estrofa: 1
estrofa:
  gainFamily: copla
```

Efecto:

- resistencia mental del objetivo;
- si falla: Distraído;
- si resiste: Irritado leve 1r;
- si falla una acción ofensiva mientras está afectado, 25% de dar +1 Estrofa.

Mensaje:

```text
Cantas una copla imposible de ignorar. Conejo Acorazado intenta no seguir el ritmo.
```

```text
Conejo Acorazado queda Distraído (3r): -2 Precisión, -1 Evasión.
```

---

## Nivel 3 — Estrofa Creciente

```yaml
id: bardo.estrofa_creciente
name: Estrofa Creciente
class: bardo_cronica_viva
level: 3
type: passive
rules:
  onUseDifferentFamily:
    gain:
      estrofa: 1
  onThirdRepeatedFamily:
    lose:
      estrofa: 1
  estrofaThresholds:
    3: estribillo_activo
```

Efecto:

- usar familias distintas gana Estrofa;
- repetir demasiado baja Estrofa;
- Estrofa 3 activa Estribillo.

---

## Nivel 3 — Sostener Compás

Definido en la sección 5.

---

## Nivel 4 — Canto de Resonancia I

```yaml
id: bardo.canto_resonancia.1
name: Canto de Resonancia I
class: bardo_cronica_viva
level: 4
family: relato
type: exploration_spell
actionType:
  combat: main
  exploration: standard
target: room
cost:
  voz: 10
attributes:
  primary: presencia
  secondary: percepcion
  support: ingenio
skillCheck:
  difficultyFormula: "room.memoryDifficulty || 12"
duration:
  combat: 3
effects:
  applyRoomEffect: resonancia_sala
onSuccess:
  reveal:
    - room.echo
    - room.tension
    - room.soundClue
onStrongSuccess:
  reveal:
    - room.hiddenClue
repercussion:
  onCriticalFailureInDungeon:
    dungeonClock: 1
estrofa:
  gainFamily: relato
```

Efecto:

- fuera de combate revela ecos, tensión o pistas sonoras;
- en combate crea Resonancia de Sala 3r;
- fallo crítico en dungeon puede avanzar reloj de mazmorra.

Mensaje:

```text
Dejas una nota suspendida. La sala tarda un instante en decidir si contesta.
```

---

## Nivel 5 — Himno de la Primera Chapa I

```yaml
id: bardo.himno_primera_chapa.1
name: Himno de la Primera Chapa I
class: bardo_cronica_viva
level: 5
family: himno
type: spell
actionType: main
target: party
cost:
  voz: 18
duration: 3
requirements:
  guildRankAtLeast: cobre
effects:
  apply:
    - id: moral
      stacks: 1
      duration: 3
    - id: himno_primera_chapa
      duration: 3
      threadWeight: 1
      modifiers:
        accuracy: 1
      tags: [bard, himno, morale, buff]
estrofaBonus:
  min: 3
  addModifiers:
    mentalResistance: 1
onSustainedTwice:
  transformTo: himno_asentado
echoOnExpire:
  id: eco_himno_primera_chapa
  condition: sustainedOrHimnoAsentado
estrofa:
  gainFamily: himno
```

Efecto:

- grupo gana Moral x1;
- grupo gana +1 Precisión;
- duración 3r;
- si Estrofa 3: +1 resistencia mental;
- si se sostiene dos veces, deja Eco garantizado.

Mensaje:

```text
Alzas el Himno de la Primera Chapa. No es una leyenda todavía, pero ya suena a comienzo.
```

---

## Nivel 6 — Síncopa Burlona I

```yaml
id: bardo.sincopa_burlona.1
name: Síncopa Burlona I
class: bardo_cronica_viva
level: 6
family: copla
type: spell
actionType: main
target: enemy
cost:
  voz: 15
range: medium
attributes:
  dc: presencia
save:
  type: mental
  difficultyFormula: "10 + presencia + floor(level / 2)"
durationByTarget:
  normal: 2
  elite: 2
  boss: 1
onFailedSave:
  applyEffect: burlado
onCriticalFailure:
  applyToSelf:
    id: expuesto
    duration: 1
harmonyTags:
  - ridicule
estrofa:
  gainFamily: copla
```

Efecto:

- aplica Burlado si el objetivo falla resistencia;
- duración 2r normal/elite, 1r boss;
- con Copla Pegadiza activa, puede activar Armonía de Ridículo.

Mensaje:

```text
Marcas una síncopa insultantemente precisa. Conejo Acorazado entiende poco, pero se ofende mucho.
```

---

## Nivel 7 — Corte de Maelis I

```yaml
id: bardo.corte_maelis.1
name: Corte de Maelis I
class: bardo_cronica_viva
level: 7
family: contraestrofa
type: reaction
trigger:
  enemyStarts:
    tagsAny: [spell, chant, ritual, sonic, mental, verbal]
cost:
  voz: 16
attributes:
  interrupt: "percepcion + presencia"
difficultyFormula: "target.concentration + target.level"
bonusIfTargetHas:
  zumbido: 2
onSuccess:
  reduceActionPowerPercent: 25
  applyEffect:
    id: ritmo_cortado
    duration: 1
onStrongSuccess:
  cancelMinorOrReduceMain: true
onNormalEnemyStrongSuccess:
  cancelMainAction: true
bossPolicy:
  cannotFullyCancelUnlessMechanicAllows: true
  maxPowerReductionPercent: 20
repercussion:
  onFailure:
    noReactionUntilNextRound: true
  onCriticalFailure:
    applyToSelf: voz_quebrada
    duration: 1
estrofa:
  gainFamily: contraestrofa
```

Efecto:

- reacción contra hechizos, rituales, cantos o efectos mentales/verbales;
- éxito reduce potencia 25%;
- éxito fuerte cancela acción menor o reduce acción principal;
- contra boss solo reduce salvo mecánica específica;
- objetivo sufre Ritmo Cortado 1r.

Mensaje:

```text
Cortas el ritmo con la técnica de Maelis.
```

---

## Nivel 8 — Balada de Remiendo I

```yaml
id: bardo.balada_remiendo.1
name: Balada de Remiendo I
class: bardo_cronica_viva
level: 8
family: balada
type: spell
actionType: main
target: ally_or_self
cost:
  voz: 20
duration: 3
attributes:
  healing: presencia
  stability: sabiduria
effects:
  apply:
    - id: balada_remiendo
      duration: 3
      threadWeight: 1
      tickTiming: startOfTargetTurn
      healInitialFormula: "6 + presencia * 0.5"
      healTickFormula: "3 + presencia * 0.25"
      tags: [bard, healing, hot, balada]
estrofaBonus:
  min: 3
  onExpire:
    cleanseOneOf:
      - cansado_leve
      - sangrado_leve
echoOnExpire:
  id: eco_remiendo
  condition: sustained
estrofa:
  gainFamily: balada
```

Efecto:

- cura inicial;
- cura menor al inicio de los siguientes turnos;
- duración 3r;
- Estrofa 3: al expirar limpia Cansado leve o Sangrado leve;
- si fue sostenida, deja Eco de Remiendo.

Mensaje:

```text
Cantas una balada suave, de esas que convencen al cuerpo de seguir entero un poco más.
```

---

## Nivel 9 — Rumor Andante I

```yaml
id: bardo.rumor_andante.1
name: Rumor Andante I
class: bardo_cronica_viva
level: 9
family: relato
type: social_spell
actionType:
  combat: main
  exploration: standard
target:
  combat: intelligent_enemy_or_crowd
  social: npc_or_scene
cost:
  voz: 12
attributes:
  primary: presencia
  secondary: ingenio
duration:
  combat: 3
  social: scene
combatEffect:
  apply:
    id: rumor_sembrado
    duration: 3
    threadWeight: 1
    modifiers:
      socialMentalResistance: -1
    nextCoplaBonus: 1
socialEffect:
  improveTopicDiscovery: true
  revealRumorChance: true
  lowerHostilityMinor: true
repercussion:
  onCriticalFailureSocial:
    createTwistedRumor: true
estrofa:
  gainFamily: relato
```

Efecto social:

- desbloquea topics;
- mejora rumores;
- baja hostilidad leve;
- detecta contradicciones;
- puede abrir rutas de investigación.

Efecto combate:

- contra enemigos inteligentes;
- aplica Rumor Sembrado 3r;
- -1 resistencia social/mental;
- próxima Copla contra ese objetivo gana +1.

Mensaje:

```text
Sueltas el rumor con la forma exacta para que parezca que ya estaba allí.
```

---

## Nivel 10 — Primer Estribillo

```yaml
id: bardo.primer_estribillo
name: Primer Estribillo
class: bardo_cronica_viva
level: 10
type: passive
effects:
  onFirstReachEstrofa3EachCombat:
    restore:
      voz: 8
    temporaryWeaveLimitBonus: 1
    freeMinorSustainOnce: true
  sustainedEffectsLeaveEcho: true
  unlockSkill:
    - bardo.cambiar_hilo.1
```

Efecto:

- primera vez por combate al llegar a Estrofa 3:
  - recupera 8 Voz;
  - Trama +1 hasta fin de combate;
  - obtiene un Sostener Compás menor gratis;
- todo efecto sostenido deja Eco.

Mensaje:

```text
🎶 Primer Estribillo: la Trama se abre. Recuperas 8 Voz y puedes sostener un hilo gratis.
```

---

## Nivel 10 — Cambiar el Hilo

Definido en sección 6.

---

# 11. Bardo niveles 11–19: núcleo avanzado

## Nivel 11 — Nota Cortante II

```yaml
id: bardo.nota_cortante.2
name: Nota Cortante II
level: 11
family: nota
type: spell
actionType: main
target: enemy
cost:
  voz: 15
damage:
  type: sonic
  formula: "10 + presencia * 0.8 + level * 0.7"
bonus:
  ifTargetHasAny: [distraido, burlado, zumbido, fuera_de_compas]
  damageMultiplier: 1.15
onHit:
  chanceEffects:
    - effect: zumbido
      chance: 35
      duration: 2
estrofaBonus:
  min: 3
  effect:
    zumbidoDurationBonus: 1
```

Efecto:

- daño sónico mejorado;
- +15% daño si el enemigo ya tiene un estado bardo relevante;
- 35% de aplicar Zumbido;
- Estrofa 3: Zumbido dura +1 ronda.

Mensaje:

```text
Tu nota encuentra una grieta en el compás enemigo y la ensancha.
```

---

## Nivel 12 — Paso de Liria II

```yaml
id: bardo.paso_liria.2
name: Paso de Liria II
level: 12
family: danza
type: skill
actionType: minor
target: self
cost:
  voz: 12
duration: 2
effects:
  evasion: 3
  initiative: 1
  reposition:
    allowed: [retaguardia, flanco]
cleanseAttempt:
  effects: [pegajoso_leve]
  attribute: destreza
estrofaBonus:
  min: 3
  nextAttackAgainstSelf:
    disadvantageMinor: true
```

Efecto:

- +3 Evasión;
- +1 Iniciativa;
- reposicionamiento entre flanco y retaguardia sin provocar;
- puede limpiar Pegajoso leve con tirada de Destreza;
- Estrofa 3: el próximo ataque contra el Bardo tiene desventaja menor.

Mensaje:

```text
Das el segundo paso de Liria: no huyes, simplemente ya no estás donde el peligro había calculado.
```

---

## Nivel 13 — Copla de Mala Suerte I

```yaml
id: bardo.copla_mala_suerte.1
name: Copla de Mala Suerte I
level: 13
family: copla
type: spell
actionType: main
target: enemy
cost:
  voz: 18
durationByTarget:
  normal: 3
  elite: 2
  boss: 1
save:
  type: mental_or_technical
  difficultyFormula: "10 + presencia + floor(ingenio / 2)"
onFailedSave:
  applyEffect:
    id: mala_suerte
    modifiers:
      critChancePercent: -5
      evasion: -1
    onNextMissOnce:
      bardGain:
        aplauso: 1
bossPolicy:
  critChancePercent: -3
  noAutomaticApplauseUnlessMechanicMiss: true
```

Efecto:

- reduce crítico enemigo;
- reduce evasión;
- el próximo fallo del enemigo puede generar Aplauso;
- contra boss efecto reducido.

Mensaje:

```text
La copla no maldice exactamente. Solo convence al azar de mirar hacia otro lado.
```

---

## Nivel 14 — Himno del Valor Prestado I

```yaml
id: bardo.himno_valor_prestado.1
name: Himno del Valor Prestado I
level: 14
family: himno
type: spell
actionType: main
target: ally_or_small_party
cost:
  voz: 18
duration: 3
effects:
  mentalResistance: 2
  reduceState:
    asustado: 1
ifTargetHas:
  inspirado_leve:
    add:
      accuracy: 1
estrofaBonus:
  min: 3
  cleanseInsteadOfReduce:
    asustado_leve: true
```

Efecto:

- +2 resistencia mental;
- reduce Asustado leve;
- si el objetivo ya está Inspirado, +1 Precisión;
- Estrofa 3: limpia Asustado leve.

Mensaje:

```text
Prestas valor con una melodía sencilla. No es valentía eterna, pero sirve para esta ronda y eso ya es bastante.
```

---

## Nivel 15 — Verso de Fennel I

```yaml
id: bardo.verso_fennel.1
name: Verso de Fennel I
level: 15
family: balada
type: memory_spell
actionType: main
target: ally_self_or_npc
cost:
  aplauso: 1
duration:
  combat: 4
  scene: scene
anchor:
  type: spoken_name
effects:
  apply:
    id: nombre_anclado_menor
    modifiers:
      mentalResistance: 2
      oblivionResistance: 2
      borradoResistance: 2
  reduceFirst:
    confundido_leve: true
repercussion:
  ifUsedAgainstChamberScene:
    chamberAttention: 1
```

Efecto:

- aplica Nombre Anclado menor;
- protege contra miedo, confusión, Olvido y Borrón;
- puede estabilizar NPC o testimonio fuera de combate;
- en escenas de Cámara puede subir Atención.

Mensaje:

```text
Pronuncias el nombre con un verso de Fennel. Por un momento, el mundo tiene menos excusas para olvidarlo.
```

---

## Nivel 16 — Contraestrofa I

```yaml
id: bardo.contraestrofa.1
name: Contraestrofa I
level: 16
family: contraestrofa
type: reaction
trigger:
  allyReceivesEffect:
    tagsAny: [sonic, mental, fear, chant, verbal_magic, minor_memory]
cost:
  voz: 20
attributes:
  reaction: "percepcion + ingenio"
onSuccess:
  reduceDuration: 1
  orReducePowerPercent: 25
onStrongSuccess:
  cancelIfMinor: true
bossPolicy:
  reduceOnlyUnlessMechanicAllows: true
repercussion:
  onFailure:
    loseReactionUntilNextRound: true
```

Efecto:

- reacción defensiva;
- reduce duración o potencia de un efecto mental, sónico, de miedo, canto o memoria menor;
- éxito fuerte cancela efecto leve;
- contra boss reduce.

Mensaje:

```text
Respondes con una contraestrofa precisa y el efecto enemigo pierde parte de su forma.
```

---

## Nivel 17 — Relato Fidedigno I

```yaml
id: bardo.relato_fidedigno.1
name: Relato Fidedigno I
level: 17
family: relato
type: support_cronica
actionType: minor
target: ally_recent_action
cost:
  voz: 16
validRecentActions:
  - critical_hit
  - saved_ally
  - interrupted_boss
  - discovered_clue
  - resisted_major_state
  - protected_npc
onValid:
  bardGain:
    aplauso: 1
  applyToTarget:
    id: inspirado_leve
    duration: 1
onInvalid:
  noEffectButCost: true
```

Efecto:

- convierte una acción notable reciente en Aplauso;
- da Inspirado leve al aliado;
- si se usa sobre acción trivial, falla y gasta Voz.

Mensaje:

```text
Narras el momento antes de que se enfríe. La escena decide que merecía ser recordada.
```

---

## Nivel 18 — Coda Inoportuna I

```yaml
id: bardo.coda_inoportuna.1
name: Coda Inoportuna I
level: 18
family: coda
type: spell
actionType: main
target: enemy
cost:
  voz: 25
requirements:
  estrofaAtLeast: 3
  targetHasAnyEffect: [distraido, burlado, zumbido, mala_suerte]
damage:
  type: sonic
  formula: "14 + presencia * 0.9 + level * 0.8"
effect:
  consumeOneBardDebuff: true
  apply:
    id: expuesto
    duration: 1
bossPolicy:
  exposedReduced:
    nextDamageTakenPercent: 10
    internalCooldownRounds: 3
repercussion:
  onMiss:
    setEstrofa: 0
```

Efecto:

- remate táctico;
- requiere Estrofa 3 y un efecto bardo sobre el objetivo;
- inflige daño sónico;
- consume un debuff bardo;
- aplica Expuesto;
- contra boss aplica versión reducida.

Mensaje:

```text
Cierras la frase donde más molesta. El enemigo descubre demasiado tarde que la canción tenía colmillo.
```

---

## Nivel 19 — Ensayo General

```yaml
id: bardo.ensayo_general
name: Ensayo General
level: 19
type: passive
effects:
  vozMax: 10
  aplausoMax: 1
  ifInstrumentEquippedOnCombatStart:
    gain:
      estrofa: 1
```

Efecto:

- Voz máxima +10;
- Aplauso máximo +1;
- si entra en combate con instrumento equipado, empieza con Estrofa +1.

Mensaje:

```text
Has aprendido a entrar en escena antes de que la escena se dé cuenta.
```

---

# 12. Especializaciones del Bardo al nivel 20

A nivel 20, el Bardo elige una especialización.

## 12.1 Cantor del Alba

Rol:

- curación;
- moral;
- protección;
- claridad emocional.

Rasgo:

```yaml
id: bardo.spec.cantor_alba.voz_calida
name: Voz Cálida
level: 20
effects:
  onHealOrMorale:
    apply:
      id: calor_en_la_voz
      duration: 1
```

**Calor en la Voz**

```yaml
id: calor_en_la_voz
name: Calor en la Voz
type: buff
duration: 1
effects:
  nextHealingReceivedPercent: 10
  ifTargetBelowHpPercent:
    threshold: 30
    nextHealingReceivedPercent: 15
```

Mensaje:

```text
Tu voz deja un calor suave en la escena. La próxima curación sobre el objetivo será más fuerte.
```

---

## 12.2 Maestro del Contrapunto

Rol:

- control;
- interrupción;
- debuffs;
- evasión;
- manipulación de fallos enemigos.

Rasgo:

```yaml
id: bardo.spec.maestro_contrapunto.caos_con_compas
name: Caos con Compás
level: 20
effects:
  variableDebuffsAlwaysUseful: true
  onEnemyWithTwoBardDebuffsMiss:
    gain:
      estrofa: 1
  onEnemyWithThreeBardDebuffsMissOncePerCombat:
    gain:
      aplauso: 1
```

Mensaje:

```text
El caos no se ordena. Se dirige.
```

---

## 12.3 Cronista de Nombres

Rol:

- memoria;
- anti-Borrón;
- investigación;
- Crónica;
- protección de pistas y testimonios.

Rasgo:

```yaml
id: bardo.spec.cronista_nombres.tinta_de_voz
name: Tinta de Voz
level: 20
effects:
  onDiscoverOrSingImportantClue:
    canAnchorClue: true
  onNameEffect:
    reduceThreadWeightFirstNameEffect: true
```

Mensaje:

```text
Algunas palabras no se escriben en papel. Se escriben en quienes las recuerdan.
```

---

# 13. Cantor del Alba, niveles 21–39

## Nivel 21 — Himno de Orencio I

```yaml
id: bardo.cantor.himno_orencio.1
name: Himno de Orencio I
level: 21
family: himno
type: spell
actionType: main
target: party
cost:
  voz: 28
duration: 3
effects:
  healGroupFormula: "8 + presencia * 0.5 + level * 0.3"
  apply:
    - moral:
        stacks: 1
        duration: 3
    - mentalResistance:
        value: 1
        duration: 3
estrofaBonus:
  min: 3
  moraleDurationBonus: 1
```

Efecto:

- cura leve grupal;
- Moral +1;
- +1 resistencia mental;
- Estrofa 3: Moral dura +1 ronda.

Mensaje:

```text
El Himno de Orencio se abre como una campana al amanecer. El grupo recuerda que aún puede levantarse.
```

---

## Nivel 22 — Balada de Remiendo II

Mejora de Balada de Remiendo.

```yaml
id: bardo.balada_remiendo.2
level: 22
cost:
  voz: 24
healInitialFormula: "8 + presencia * 0.6"
healTickFormula: "4 + presencia * 0.3"
duration: 3
```

---

## Nivel 23 — Coro Protector I

```yaml
id: bardo.cantor.coro_protector.1
name: Coro Protector I
level: 23
family: himno
type: spell
actionType: main
target: party
cost:
  aplauso: 1
duration: 2
effects:
  shieldFormula: "8 + presencia * 0.6 + level * 0.4"
  ifWitnessesAtLeast:
    count: 3
    shieldBonusPercent: 20
```

Efecto:

- escudo grupal 2r;
- con testigos suficientes, escudo +20%.

Mensaje:

```text
El coro se cierra alrededor del grupo como una puerta amable.
```

---

## Nivel 24 — Voz Entrenada

```yaml
id: bardo.voz_entrenada
name: Voz Entrenada
level: 24
type: passive
effects:
  vozMax: 20
  vozRegenPerRound: 2
  reduceChanceOfState:
    voz_quebrada: 20
```

---

## Nivel 25 — Nana del Alba Serena I

```yaml
id: bardo.cantor.nana_alba_serena.1
name: Nana del Alba Serena I
level: 25
family: balada
type: reaction
trigger:
  allyHpFallsBelowPercent: 25
cost:
  voz: 30
oncePerTargetPerCombat: true
effects:
  healFormula: "10 + presencia * 0.7 + level * 0.3"
  reduceState:
    - asustado_leve
    - cansado_leve
```

Mensaje:

```text
La nana llega antes que el suelo. El aliado sigue en pie.
```

---

## Nivel 26 — Himno de la Primera Chapa II

```yaml
id: bardo.himno_primera_chapa.2
level: 26
cost:
  voz: 22
duration: 3
effects:
  moralStacks: 1
  accuracy: 2
estrofaBonus:
  mentalResistance: 2
```

---

## Nivel 27 — Estrofa Sostenida

```yaml
id: bardo.estrofa_sostenida
name: Estrofa Sostenida
level: 27
type: passive
effects:
  oncePerCombat:
    preventEstrofaDecayFromInactivity: true
  minimumEstrofaWhileNotSilenced: 1
```

---

## Nivel 28 — Luz ante Testigos I

```yaml
id: bardo.cantor.luz_ante_testigos.1
name: Luz ante Testigos I
level: 28
family: relato
type: social_ritual
actionType:
  combat: main
  social: standard
cost:
  aplauso: 1
target: npc_or_scene
effects:
  social:
    stabilizeFrightenedNpc: true
    improvePublicDefense: true
    protectStatementAgainstMinorTampering: true
  combat:
    targetNpcMentalResistance: 2
    duration: 3
```

Mensaje:

```text
Cantas para los presentes. No todos entienden, pero todos oyen.
```

---

## Nivel 29 — Coro de Viaje I

```yaml
id: bardo.cantor.coro_viaje.1
name: Coro de Viaje I
level: 29
family: himno
type: spell
target: party
cost:
  voz: 30
duration:
  combat: 2
  exploration: scene
effects:
  combat:
    initiative: 1
  exploration:
    reduceFatigue: true
    navigationBonus: 2
    reduceAmbushChance: 10
```

---

## Nivel 30 — Talento: Calor en la Voz

```yaml
id: bardo.cantor.talento_calor_voz
level: 30
type: passive
effects:
  calorEnLaVozAlsoShields:
    shieldFormula: "presencia * 0.4 + level * 0.2"
```

---

## Nivel 31 — Nota Cortante III

```yaml
id: bardo.nota_cortante.3
level: 31
cost:
  voz: 18
damage:
  formula: "16 + presencia * 0.9 + level * 0.8"
onHit:
  applyOrImprove:
    zumbido_2:
      duration: 2
```

---

## Nivel 32 — Himno del Valor Prestado II

```yaml
id: bardo.himno_valor_prestado.2
level: 32
cost:
  voz: 22
duration: 3
effects:
  mentalResistance: 3
  reduceState:
    asustado: 1
    confundido_leve: 1
estrofaBonus:
  cleanse:
    asustado_leve: true
```

---

## Nivel 33 — Copla de Retorno

```yaml
id: bardo.copla_retorno.1
name: Copla de Retorno
level: 33
family: balada
type: spell
actionType: main
target: ally
cost:
  voz: 30
  aplauso: 1
effects:
  reduceOrCleanse:
    - confundido
    - asustado
    - fascinado
    - olvido_menor_leve
  restoreMinorActionIfLostByMentalState: true
```

Mensaje:

```text
Llamas al aliado por el compás correcto. Algo en sus ojos vuelve a encontrar la sala.
```

---

## Nivel 34 — Himno de Orencio II

```yaml
id: bardo.cantor.himno_orencio.2
level: 34
cost:
  voz: 34
effects:
  healGroupFormula: "12 + presencia * 0.65 + level * 0.35"
  moraleStacks: 2
  mentalResistance: 2
duration: 3
```

---

## Nivel 35 — Bendición con Estribillo I

```yaml
id: bardo.cantor.bendicion_estribillo.1
name: Bendición con Estribillo I
level: 35
family: himno
type: spell
actionType: main
target: party
cost:
  estrofa: 3
effects:
  shieldFormula: "10 + presencia * 0.5 + level * 0.3"
  apply:
    - inspirado_leve
    - calor_en_la_voz
afterUse:
  setEstrofa: 0
```

---

## Nivel 36 — Canción de Sala

```yaml
id: bardo.cancion_sala.1
name: Canción de Sala
level: 36
family: relato
type: room_spell
target: room
cost:
  voz: 24
effects:
  dependsOnRoomTags: true
```

Efectos por sala:

| Rasgo | Efecto |
|---|---|
| campanas | bonus contra miedo/sónico |
| cueva | eco ofensivo menor |
| archivo | revelar contradicción |
| capilla | potencia curación |
| taberna | genera Aplauso si hay testigos |
| mazmorra viva | revela reloj/pulso |
| agua | detecta reflejo/ruta |
| campo abierto | mejora moral/movilidad |

---

## Nivel 37 — Nana del Alba Serena II

```yaml
id: bardo.cantor.nana_alba_serena.2
level: 37
trigger:
  allyHpFallsBelowPercent: 35
cost:
  voz: 34
effects:
  healFormula: "14 + presencia * 0.8 + level * 0.35"
  cleanseOneOf:
    - sangrado_leve
    - cansado_leve
```

---

## Nivel 38 — Coro de los Presentes

```yaml
id: bardo.cantor.coro_presentes.1
name: Coro de los Presentes
level: 38
family: himno
type: spell
target: party_and_witnesses
cost:
  aplauso: 2
duration: 3
effects:
  ifWitnessesPresent:
    moraleStacks: 2
    npcMentalResistance: 2
    protectiveActionsGenerateApplause: true
  ifNoWitnesses:
    moraleStacks: 1
```

---

## Nivel 39 — Crónica Compartida

```yaml
id: bardo.cronica_compartida.1
name: Crónica Compartida
level: 39
family: relato
type: spell
target: party
cost:
  aplauso: 2
duration: 2
requires:
  recentNotableAction: true
effects:
  grantBonusBasedOnRememberedFeat: true
```

Bonos posibles:

| Hazaña recordada | Bonus |
|---|---|
| protegió aliado | +defensa |
| hizo crítico | +precisión |
| curó en peligro | +curación recibida |
| descubrió pista | +resistencia mental |
| resistió Borrón | Nombre Anclado menor |
| derrotó elite | +Moral |

---

# 14. Maestro del Contrapunto, niveles 21–39

## Nivel 21 — Contrapunto de Maelis I

```yaml
id: bardo.contrapunto.contrapunto_maelis.1
name: Contrapunto de Maelis I
level: 21
family: contraestrofa
type: spell
target: enemy
cost:
  voz: 24
duration: 3
save:
  type: mental_or_technical
onFailedSave:
  apply:
    id: fuera_de_compas
    modifiers:
      accuracy: -2
      concentration: -2
      preparedSkillFailureRiskPercent: 10
estrofaBonus:
  initiative: -1
```

---

## Nivel 22 — Síncopa Burlona II

```yaml
id: bardo.sincopa_burlona.2
level: 22
cost:
  voz: 18
durationByTarget:
  normal: 3
  elite: 2
  boss: 1
effects:
  burladoAccuracyPenalty: -3
```

---

## Nivel 23 — Traspié de Branno I

```yaml
id: bardo.contrapunto.traspie_branno.1
name: Traspié de Branno I
level: 23
family: copla
type: spell
target: enemy
cost:
  aplauso: 1
effectsByTarget:
  normal:
    loseMinorAction: true
    orApply: ralentizado
  elite:
    apply: ralentizado
  boss:
    initiative: -1
    nextAnnouncedAttackEasierToAvoid: true
```

---

## Nivel 24 — Voz Entrenada

Igual que en Cantor.

---

## Nivel 25 — Paso Sincopado I

```yaml
id: bardo.contrapunto.paso_sincopado.1
name: Paso Sincopado I
level: 25
family: danza
type: skill
target: self
cost:
  voz: 18
duration: 2
effects:
  moveTo: flanco_or_retaguardia
  evasion: 3
onEnemyMissesSelfOncePerCombat:
  gain:
    aplauso: 1
estrofaBonus:
  applyToMissingEnemy:
    distraido: 1
```

---

## Nivel 26 — Copla de Mala Suerte II

```yaml
id: bardo.copla_mala_suerte.2
level: 26
cost:
  voz: 22
durationByTarget:
  normal: 3
  elite: 3
  boss: 1
effects:
  critChancePercent: -7
  evasion: -2
```

---

## Nivel 27 — Estrofa Sostenida

Igual que en Cantor.

---

## Nivel 28 — Risa de Branno I

```yaml
id: bardo.contrapunto.risa_branno.1
name: Risa de Branno I
level: 28
family: copla
type: spell
target: enemies_in_room
cost:
  voz: 28
save:
  type: mental
onFailedSave:
  apply:
    distraido:
      duration: 1
onStrongFailedSave:
  apply:
    initiative: -1
bossPolicy:
  onlyIfAddsOrWitnesses: true
```

---

## Nivel 29 — Contraestrofa Burlona I

```yaml
id: bardo.contrapunto.contraestrofa_burlona.1
name: Contraestrofa Burlona I
level: 29
family: contraestrofa
type: reaction
trigger:
  debuffedEnemyUsesSkill: true
cost:
  voz: 24
onSuccess:
  reducePowerPercent: 25
  gain:
    estrofa: 1
estrofaBonus:
  cancelMinorAction: true
```

---

## Nivel 30 — Talento: Caos con Compás

```yaml
id: bardo.contrapunto.talento_caos_compas
level: 30
type: passive
effects:
  oncePerCombat:
    failedContrapuntoSkillBecomesPartial: true
partialEffects:
  - irritado_leve
  - zumbido
  - initiative: -1
```

---

## Nivel 31 — Nota Cortante III

Igual que común.

---

## Nivel 32 — Paso de Liria III

```yaml
id: bardo.paso_liria.3
level: 32
cost:
  voz: 16
duration: 2
effects:
  evasion: 4
  initiative: 2
  reposition: advanced
echo:
  evasion: 2
```

---

## Nivel 33 — Copla de Retorno

Igual que común.

---

## Nivel 34 — Contrapunto de Maelis II

```yaml
id: bardo.contrapunto.contrapunto_maelis.2
level: 34
cost:
  voz: 30
duration: 3
effects:
  fueraDeCompas:
    accuracy: -3
    concentration: -2
    preparedSkillFailureRiskPercent: 15
estrofaBonus:
  durationBonusNormalTargets: 1
```

---

## Nivel 35 — Fuga del Traspié

```yaml
id: bardo.contrapunto.fuga_traspie.1
name: Fuga del Traspié
level: 35
family: copla
type: spell
target: up_to_3_enemies
cost:
  aplauso: 2
onFailedSave:
  apply:
    ralentizado: 1
    loseMinorActionNextTurn: true
ifTargetAlreadyDistraido:
  apply:
    expuesto: 1
bossPolicy:
  affectsAddsFully: true
  bossOnly:
    initiative: -1
```

---

## Nivel 36 — Canción de Sala

Igual que común.

---

## Nivel 37 — Cadencia Trampa I

```yaml
id: bardo.contrapunto.cadencia_trampa.1
name: Cadencia Trampa I
level: 37
family: coda
type: spell
target: enemy
cost:
  estrofa: 4
duration: 2
effects:
  apply:
    id: cadencia_trampa
    onTargetMiss:
      partyGain:
        aplauso: 1
      applyToTarget:
        expuesto: 1
bossPolicy:
  exposedReduced: true
```

---

## Nivel 38 — Aplauso Desviado I

```yaml
id: bardo.contrapunto.aplauso_desviado.1
name: Aplauso Desviado I
level: 38
family: contraestrofa
type: spell
target: enemy_with_minor_buff
cost:
  aplauso: 1
effects:
  reduceBuff:
    powerPercent: 50
    orDurationRounds: 1
bossPolicy:
  cannotAffectCoreMechanicBuff: true
```

---

## Nivel 39 — Crónica Compartida

Igual que común.

---

# 15. Cronista de Nombres, niveles 21–39

## Nivel 21 — Verso de Nombre Verdadero I

```yaml
id: bardo.cronista.verso_nombre_verdadero.1
name: Verso de Nombre Verdadero I
level: 21
family: balada
type: memory_spell
target: ally_self_or_npc
costOptions:
  - voz: 30
  - aplauso: 1
duration:
  combat: 4
  scene: scene
anchor:
  type: known_name
effects:
  apply:
    id: nombre_anclado
    modifiers:
      mentalResistance: 3
      borradoResistance: 3
      olvidoResistance: 3
      juramentoFalsoResistance: 2
```

Mensaje:

```text
Cantas el nombre como si fuera una puerta cerrándose ante el olvido.
```

---

## Nivel 22 — Verso de Fennel II

```yaml
id: bardo.verso_fennel.2
level: 22
cost:
  aplauso: 1
duration:
  combat: 4
  scene: scene
effects:
  nombreAncladoMenor:
    mentalResistance: 3
    borradoResistance: 3
```

---

## Nivel 23 — Pregunta con Eco I

```yaml
id: bardo.cronista.pregunta_eco.1
name: Pregunta con Eco I
level: 23
family: relato
type: investigation_spell
target: npc_document_or_scene
cost:
  voz: 18
attributes:
  primary: ingenio
  secondary: presencia
  tertiary: percepcion
onSuccess:
  reveal:
    - contradiction
    - hiddenTopic
    - unstableTestimony
onStrongSuccess:
  createClue: true
onFailure:
  increaseSceneTension: 1
```

---

## Nivel 24 — Voz Entrenada

Igual que común.

---

## Nivel 25 — Copla contra el Borrón I

```yaml
id: bardo.cronista.copla_contra_borron.1
name: Copla contra el Borrón I
level: 25
family: balada
type: spell
target: ally_or_small_party
cost:
  voz: 24
duration: 2
effects:
  borradoResistance: 2
  olvidoResistance: 2
  reduceBorradoAccumulation: 1
ifTargetHasNombreAnclado:
  bonusResistance: 1
```

---

## Nivel 26 — Rumor Andante II

```yaml
id: bardo.rumor_andante.2
level: 26
cost:
  voz: 16
effects:
  social:
    improveTopicDiscovery: true
    revealRumorChance: improved
    lowerHostilityMinor: true
    reputationSoftBonus: 1
  combat:
    socialMentalResistance: -2
    nextCoplaBonus: 2
```

---

## Nivel 27 — Estrofa Sostenida

Igual que común.

---

## Nivel 28 — Testigo Improbable I

```yaml
id: bardo.cronista.testigo_improbable.1
name: Testigo Improbable I
level: 28
family: relato
type: crónica_social
target: npc_creature_object_or_room
cost:
  aplauso: 1
duration: scene
effects:
  createTemporaryWitness: true
  memoryActionsBonus: 2
  clueProtectionBonus: 2
  allowRelatoFidedignoForSocialActions: true
```

Mensaje:

```text
Nombras testigo a algo que nadie habría consultado. La escena, incómodamente, acepta.
```

---

## Nivel 29 — Relato Fidedigno II

```yaml
id: bardo.relato_fidedigno.2
level: 29
cost:
  voz: 20
effects:
  canRegisterOutOfCombatNotableAction: true
  ifRegistersClue:
    gain:
      aplauso: 1
  inspiradoDuration: 2
```

---

## Nivel 30 — Talento: Tinta de Voz

```yaml
id: bardo.cronista.talento_tinta_voz
level: 30
type: passive
effects:
  oncePerSceneOnDiscoverClue:
    autoRegisterInCronica: true
    reduceMemoryRepercussion: true
    shareWithPartyAsBonus: true
```

---

## Nivel 31 — Nota Cortante III

Igual que común.

---

## Nivel 32 — Tinta en el Aire I

```yaml
id: bardo.cronista.tinta_aire.1
name: Tinta en el Aire I
level: 32
family: relato
type: ritual_short
target: room_clue_name_document_or_enemy
cost:
  voz: 26
duration:
  combat: 3
  scene: scene
effects:
  markTruthTemporarily: true
  revealHiddenText: true
  protectClue: true
  ifTargetEnemyChamberOrShadow:
    alliesAccuracy: 1
```

---

## Nivel 33 — Copla de Retorno

Igual que común.

---

## Nivel 34 — Verso de Nombre Verdadero II

```yaml
id: bardo.cronista.verso_nombre_verdadero.2
level: 34
costOptions:
  - voz: 36
  - aplauso: 1
effects:
  nombreAnclado:
    mentalResistance: 4
    borradoResistance: 4
    olvidoResistance: 4
ifSpendApplause:
  targetCount: 2
```

---

## Nivel 35 — Balada de Ysolde I

```yaml
id: bardo.cronista.balada_ysolde.1
name: Balada de Ysolde I
level: 35
family: balada
type: anti_chamber_spell
target: party
cost:
  aplauso: 2
duration: 2
effects:
  borradoResistance: 4
  juramentoFalsoResistance: 4
  culpaPrestadaResistance: 4
  onceDuringDuration:
    rerollFailedMemoryResistanceWithPenalty: true
repercussion:
  ifAgainstImportantChamberAgent:
    chamberAttention: 1
```

---

## Nivel 36 — Canción de Sala

Igual que común.

---

## Nivel 37 — Última Nota de Ysolde I

```yaml
id: bardo.cronista.ultima_nota_ysolde.1
name: Última Nota de Ysolde I
level: 37
family: balada
type: emergency_memory_protection
target: ally_or_npc
cost:
  aplauso: 1
  estrofa: 4
limit:
  oncePerLongRestOrMajorArc: true
effects:
  preventModerateMemoryConsequence: true
  preventFinalBorradoStack: true
  stabilizeImportantMemory: true
  preserveClue: true
combatEffect:
  ifIncomingDamageTypeAny: [mental, memory, shadow]
  leaveAtOneHpInsteadOfDefeat: true
```

Mensaje:

```text
La última nota no salva el cuerpo de todo. Pero salva el nombre de desaparecer.
```

---

## Nivel 38 — Refrán Inborrable I

```yaml
id: bardo.cronista.refran_inborrable.1
name: Refrán Inborrable I
level: 38
family: balada
type: spell
target: party
cost:
  estrofa: 4
duration: 2
effects:
  reduceNextMentalOrMemoryDebuff: true
ifUnderCronicaCompartida:
  gain:
    aplauso: 1
```

---

## Nivel 39 — Crónica Compartida

Igual que común.

---

# 16. Pulso de Combate

## Concepto

El **Pulso de Combate** es un sistema reactivo que propone hasta 6 acciones rápidas según:

- estado del jugador;
- recursos;
- grupo;
- enemigos;
- sala;
- Trama;
- Estrofa;
- Aplauso;
- cooldowns;
- conocimiento disponible;
- estado narrativo.

No sustituye comandos clásicos. Los complementa.

El jugador puede escribir:

```text
1
2
usar 4
rapida 3
```

O seguir usando:

```text
cast copla conejo
cast sostener himno
```

---

## Vista básica

```text
Es tu turno.

PV 42/58 · Voz 84/125 · Estrofa 3/5 · Aplauso 1/4 · Trama 3/4

Pulso de Combate:
1) Coda Inoportuna → Conejo Acorazado [remate]
2) Sostener Compás → Himno [mantener]
3) Balada de Remiendo → Tilo [curar]
4) Corte de Maelis [reacción]
5) Paso de Liria [defensa]
6) Canto de Resonancia → sala [entorno]

Escribe 1-6, o un comando.
```

---

## Vista con razones

Comando:

```text
pulso (o p)
```

Salida:

```text
Pulso de Combate

1. Coda Inoportuna → Conejo Acorazado
   Recomendado porque: Conejo Acorazado está Distraído y tienes Estrofa 3.
   Resultado esperado: daño sónico + Expuesto.

2. Sostener Compás → Himno de la Primera Chapa
   Recomendado porque: el Himno expira este turno.
   Resultado esperado: +1 ronda de duración.

3. Balada de Remiendo → Tilo
   Recomendado porque: Tilo está al 38% de vida.
   Resultado esperado: curación durante 3 rondas.
```

---

## Tags reactivos

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
```

---

## Ejemplo YAML reactivo: Coda Inoportuna

```yaml
id: bardo.coda_inoportuna.1
reactive:
  enabled: true
  bucket: offense
  tags: [finisher, exploit_state, damage]
  basePriority: 40
  targetPolicy: enemy
  conditions:
    - id: target_has_bard_debuff
      if:
        targetHasAnyEffect: [distraido, burlado, zumbido, mala_suerte]
      addPriority: 50
      reason: "El objetivo tiene un efecto bardo que puedes convertir en Expuesto."
    - id: player_has_estrofa
      if:
        playerResourceAtLeast:
          estrofa: 3
      addPriority: 30
      reason: "Tienes Estrofa 3 para activar la Coda."
    - id: low_voz
      if:
        playerResourceBelow:
          voz: 20
      addPriority: -20
      reason: "Tu Voz está baja."
```

---

## Ejemplo YAML reactivo: Sostener Compás

```yaml
id: bardo.sostener_compas.1
reactive:
  enabled: true
  bucket: sustain
  tags: [sustain, tactical]
  basePriority: 30
  conditions:
    - if:
        anyOwnBardEffectExpiresThisRound: true
      addPriority: 60
      reason: "Uno de tus efectos expira este turno."
    - if:
        activeHarmonyWouldBreak: true
      addPriority: 40
      reason: "Mantener este hilo conserva una Armonía."
    - if:
        playerResourceBelow:
          voz: 10
      unavailable: true
```

---

## Ejemplo: enemigo Desestabilizado

Estado genérico:

```yaml
id: desestabilizado
name: Desestabilizado
type: debuff
duration: 2
modifiers:
  knockdownResistance: -3
  evasion: -1
tags: [physical, setup, vulnerable_to_knockdown]
```

Skill que lo explota:

```yaml
id: monje.barrido_campana.1
name: Barrido de Campana I
reactive:
  tags: [exploit_state, knockdown, control]
  priorityBase: 35
  conditions:
    - ifTargetHasTag: vulnerable_to_knockdown
      addPriority: 60
      reason: "El enemigo está desestabilizado: puedes intentar derribarlo."
    - ifTargetIsBoss:
      addPriority: -30
      reason: "Contra jefes solo causará Stagger."
```

Sugerencia:

```text
2. Barrido de Campana → Bandido Nervioso
   El enemigo está Desestabilizado. Alta probabilidad de Derribarlo.
```

Contra boss:

```text
2. Barrido de Campana → Masa Madre Menor
   El boss está Desestabilizado. No caerá, pero puedes causarle Stagger.
```

---

## Servicio JS sugerido

```js
class ReactiveSkillService {
  suggest(actor, combat, limit = 6) {
    const knownSkills = actor.skills.getAvailable();
    const context = this.buildContext(actor, combat);

    return knownSkills
      .map(skill => this.scoreSkill(skill, context))
      .filter(s => s.available)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  scoreSkill(skill, context) {
    let score = skill.reactive?.basePriority ?? 0;
    const reasons = [];

    for (const condition of skill.reactive?.conditions ?? []) {
      const result = this.evaluateCondition(condition, context);

      if (result.unavailable) {
        return { skill, available: false };
      }

      if (result.matches) {
        score += condition.addPriority ?? 0;
        if (condition.reason) reasons.push(condition.reason);
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

---

## Diversidad de sugerencias

Evitar que el Pulso proponga 6 ataques iguales.

Buckets sugeridos:

```js
const buckets = {
  offense: 2,
  defense: 2,
  sustain: 1,
  utility: 1,
  environment: 1
};
```

Reglas:

- máximo 2 ofensivas puras;
- máximo 2 defensivas/soporte;
- máximo 1 mantenimiento;
- máximo 1 entorno;
- si Voz baja, al menos 1 opción barata;
- si aliado está en peligro, al menos 1 opción defensiva si existe.

---

## Aperturas del Bardo

Al entrar en combate, Pulso prioriza aperturas.

| Apertura | Cuándo se propone |
|---|---|
| Himno de la Primera Chapa | grupo presente o combate largo |
| Copla Pegadiza | enemigo fuerte con buena precisión |
| Paso de Liria | Bardo en peligro o solo play |
| Canto de Resonancia | sala con rasgo útil o dungeon |
| Nota Cortante | enemigo débil/rematable |
| Rumor Andante | humanoides/social |

Ejemplo:

```text
Comienza el combate.

Aperturas sugeridas:
1. Himno de la Primera Chapa — preparar al grupo
2. Copla Pegadiza — debilitar al enemigo más peligroso
3. Canto de Resonancia — leer la sala
4. Paso de Liria — protegerte
5. Nota Cortante — daño rápido
6. Rumor Andante — sembrar duda social
```

---

## Modos de Pulso

Comandos:

```text
pulso modo tactico
pulso modo ofensivo
pulso modo defensivo
pulso modo soporte
pulso modo explorador
pulso modo manual
```

| Modo | Comportamiento |
|---|---|
| táctico | balanceado |
| ofensivo | prioriza daño y remates |
| defensivo | prioriza sobrevivir |
| soporte | prioriza grupo |
| explorador | prioriza entorno y utilidad |
| manual | solo muestra sugerencias al usar `pulso` |

---

## Conocimiento limitado

El sistema no debe sugerir lo que el personaje no sabe.

Reglas:

- si no ve que el enemigo prepara conjuro, no sugiere Corte de Maelis;
- si no detectó trampa, no sugiere desactivarla;
- si la sala no fue leída, no muestra interacción secreta;
- si el enemigo oculta un estado, no se explota.

```yaml
reactive:
  requiresKnowledge:
    - target.intentVisible
```

---

# 17. Datos mínimos a guardar

## Estado del Bardo en Player

```yaml
bardState:
  voz: 84
  estrofa: 2
  aplauso: 1
  tramaMax: 3
  lastFamilyUsed: copla
  repeatedFamilyCount: 1
  freeSustainAvailable: false
```

## Instancia de efecto

```yaml
effectInstance:
  id: copla_pegadiza
  sourceSkillId: bardo.copla_pegadiza.1
  sourcePlayerId: player_123
  targetId: npc_conejo_01
  duration: 3
  sustainedCount: 0
  threadWeight: 1
  canEcho: true
  family: copla
  tags: [bard, debuff, mental]
```

## Efecto temporal en sala

```yaml
roomTemporaryEffects:
  - id: resonancia_sala
    sourcePlayerId: player_123
    duration: 3
    revealed:
      - clue_trampilla_ritmo_hueco
```

---

# 18. Comandos sugeridos

```text
cast nota conejo
cast copla conejo
cast himno
cast sostener himno
cast sostener copla
cast cambiar_hilo copla
pulso (o p)
pulso modo tactico (o p modo tactico)
pulso modo manual
```

Atajos:

```text
1
2
3
usar 4
rapida 2
```

---

# 19. Checklist de implementación

1. Añadir recursos `voz`, `estrofa`, `aplauso`.
2. Añadir `bardState`.
3. Añadir límite de Trama.
4. Extender `EffectsManager`:
   - duración,
   - modificadores,
   - ticks,
   - sustainCount,
   - threadWeight,
   - echoOnExpire,
   - sourceSkillId.
5. Añadir armonías.
6. Añadir comandos:
   - `sostener`,
   - `cambiar_hilo`,
   - `pulso`.
7. Añadir servicio `ReactiveSkillService`.
8. Añadir buckets de sugerencias.
9. Añadir vista compacta y extendida de Pulso.
10. Añadir soporte de efectos de sala.
11. Añadir restricciones de conocimiento.
12. Añadir logs claros al jugador.
13. Añadir YAML inicial de Bardo 1–39.
14. Añadir tests:
   - Estrofa sube correctamente.
   - Trama limita efectos.
   - Sostener aumenta duración.
   - Ecos aparecen.
   - Armonía de Ridículo se activa.
   - Pulso propone Coda si enemigo está Distraído.
   - Pulso no propone Corte si no detecta preparación.

---

# 20. Resumen final

El Bardo de Crónica Viva queda definido como una clase táctica de soporte, control, memoria y manipulación de escena.

Su bucle principal:

1. abrir con un efecto de preparación;
2. aplicar debuff o buff;
3. sostener la Trama;
4. activar Armonías;
5. generar Estrofa/Aplauso;
6. convertir efectos en Coda, Crónica o protección;
7. usar Pulso de Combate para leer opciones reactivas.

La frase de diseño:

> El Bardo no lanza canciones. Mantiene varias versiones posibles de la escena hasta que una de ellas se vuelve verdad.


---

# 21. NotableActionBuffer

## 21.1 Problema que resuelve

Varias habilidades bardas no deben depender de una intuición narrativa vaga. Necesitan eventos concretos emitidos por el motor.

Ejemplos:

- `Relato Fidedigno` necesita saber si un aliado hizo algo notable.
- `Crónica Compartida` necesita recuperar hazañas recientes.
- `Testigo Improbable` necesita convertir una escena en fuente de evidencia.
- `Tinta de Voz` necesita proteger pistas reales, no texto suelto.

Por tanto, el motor debe tener un buffer temporal de acciones notables.

## 21.2 Estructura de evento

```yaml
notableAction:
  id: notable_20260506_000123
  type: critical_hit
  actorId: player_tilo
  sourceId: player_tilo
  targetId: mob_conejo_01
  sceneId: combat_778
  roomId: campo_norte_sendero_01
  round: 4
  timestamp: 2026-05-06T10:25:00Z
  importance: minor
  tags:
    - combat
    - ally
    - physical
  consumedBy:
    - player_bardo_jorge
  expiresInRounds: 3
  expiresAtSceneEnd: true
  text:
    short: "Tilo detuvo la carga del conejo."
    bardic: "Tilo plantó los pies y el conejo descubrió la burocracia del muro."
```

## 21.3 Tipos iniciales de acciones notables

| Tipo | Emisor | Uso bardo |
|---|---|---|
| `critical_hit` | CombatManager | Aplauso, Relato Fidedigno |
| `saved_ally` | CombatManager | Relato Fidedigno, Crónica Compartida |
| `interrupted_major_action` | CombatManager | Aplauso, Corte de Maelis |
| `resisted_memory_effect` | EffectsManager | Cronista, Armonía de Nombre |
| `protected_name` | ChronicleManager | Aplauso, Crónica |
| `discovered_clue` | DiscoveryManager | Tinta de Voz, Relato Fidedigno |
| `stabilized_npc` | NPCManager | Cantor, Crónica |
| `environment_exploit` | CombatManager/RoomManager | Pulso, Canto de Resonancia |
| `boss_mechanic_resolved` | CombatManager | Aplauso, Crónica Compartida |

## 21.4 Vida útil del evento

Recomendación inicial:

- eventos de combate menor: 3 rondas;
- eventos de boss: hasta final de fase;
- pistas descubiertas: escena completa;
- nombres protegidos: escena completa o persistente si la quest lo marca;
- eventos consumidos: pueden seguir visibles, pero no generar Aplauso dos veces salvo regla especial.

```yaml
notableActionPolicy:
  combatMinorRounds: 3
  bossPhase: true
  clueSceneDuration: true
  preventDuplicateApplause: true
```

## 21.5 Mensajes al jugador

Cuando se registra una acción notable:

```text
La Crónica toma nota: Tilo ha frenado la carga del Conejo Acorazado.
```

Cuando el Bardo puede usarla:

```text
Pulso detecta una hazaña reciente: Relato Fidedigno puede convertirla en Aplauso.
```

---

# 22. Interacción exacta de Voz Quebrada, Voz y Aplauso

## 22.1 Regla oficial

`Voz Quebrada` afecta a habilidades que gastan Voz o usan la voz como canal principal. No bloquea automáticamente habilidades que cuestan Aplauso.

```yaml
id: voz_quebrada
name: Voz Quebrada
effects:
  voiceCostMultiplier: 1.25
  voiceDcPenalty: -1
  cannotUseTags:
    - vocal_overstrain
unaffectedResources:
  - aplauso
```

## 22.2 Habilidades con Aplauso

Si una habilidad cuesta solo Aplauso:

- puede usarse con Voz Quebrada;
- recibe penalización solo si también tiene tag `voice_required`;
- si representa gesto, presencia o Crónica pura, no se penaliza.

Ejemplo:

```yaml
skill:
  id: bardo.cantor.coro_protector.1
  cost:
    aplauso: 1
  tags: [bard, protection, applause]
  affectedByVozQuebrada: false
```

Ejemplo contrario:

```yaml
skill:
  id: bardo.cronista.balada_ysolde.1
  cost:
    aplauso: 2
  tags: [bard, voice_required, memory]
  affectedByVozQuebrada:
    dcPenalty: -1
```

## 22.3 Mensaje

```text
Tu Voz está quebrada: las canciones que gasten Voz costarán más y serán menos estables. Tus recursos de Aplauso siguen disponibles.
```

---

# 23. Efectos purgados, resistidos o eliminados por boss

## 23.1 Efecto resistido al lanzamiento

Si el objetivo resiste una habilidad:

- no se crea hilo de Trama;
- no puede sostenerse;
- puede aplicar efecto parcial si la skill lo declara, por ejemplo `irritado_leve`.

```yaml
onSuccessfulSave:
  noThreadCreated: true
  applyPartialEffect: irritado_leve
```

## 23.2 Efecto purgado después de aplicado

Si un efecto bardo activo es purgado:

- se libera su hilo de Trama inmediatamente;
- no deja Eco, salvo que tenga `echoOnPurge: true`;
- se notifica al Bardo;
- las Armonías dependientes se recalculan.

```yaml
onPurge:
  releaseThread: true
  echoAllowed: false
  recalculateHarmonies: true
```

Mensaje:

```text
El efecto Copla Pegadiza se rompe antes de cerrar la frase. El hilo vuelve a tu Trama.
```

## 23.3 Purgado por mecánica de boss

Un boss puede tener reglas especiales:

```yaml
bossEffectPolicy:
  purgesBardEffectsAtPhaseChange: true
  bardEffectsLeaveEchoOnPhaseChange: false
  compensateBard:
    gainEstrofaIfSustainedEffectPurged: 1
```

Recomendación de balance:

- si el boss purga un efecto sostenido, el Bardo gana +1 Estrofa una vez por fase;
- si purga todo sin compensación, debe haber aviso previo;
- Pulso debe sugerir no invertir más hilos antes de una purga anunciada.

Mensaje:

```text
El Conejo Acorazado sacude sus placas. La Copla se rompe, pero alcanzas a rescatar un fragmento del compás. Estrofa +1.
```

---

# 24. Interfaz del Bardo por niveles de detalle

## 24.1 Vista compacta, por defecto

```text
PV 42/58 · Voz 84/125 · 🎶2 · 👏1 · Trama 3/4
```

Significado:

- `🎶2`: Estrofa 2.
- `👏1`: Aplauso 1.
- `Trama 3/4`: tres hilos activos de cuatro posibles.

## 24.2 Vista táctica

Comando:

```text
estado bardo
```

Salida:

```text
Bardo de Crónica Viva
Voz: 84/125
Estrofa: 2/5
Aplauso: 1/4
Trama: 3/4

Hilos:
1. Himno de la Primera Chapa, grupo, 2r
2. Copla Pegadiza, Conejo Acorazado, 2r
3. Balada de Remiendo, Tilo, 3r

Armonías:
- Ninguna activa.
- Armonía de Ridículo disponible si aplicas Síncopa Burlona al Conejo Acorazado.
```

## 24.3 Vista depuración/admin

Comando:

```text
barddebug
```

Salida:

```text
lastFamilyUsed: copla
repeatedFamilyCount: 1
freeSustainAvailable: false
primerEstribilloUsed: true
notableActionsAvailable: 2
reactiveMode: tactico
```

---

# 25. Pulso de Combate: heurístico ahora, aprendizaje después

## 25.1 Regla oficial de MVP

`Pulso de Combate` debe ser determinista al inicio.

No usa IA generativa en combate. No aprende todavía. No hace llamadas externas. No decide por el jugador.

```yaml
pulsoPolicy:
  mode: deterministic_heuristic
  maxSuggestionsMvp: 3
  maxSuggestionsFull: 6
  noExternalAiDuringCombat: true
  playerChoiceRequired: true
```

## 25.2 Futuro aprendizaje de preferencias

En una fase posterior, Pulso puede ajustar pesos según preferencias del jugador, pero de forma local y transparente.

Ejemplo:

```yaml
playerReactivePreferences:
  preferredBuckets:
    support: 1.15
    offense: 0.95
  ignoredSkills:
    - bardo.rumor_andante.1
  pinnedSkills:
    - bardo.sostener_compas.1
```

Reglas:

- nunca debe ocultar acciones críticas por preferencia;
- el jugador puede resetear preferencias;
- el modo `manual` desactiva sugerencias automáticas;
- el modo `tactico` ignora preferencias excesivas si hay peligro claro.

Comandos:

```text
pulso preferencias
pulso fijar sostener
pulso ignorar rumor
pulso reset
```

---

# 26. Rendimiento de ReactiveSkillService

## 26.1 Riesgo

Evaluar muchas condiciones por turno puede añadir latencia si todas las clases usan Pulso y hay muchos efectos activos.

## 26.2 Reglas de rendimiento

- Evaluar solo skills aprendidas y disponibles.
- Precalcular contexto del turno una vez.
- Usar índices por tags de estado.
- Limitar sugerencias a 3 en MVP, 6 en versión completa.
- Cachear resultado hasta que cambie el contexto relevante.
- Invalidar cache al aplicar efecto, gastar recurso, cambiar objetivo, cambiar sala o avanzar ronda.

```yaml
reactivePerformancePolicy:
  mvpMaxSuggestions: 3
  fullMaxSuggestions: 6
  cachePerActorTurn: true
  invalidateOn:
    - resourceChanged
    - effectApplied
    - effectExpired
    - targetChanged
    - roomChanged
    - roundAdvanced
```

## 26.3 Presupuesto recomendado

```yaml
reactiveBudget:
  maxEvaluatedSkillsPerTurn: 24
  maxConditionsPerSkill: 8
  targetEvaluationTimeMs: 5
  hardLimitMs: 20
```

Si se supera el límite:

```text
Pulso ofrece sugerencias básicas este turno.
```

---

# 27. Limpieza de Trama y efectos al morir o salir

## 27.1 Al morir el Bardo

- todos sus hilos activos se marcan como `sourceInactive`;
- buffs normales expiran al final de ronda;
- efectos de memoria pueden persistir si tienen `persistentAnchor`;
- efectos de sala se eliminan salvo que una skill diga lo contrario;
- Armonías se recalculan;
- Pulso queda desactivado.

```yaml
onSourceDefeated:
  bardEffects:
    normalBuffsExpire: endOfRound
    debuffsExpire: endOfRound
    roomEffectsExpire: immediate
    memoryAnchorsPersistIf: persistentAnchor
  recalculateHarmonies: true
```

Mensaje:

```text
Al caer el Bardo, varios hilos de la Trama se aflojan y desaparecen.
```

## 27.2 Al desconectarse

En combate multijugador:

- aplicar acción por defecto configurada;
- no lanzar nuevas canciones;
- mantener efectos activos hasta expirar naturalmente;
- no permitir Sostener automático salvo macro explícita.

## 27.3 Al abandonar combate

- efectos de combate expiran;
- efectos de escena pueden continuar si tienen `duration: scene`;
- efectos persistentes deben registrarse en Crónica o WorldState.

---

# 28. Cronista de Nombres en zonas sin pistas

## 28.1 Riesgo

La especialización Cronista puede sentirse débil en zonas de grindeo si no hay pistas, NPCs o memoria alterada.

## 28.2 Solución

Dar usos de combate y exploración generales a sus herramientas.

### Usos alternativos

| Skill | En contenido narrativo | En combate puro |
|---|---|---|
| Pregunta con Eco | revela contradicción | identifica patrón enemigo |
| Tinta en el Aire | protege pista | marca enemigo, +1 precisión aliada |
| Copla contra el Borrón | anti-memoria | resistencia mental genérica |
| Testigo Improbable | crea testigo | convierte sala u objeto en anclaje menor |
| Verso de Nombre Verdadero | protege nombre | resistencia mental y anti-control |
| Balada de Ysolde | anti-Cámara | defensa contra miedo, sombra o memoria |

## 28.3 Regla de fallback

```yaml
cronistaFallbackPolicy:
  ifNoCluesInArea:
    preguntaEcoCanRevealEnemyPattern: true
    tintaAireCanMarkEnemy: true
    testigoImprobableCanAnchorRoom: true
```

Mensaje:

```text
No hay una pista clara, pero el patrón del enemigo deja eco suficiente para estudiarlo.
```

---

# 29. MVP revisado del Bardo

## 29.1 MVP mínimo recomendado

Implementar primero:

- Bardo niveles 1-5.
- Voz.
- Estrofa.
- Trama básica de 3 hilos.
- Sin Aplauso todavía, salvo placeholder visible en ficha.
- Sin Ecos complejos.
- Sin Armonías complejas.
- Pulso con 3 sugerencias.
- Estados básicos: `zumbido`, `distraido`, `moral`, `paso_liria`, `resonancia_sala`.

## 29.2 Skills MVP

- `Nota Cortante I`
- `Paso de Liria I`
- `Copla Pegadiza I`
- `Estrofa Creciente`
- `Sostener Compás`
- `Canto de Resonancia I`
- `Himno de la Primera Chapa I`

## 29.3 Pulso MVP

```yaml
pulsoMvp:
  suggestions: 3
  modes:
    - tactico
    - manual
  buckets:
    - offense
    - sustain
    - support
```

Vista:

```text
Pulso de Combate:
1) Copla Pegadiza → Conejo Acorazado [control]
2) Himno de la Primera Chapa [soporte]
3) Paso de Liria [defensa]
```

## 29.4 Pruebas mínimas MVP

- Estrofa sube al cambiar familia.
- Trama impide cuarto hilo antes de nivel 10.
- Sostener Compás aumenta duración.
- Pulso propone Himno si no hay buff grupal.
- Pulso propone Copla si enemigo tiene alta precisión.
- Canto de Resonancia detecta al menos un rasgo de sala.

---

# 30. Ajuste de checklist derivado de esta revisión

La checklist técnica debe priorizar ahora estas piezas antes de implementar todo el Bardo 1-39:

1. `NotableActionBuffer` básico.
2. `bardState` mínimo.
3. `EffectInstance` con `sourceSkillId`, `threadWeight` y `sustainedCount`.
4. Trama básica.
5. `Sostener Compás` básico.
6. `Pulso de Combate` con 3 sugerencias.
7. UI compacta.
8. Limpieza de efectos por muerte/salida.
9. Solo después: Aplauso, Ecos, Armonías avanzadas y especializaciones.
