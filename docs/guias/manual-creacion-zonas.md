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
    inventory: ['item_pocion_vida', 'item_espada_test']
    dialogues:
      - requires_not_flag: mision_aceptada
        text: "¿Podrías ayudarme con esos lobos?"
        set_flag: mision_aceptada
      - text: "Ten cuidado, forastero."
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

---

## 5. El Motor de Spawns (`spawners.yml`)
Controla cuántos enemigos hay en una sala y qué tan rápido reaparecen.

```yaml
- id: spawner_bosque
  roomId: mi_zona_bosque
  maxActive: 4       # Máximo de mobs a la vez
  intervalMs: 30000  # Tiempo entre intentos de spawn
  variants:
    - npcId: mob_lobo_test
      chance: 80
    - npcId: mob_lobo_alfa
      chance: 20
```

---

## 6. Estándares de Balanceo (Nivel 1-10)
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
