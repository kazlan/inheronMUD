# Manual de Creación de Contenido - InheronMUD

El motor de InheronMUD funciona con un sistema reactivo y dinámico impulsado por archivos YAML (`/data/areas/<nombre_area>/...`). Este sistema permite crear contenido complejo (puzles, estados alterados, IA específica) sin tocar el código fuente, utilizando los metadatos y el sistema de Efectos (`EffectsManager`).

---

## 1. Salas y Escenario Interactivo (`rooms.yml`)

Las salas no son simples descripciones estáticas. Pueden contener *Scenery* (escenario) complejo y puertas bloqueadas.

```yaml
- id: mi_sala
  name: Sala de Pruebas
  description: Una sala húmeda. En el centro hay un enorme altar de piedra y una vieja palanca oxidada en la pared.
  scenery:
    altar: "Un altar dedicado a los dioses antiguos. Parece inamovible."
    palanca:
      description: "Una palanca de hierro cubierta de óxido."
      interactions:
        action: "unlock_exit"
        target: "north"
        verbs: ["tirar", "pull", "bajar"]
        message: "Tiras de la palanca con todas tus fuerzas. Se escucha el rechinar de piedra deslizándose al norte."
  exits:
    - direction: north
      targetRoomId: sala_secreta
      locked: true
```

### Opciones de Scenery:
*   **Simple:** Define el nombre clave (ej. `altar`) y proporciona un string. Será visible al hacer `mirar altar`.
*   **Complejo (Interactivo):** 
    *   `description`: Lo que ves al examinarlo.
    *   `interactions`: Activa la interactividad con el comando `usar` (o `interact`).
    *   `verbs`: Define una lista de alias exclusivos (ej. `empujar`, `jugar`, `tirar`). Si el jugador escribe `tirar palanca`, activará el objeto. Si escribe `empujar palanca`, fallará.
    *   `action`: La acción que dispara. Actualmente soportado: `unlock_exit` (desbloquea una puerta) o `message` (solo muestra texto emotivo).
    *   `target`: La dirección de la salida afectada (`north`, `south`, `up`, etc.).

---

## 2. NPCs y Criaturas (`npcs.yml`)

Los NPCs y monstruos tienen atributos avanzados que dictan su comportamiento y capacidades pasivas.

```yaml
- id: jefe_mutante
  name: Jefe Mutante
  description: Una bestia retorcida rebosante de magia residual.
  behaviorId: hostile_boss
  roomId: mi_sala
  level: 10
  flags: ['agresivo', 'social', 'healer']
  effects:
    - id: regeneracion_mutante
      name: Regeneración Mutante
      type: heal
      magnitude: 5
      tickInterval: 5000
  inventory: ['item_llave_secreta', 'item_espada_magica']
  equipment:
    right_hand: item_espada_magica
  stats:
    fuerza: 20
    destreza: 15
    constitucion: 18
```

### Campos Importantes:
*   `behaviorId`: Define la rutina de IA (ej. `hostile_boss`, `merchant`, `wander`).
*   `flags`:
    *   `agresivo`: Ataca automáticamente al jugador.
    *   `social`: Puede agruparse con otros NPCs similares, se defienden entre sí.
    *   `healer`: Si el NPC está inactivo, curará automáticamente a cualquier jugador herido en la misma sala.
*   `effects`: El motor permite asignar efectos pasivos a los NPCs. En el ejemplo, el jefe se cura 5 PV cada 5 segundos de combate.
*   `metadata.merchant`: Si es `true`, el NPC venderá el contenido de su `inventory`.
*   `metadata.wanderTime`: (Solo para flag `wandering`). Define el tiempo base en segundos que tarda en deambular de una sala a otra. Por defecto es 60s. Valores bajos hacen NPCs escurridizos (ej. 15s), valores altos (ej. 120s) hacen NPCs muy lentos.
*   `metadata.patrolTime`: (Solo para flag `patrol`). Define el tiempo base en segundos entre movimientos de su ruta de patrulla. Por defecto es 30s.
*   `metadata.patrolMsgLeave`: (Solo para flag `patrol`). Mensaje que se muestra en la sala al irse (ej: `"Silas el mercader sale de la posada"`).
*   `metadata.patrolMsgArrive`: (Solo para flag `patrol`). Mensaje que se muestra en la sala de destino al entrar (ej: `"Silas el mercader entra en la plaza"`).
*   `enemies`: Lista de IDs (o base IDs) de otros NPCs a los que considera enemigos naturales.
*   `metadata.enemyReactions`: Array opcional de 3 números `[ignorar, gruñir, atacar]` sumando 100%. Dicta la probabilidad de reacción cuando se cruza con un enemigo de su lista `enemies`. Por defecto es `[50, 40, 10]`.

---

## 3. Objetos y Consumibles Mágicos (`items.yml`)

Los objetos ahora pueden ser completamente funcionales con modificadores persistentes, cargas mágicas y efectos de sanación.

```yaml
- id: item_varita_fuego
  name: Varita de Cenizas
  description: Una rama chamuscada que irradia un calor antinatural.
  type: CONSUMABLE
  value: 500
  metadata:
    charges: 3
    effects:
      - id: aura_poder
        name: Poder Ígneo
        type: heal  # o un buff persistente futuro
        magnitude: 30
        message: "<red>Sientes el poder del fuego restañando tus heridas.</red>"

- id: item_pocion_salud
  name: Poción Menor de Salud
  description: Un frasco con un líquido rojo brillante.
  type: CONSUMABLE
  value: 50
```

### Reglas de Objetos:
*   **Consumibles Simples:** Si un objeto es `type: CONSUMABLE` y tiene `value: 50`, al `usar pocion` curará 50 PV y desaparecerá del inventario.
*   **Objetos con Cargas:** Usa `metadata.charges`. Al usar el objeto (`usar varita`), se gasta 1 carga y aplica los `effects` descritos al jugador. Si las cargas llegan a 0, el objeto mostrará un mensaje de desintegración y desaparecerá.
*   **Efectos Persistentes (Equipo):** Si un objeto es armadura o arma y tiene `effects` (por ejemplo, un tick de regeneración), el motor **solo** aplicará dicho efecto al jugador/NPC mientras lo lleve **equipado**.

---

## 4. Efectos de Zona (Rooms)

Al igual que a los NPCs, puedes añadir auras/efectos persistentes a las salas.

```yaml
- id: cueva_oscura
  name: Cueva del Terror
  effects:
    - id: oscuridad
      type: oscuridad
```
Si una sala posee el efecto `oscuridad`, el comando `look` se bloqueará y mostrará un mensaje de que no se ve nada, a menos que el jugador lleve en su inventario un objeto que tenga `metadata.lightSource: true`.

---

## 5. Spawners (`spawners.yml`)

El ciclo de vida del mundo está regido por los *spawners*. Definen cuántos NPCs existen, dónde nacen y con qué frecuencia reaparecen.

```yaml
- id: spawner_jefe_mutante
  npcId: jefe_mutante
  roomId: mi_sala
  maxCount: 1
  respawnTime: 300
```
*   `respawnTime`: Expresado en segundos. Si es un Boss (`hostile_boss`), su valor suele ser alto (ej. 300 = 5 minutos). Para NPCs comunes suele ser 60 o 120.

---

## 6. Confinamiento de Zonas (Áreas)

Las salas definidas dentro de `data/areas/<nombre_area>/rooms.yml` heredan automáticamente `<nombre_area>` como su atributo `areaId`. 
* Todo NPC o *spawner* colocado en esas salas heredará también este `areaId`.
* **Wandering Confinado**: El motor de IA restringe el movimiento aleatorio de los NPCs (wandering) para que nunca salgan de las salas que compartan su mismo `areaId`. No necesitas configurar manualmente barreras o tags especiales para evitar que los monstruos del prado invadan un poblado adyacente; el sistema de áreas los confina automáticamente.
