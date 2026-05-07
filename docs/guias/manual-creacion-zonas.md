# 🗺️ Manual Maestro: Creación de Zonas en InheronMUD

Este manual proporciona todas las herramientas y estándares necesarios para que cualquier colaborador sea capaz de diseñar, implementar y balancear una zona completa desde cero.

---

## 1. Organización de Archivos
Cada zona vive en su propio subdirectorio dentro de `packages/engine/data/areas/<nombre_zona>/`.
Para que la zona sea funcional, debe contener los siguientes archivos YAML:

- `rooms.yml`: Definición del mapa y la atmósfera.
- `npcs.yml`: Habitantes, mercaderes y monstruos.
- `items.yml`: Equipamiento, consumibles y objetos de misión.
- `spawners.yml`: Lógica de regeneración de enemigos.

> [!IMPORTANT]
> El motor hereda automáticamente el `areaId` del nombre de la carpeta. No es necesario etiquetar cada sala manualmente.

---

## 2. Diseño de Salas (`rooms.yml`)
La sala es el bloque básico de construcción. Debe seguir la **Regla de los Tres Sentidos** (Vista, Oído, Olfato/Tacto).

### Esquema Básico
```yaml
- id: mi_zona_plaza
  name: Plaza del Sol Radiante
  description: El sol brilla intensamente (Vista)... El aire huele a jazmín (Olfato)... El murmullo de la fuente es constante (Oído).
  scenery:
    fuente: Una fuente de mármol con agua cristalina. # Permite 'mirar fuente'
  exits:
    - direction: north
      targetRoomId: mi_zona_bosque
  effects: # Opcional: Buffs/Debuffs de área
    - id: aura_paz
      type: heal
      magnitude: 2
      tickInterval: 10000
      message: "Sientes una paz profunda."
```

### Tips de Diseño
- **Hub-and-Spoke:** Crea un punto central seguro y ramifica los peligros desde allí.
- **Salas Seguras:** Para poblados o tabernas, incluye `safe: true` dentro de `metadata`. Esto bloquea por completo que los monstruos (`behaviorId: hostile_beast`) con el flag `wandering` puedan acceder a la sala por accidente, aunque compartan la misma zona o `areaId`.
- **Interacciones:** Usa la propiedad `interactions` en `scenery` para mensajes personalizados al usar verbos como `tocar`, `empujar` o `sentarse`.

---

## 3. Habitantes y Mobs (`npcs.yml`)
Los NPCs se dividen en **Sociales** (Interactuables/Mercaderes) y **Hostiles** (Monstruos).

### Mercader o NPC de Misión
```yaml
- id: npc_mercader_test
  name: Silas el Buhonero
  behaviorId: idle
  roomId: mi_zona_plaza
  flags: ['social']
  metadata:
    raceId: humano_altherion
    merchant: true
    ambientMessages:
      - "limpia el mostrador tranquilamente."
      - "organiza las pociones por color."
    greetings:
      - "{npc} te ofrece sus mejores mercancías, {player}."
    inventory: ['item_pocion_vida', 'item_espada_test']
    dialogues:
      - requires_not_flag: mision_aceptada
        text: "¿Podrías ayudarme con esos lobos?"
        set_flag: mision_aceptada
      - text: "Ten cuidado, forastero."

> [!TIP]
> **Vida y Atmósfera:** Usa `ambientMessages` y `greetings` bajo `metadata` para dar vida a tus NPCs sociales. 
> - **`ambientMessages`**: Son rutinas periódicas. Escríbelas asumiendo que el motor pondrá el nombre del NPC delante automáticamente. (Ej: `"limpia el mostrador."` se leerá como `"Silas el Buhonero limpia el mostrador."`).
> - **`greetings`**: Diálogos emitidos al entrar un jugador en la sala. Debes usar `{npc}` y `{player}` dentro de las cadenas para que el motor las reemplace dinámicamente.
```

### Mob Hostil (Monstruo)
```yaml
- id: mob_lobo_test
  name: Lobo Gris
  behaviorId: hostile_beast # Ataca a jugadores
  roomId: mi_zona_bosque
  level: 3
  stats:
    fuerza: 12
    destreza: 15
    constitucion: 10
    ingenio: 4
    sabiduria: 5
    presencia: 8
    percepcion: 12
  inventory: ['item_colmillo_lobo'] # Drop al morir
```

---

## 4. Itemización y Recompensas (`items.yml`)
Cada objeto debe tener un propósito claro: mejora táctica o valor de venta.

### Equipamiento (Armas/Armaduras)
```yaml
- id: item_espada_test
  name: Espada de Acero Pobre
  type: EQUIPMENT
  equipSlot: weapon
  value: 50
  metadata:
    diceCount: 1  # 1d8 + 2 de daño
    diceSides: 8
    modifier: 2
    rarity: común # común, poco_común, raro, épico, legendario
```

### Consumibles
```yaml
- id: item_pocion_vida
  name: Poción de Salud
  type: CONSUMABLE
  metadata:
    charges: 1
    effects:
      - type: heal
        magnitude: 50
        message: "<green>Tus heridas se cierran.</green>"
```

### Objetos Narrativos y Misiones (QUEST / MISC)
Los objetos de misión o pistas fundamentales alimentan el sistema de "Crónica Viva".

```yaml
- id: item_contrato_campana
  name: "Contrato: La Campana que Sobra"
  description: Encargo de Rango Cobre...
  type: QUEST
  value: 0
  metadata:
    rank: cobre
    tags: [contrato, misterio]
    clueRoutes: 
      - dialogue: npc_bimba_cascabel
```

**Metadatos Narrativos:**
- `rank`: Utilizado para definir la dificultad narrativa del contrato u objeto.
- `tags`: Etiquetas (Array de strings) usadas por los NPCs para identificar tipos de objetos en su lógica o diálogos.
- `clueFor` / `clueRoutes`: Enlazan el objeto con el sistema de pistas y "rumores" del motor, permitiendo avanzar en investigaciones de la Crónica Viva cuando el jugador los examina o los obtiene.

---

## 5. El Motor de Spawns (`spawners.yml`)
El archivo `spawners.yml` controla la generación automática de NPCs (habitualmente monstruos) en el mundo. Define cuántos enemigos puede haber, cada cuánto tiempo reaparecen y qué probabilidad hay de que aparezca una variante u otra.

### Ejemplo de Spawner Básico
```yaml
- id: spawner_bosque
  roomId: mi_zona_bosque
  maxActive: 4       # Máximo de entidades vivas al mismo tiempo provenientes de este spawner
  intervalMs: 30000  # Frecuencia (en milisegundos) con la que el motor intenta spawnear
  variants:
    - npcId: mob_lobo_test
      chance: 80     # 80% de probabilidad de generar este NPC en cada tick
    - npcId: mob_lobo_alfa
      chance: 20     # 20% de probabilidad de generar el Alfa
```

### Ejemplo de Spawner de Jefe (`unique: true`)
Para jefes o NPCs únicos, es crucial evitar que se multipliquen si la sala se vacía pero el jefe se movió, o para asegurar que solo haya uno vivo en todo momento.

```yaml
- id: spawner_boss_madriguera
  roomId: colinas_madriguera
  maxActive: 1
  intervalMs: 120000 # 2 minutos de tiempo de respawn
  variants:
    - npcId: npc_conejo_general
      chance: 100
      unique: true   # GARANTIZA que el motor no generará otra instancia si ya existe una viva en TODO el mundo
```

### Parámetros Clave:
- **`maxActive`**: Límite estricto de cuántas copias vivas puede mantener *este spawner en particular* al mismo tiempo dentro de su `roomId`.
- **`intervalMs`**: Cada cuántos milisegundos el motor comprobará si la cantidad de NPCs vivos es menor a `maxActive`. Si es así, tirará los dados según el `chance` de las variantes.
- **`variants`**: Lista de posibles NPCs a spawnear. La suma de sus `chance` puede o no sumar 100 (el motor calcula el peso relativo, pero es buena práctica que sumen 100).
- **`unique: true`**: Ideal para Bosses o PNJs con nombre propio. Si se activa, el motor rastreará el `npcId` a nivel global y abortará el spawn si ese NPC ya existe en cualquier lugar de la memoria del servidor.

---

## 6. Sistema de Crónica y Rumores (`rumors-cronica.yml`)
Este archivo alimenta el sistema de investigación y Crónica Viva, permitiendo a los jugadores descubrir pistas y eventos del mundo interactuando con NPCs, escenarios y objetos.

```yaml
- id: rumor_campana_trece
  metadata:
    type: rumor
    area: villaclara
    text: >-
      Dicen que si la campana del mediodía da trece golpes, alguien ha sido escrito...
    routes:
      - npc_bimba_cascabel
      - scenery: campanario
    clueFor: nombres_borrados

- id: cronica_villaclara_dia_1
  metadata:
    type: cronica_viva
    title: "Campanas limpias, tinta sucia"
    text: "Villaclara despierta con olor a pan y una campana de más..."
```

### Parámetros Clave:
- **`type`**: Define si es un `"rumor"` que se puede aprender por las calles o un hito narrativo global `"cronica_viva"`.
- **`routes`**: Array de orígenes (entidades) donde se puede conseguir o escuchar este rumor. Puede ser el ID de un NPC (`npc_bimba_cascabel`), o un elemento del escenario (`scenery: campanario`).
- **`clueFor`**: A qué secreto mayor de la zona pertenece este rumor (para estructurar la investigación de los jugadores).

---

## 7. Estándares de Balanceo (Nivel 1-10)
Para asegurar una progresión justa, sigue estas métricas aproximadas:

| Nivel Mob | Vida (HP) | Daño Base (DPR) | Atributo Principal | Recompensa (Soles) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | 20-30 | 2-4 | 5-8 | 2-5 |
| **3** | 50-70 | 6-10 | 10-14 | 8-15 |
| **5 (Elite)**| 120-150 | 15-20 | 18-22 | 40-60 |
| **10 (Boss)**| 400+ | 30-40 | 25-30 | 200+ |

### Regla de Oro del Balanceo
Un jugador de igual nivel que el mob debería poder ganar el combate quedándose con un **30-40% de vida** restante (sin usar consumibles). Si el mob mata al jugador, es demasiado fuerte; si el jugador termina con el 90% de vida, el mob es "basura".

---

## 7. Flujo de Trabajo y Testing
1. **Crear carpeta:** `data/areas/mi_nueva_zona`.
2. **Escribir YAMLs:** Empieza por las salas, luego NPCs y finalmente ítems.
3. **Hot-Reload:** El motor detecta cambios en los YAMLs automáticamente. Usa el comando admin `admin refresh area <nombre>` para forzar la recarga.
4. **Comandos de Prueba:**
   - `admin goto <room_id>`: Teletranspórtate a tu nueva zona.
   - `admin spawn <npc_id>`: Invoca a tus mobs para probar el combate.
   - `admin give <item_id>`: Prueba el equipo que has creado.
   - `inspect-room`: Verifica que todas las entidades y salidas estén bien enlazadas.

---
> [!TIP]
> **Narrativa Visual:** Usa colores en las descripciones (`<yellow>`, `<red>`, `<green>`, `<cyan>`, `<magenta>`) para destacar objetos clave o peligros, pero no abuses de ellos o perderán impacto.
