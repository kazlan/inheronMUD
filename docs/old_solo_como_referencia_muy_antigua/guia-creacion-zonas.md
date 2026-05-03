# Guía de Creación de Zonas en InheronMUD

Esta guía detalla los pasos necesarios para crear una nueva zona (área) completa en el motor de InheronMUD (basado en Ranvier). Una zona se compone de salas, objetos, NPCs, misiones y lógica de scripts.

---

## 1. Estructura de Directorios

Cada zona debe residir dentro de un "bundle". Por defecto, las zonas de ejemplo están en `ranvier-test/bundles/bundle-example-areas/areas/`.

Para crear una nueva zona llamada **"bosque_oscuro"**, crea la siguiente estructura:

```text
bundles/
  mi-bundle-de-zonas/
    areas/
      bosque_oscuro/
        manifest.yml     # Metadatos de la zona
        rooms.yml        # Definición de salas
        npcs.yml         # Definición de mobs y NPCs
        items.yml        # Definición de objetos y contenedores
        quests.yml       # Definición de misiones
        loot-pools.yml   # Definición de tablas de botín
        scripts/         # (Opcional) Lógica personalizada en JS
```

---

## 2. El Manifiesto (`manifest.yml`)

Define el título de la zona y comportamientos globales (como el tiempo de respawn).

```yaml
title: "Bosque Oscuro"
behaviors:
  progressive-respawn:
    interval: 30 # Segundos entre oleadas de respawn
```

---

## 3. Creación de Salas (`rooms.yml`)

Las salas son los nodos por los que se mueven los jugadores.

### Principios de Diseño Arquitectónico (Hub-and-Spoke)
Al crear salas, debes seguir ciertas reglas lógicas para mantener la coherencia espacial del mundo:
- **Modelo Eje y Radios (Hub-and-Spoke)**: Evita pasillos lineales larguísimos. Crea un punto central seguro (Hub) desde el que salgan los caminos a los desafíos (Spokes). Esto facilita la orientación.
- **Bucles de Retorno (Looping)**: Diseña caminos o atajos bloqueados que devuelvan al jugador al Hub tras acabar la zona. Evita el "backtracking" tedioso.
- **Salas de Enlace**: Define bien las áreas separándolas o conectándolas usando salas que sirvan de enlace (por ejemplo: "Callejón", "Sendero", "Camino forestal"). No conectes grandes puntos de interés de forma abrupta.
- **Lógica de Edificios**: Los edificios tienen puertas en una o varias direcciones, pero por norma general **solo dejan salir por donde se ha entrado**. El resto de direcciones deben estar bloqueadas o ser inexistentes, a menos que haya otras habitaciones, escaleras interiores, trampillas o puertas secretas. **Un edificio nunca debe ser un pasillo de tránsito obligatorio** para llegar a otra zona abierta.
- **Campamentos y Fortalezas (Choke Points)**: Las bases enemigas (como un campamento goblin) solo deben ser accesibles desde su **puerta principal** que funciona como embudo y "filtro de nivel" (con guardias). Evita conectarlas por múltiples direcciones abiertas a zonas colindantes.

### Escritura Sensorial y Divulgación Progresiva
- **Regla de los Tres Sentidos**: Toda descripción principal de una sala debe evocar al menos la Vista y otros dos sentidos (Olfato, Oído, Tacto). Ejemplo: "El aire es húmedo y huele a ozono (olfato). El sonido del metal choca a lo lejos (oído) bajo la luz azulada de las antorchas (vista)."
- **Divulgación Progresiva**: No pongas biblias de texto en la sala. Describe lo principal y añade objetos escrutables (`look altar`) para que los exploradores descubran el Lore interactuando.

```yaml
- id: entrada
  title: "Entrada al Bosque"
  coordinates: [0, 0, 0] # Obligatorio para UI moderna (desactiva compás ASCII)
  description: "Un sendero estrecho se interna entre árboles centenarios que bloquean la luz del sol."
  exits:
    - roomId: "bosque_oscuro:claro" # Usar siempre roomId (target es obsoleto)
      direction: north
  npcs: ["bosque_oscuro:lobo_hambriento"]
  items:
    - id: "bosque_oscuro:cartel_aviso"

- id: claro
  title: "Un Claro Sombrío"
  coordinates: [0, 1, 0]
  description: "El bosque se abre ligeramente, revelando un suelo cubierto de huesos."
  exits:
    - roomId: "bosque_oscuro:entrada"
      direction: south
```

---

## 4. Creación de Objetos y Loot (`items.yml`)

Define armas, armaduras, consumibles y contenedores.

### Progresión de Botín Significativa
Evita crear "loot basura" genérico. El botín debe contar una historia o tener utilidad. 
- Usa **Flavor Text** ("Daga de Ritual" en vez de "Daga").
- Crea **Consumibles Tácticos** (ej. pociones que caen antes de un jefe para ayudar a vencerlo).

```yaml
- id: espada_oxidada
  name: "Espada Oxidada"
  type: WEAPON
  keywords: ["espada", "oxidada"]
  description: "Una hoja mellada por el tiempo, pero aún capaz de cortar."
  metadata:
    slot: "wield"
    minDamage: 5
    maxDamage: 10
    speed: 2.0
    stats:
      strength: 1

> [!WARNING]  
> **Integridad de Armas:** Todo objeto de tipo `WEAPON` DEBE incluir `minDamage`, `maxDamage` y `speed` dentro de `metadata`. Si falta alguno de estos valores, el motor fallará al calcular el daño y el servidor crasheará lanzando un `TypeError: Damage amount must be a finite Number`.

- id: cofre_madera
  type: CONTAINER
  name: "Cofre de Madera"
  roomDesc: "Un cofre de madera reforzado con hierro descansa aquí."
  closed: true
  items: ["bosque_oscuro:espada_oxidada"]
  metadata:
    noPickup: true # Para que no puedan llevarse el cofre entero

> [!CAUTION]
> **Integridad de Objetos**:
> 1. **Keywords**: Todo objeto DEBE tener definido un array de `keywords` (ej. `keywords: ["espada", "oxidada"]`). Si omites esto, el servidor crasheará al generarlo como botín.
> 2. **Equipamiento**: Para armas y armaduras, la propiedad `slot` (ej. `chest`, `finger`) DEBE estar dentro del bloque `metadata`.
> 3. **Armas**: El slot correcto para empuñar un arma es `wield` (NUNCA uses `weapon`).
> 4. **Daño de Armas**: Todo objeto de tipo `WEAPON` DEBE incluir `minDamage` y `maxDamage` dentro de su `metadata`. Si no se definen, el cálculo de daño en combate devolverá nulo y el servidor crasheará al atacar.
```

---

## 5. Creación de NPCs y Mobs (`npcs.yml`)

Aquí defines tanto enemigos (mobs) como personajes neutrales o mercaderes.

### Enemigo (Mob)
```yaml
- id: lobo_hambriento
  name: "Lobo Hambriento"
  level: 3
  keywords: ["lobo", "hambriento"]
  description: "Un lobo de pelaje gris erizado y ojos amarillos que te observa con fixeza."
  behaviors:
    combat: true
  attributes: # OBLIGATORIO para que sean atacables
    health: 50
    strength: 5
  equipment: # OPCIONAL pero RECOMENDADO para humanoides
    wield: "bosque_oscuro:daga_oxidada"
    chest: "bosque_oscuro:capa_vieja"
  ranvier-wander:
    interval: 15
    lootable:
      currencies:
        oro:
          min: 5
          max: 15
      pools:
        - "bosque_oscuro:botin_animal"
```

### Atributos de Combate
Para que un NPC sea considerado un objetivo válido por el sistema de combate, **DEBE** tener definido el atributo `health`. Sin este atributo, el comando `kill` fallará con un mensaje de "You can't attack that target".

Se recomienda definir al menos:
- `health`: Puntos de vida.
- `strength` o `stamina`: Para el cálculo de daño/defensa (según el bundle de combate).

### Equipamiento de Mobs (`equipment`)
Si un mob es humanoide (ej. goblins, orcos, bandidos), **debes equiparlo** usando el bloque `equipment`. 
Si no les equipas un arma, usarán su daño natural de combate desarmado. Equiparlos con armas (`wield`) y armaduras (`chest`, `shield`, etc.) hace que el combate sea más realista y que los stats de los objetos se apliquen al monstruo, haciéndolo más desafiante.

### Mercader (NPC)
```yaml
- id: ermitano
  name: "El Ermitaño"
  keywords: ["ermitaño", "viejo"]
  description: "Un anciano de barba larga que vende suministros básicos."
  metadata:
    tips: # Sugerencias para el panel de ayuda/contexto
      - "Ten cuidado con los lobos de noche, son más agresivos."
      - "Si necesitas curarte, busca las bayas rojas en el claro."
    vendor:
      items:
        "bosque_oscuro:pocion_vida": { cost: 50, currency: "oro" }
      enterMessage: "Bienvenido a mi humilde hogar. ¿Necesitas algo?"

> [!IMPORTANT]
> **Sistemas de Venta**: Asegúrate de usar el formato de objeto para `items` en la metadata del vendedor: `"id_item": { cost: X, currency: "Y" }`.
```

---

## 6. Tablas de Botín (`loot-pools.yml`)

Permite gestionar probabilidades de drop comunes para varios NPCs.

```yaml
botin_animal:
  - "bosque_oscuro:piel_lobo": 50 # 50% de probabilidad
  - "bosque_oscuro:diente_afilado": 20
```

---

## 7. Creación de Misiones y Progresión (`quests.yml`)

Define tareas, requisitos y recompensas. 

> [!TIP]
> **Taxonomía de Bartle**: Recuerda diseñar contenido para los 4 tipos de jugadores:
> - **Achievers** (Quieren Loot y Niveles: Dales quests de cacería y armas raras).
> - **Explorers** (Quieren Descubrir: Dales lore en objetos, atajos y salas secretas).
> - **Socializers** (Quieren Comunidad: Dales plazas y tabernas seguras sin aggro).
> - **Killers** (Quieren Dominio y Peligro: Dales zonas de alto riesgo con mecánicas mortales).

```yaml
- id: limpiar_bosque
  title: "Limpieza Forestal"
  level: 3
  description: "El ermitaño necesita que reduzcas la población de lobos en la zona."
  goals:
    - type: KillGoal
      config:
        title: "Caza 5 Lobos"
        npc: "bosque_oscuro:lobo_hambriento"
        count: 5
  rewards:
    - type: ExperienceReward
      config:
        amount: 500
    - type: CurrencyReward
      config:
        maxCurrency: oro
        amount: 100
```

---

## 8. Scripts y Lógica Personalizada (`scripts/`)

Los scripts permiten añadir comportamientos únicos a salas, NPCs y objetos. Se ubican en `scripts/rooms/`, `scripts/npcs/` e `scripts/items/`.

### Script de Sala (ej. Anuncios de Respawn)
Escucha cuando un NPC reaparece para emitir un mensaje a toda el área:
```javascript
module.exports = {
  listeners: {
    npcAdded: state => function (npc) {
      if (npc.entityReference === 'zona:jefe') {
        Broadcast.sayAtArea(this.area, "¡El jefe ha despertado!");
      }
    }
  }
};
```

### Script de NPC (ej. Saludos)
```javascript
module.exports = {
  listeners: {
    playerEnter: state => function (player) {
      Broadcast.sayAt(player, "El NPC te saluda cordialmente.");
    }
  }
};
```

### Script de Objeto (ej. Usables/Pergaminos)
```javascript
module.exports = {
  listeners: {
    use: state => function (player) {
      const skill = state.SkillManager.get('heal');
      skill.execute(null, player, player);
      state.ItemManager.remove(this); // Consumir objeto
    }
  }
};
```

---

## 9. Puntos de Respawn y Enlace de Alma

Por defecto, los jugadores reaparecen en la sala definida como `startingRoom` en `ranvier.json`. Para permitir "Checkpoints" o "Puntos de Guardado":

1.  **Metadata**: El sistema busca la clave `waypoint.home` en la metadata del jugador.
2.  **Script de Enlace**: Puedes crear un objeto (como un orbe) que ejecute:
    ```javascript
    player.setMeta('waypoint.home', room.entityReference);
    ```
3.  **Persistencia**: Siempre llama a `player.save()` tras cambiar el punto de respawn para asegurar que se guarde.

---

## 10. Pasos para Activar la Zona

1. **Guardar Archivos**: Asegúrate de que todos los `.yml` están en su carpeta de área.
2. **Registrar Bundle**: Si has creado un bundle nuevo, debes añadirlo a la lista `bundles` en el archivo `ranvier.json` en la raíz del proyecto.
3. **Reiniciar/Recargar**:
   - Para cambios en YAML: Usa el comando `reload` dentro del juego para una actualización en caliente sin desconectar jugadores.
   - Para bundles nuevos o cambios en `ranvier.json`: Es necesario un reinicio completo del proceso Node.js.
4. **Validación**: Usa el comando `tp nombre_zona:id_sala` para teletransportarte directamente y verificar la zona.

---

## 11. Compatibilidad con Interfaz Moderna

Para que una zona se vea y funcione de forma premium en el cliente web, sigue estas reglas:

- **Coordenadas**: Define siempre `coordinates: [x, y, z]`. Esto permite que el cliente renderice las salidas como botones interactivos en una sola línea en lugar de usar el compás de texto antiguo.
- **Riqueza Visual**: Usa descripciones largas y atmosféricas. El cliente web está optimizado para mostrar bloques de texto inmersivos.
- **Etiquetado de Enemigos**: Usa siempre `behaviors: combat: true` para que el servidor genere la etiqueta `[Mob]`. El cliente web usa esta etiqueta para habilitar el botón de **Attack** en el panel de contexto.
- **Detección de Entidades**: En `roomDesc` (objetos) o descripciones de NPCs, procura que el nombre o la palabra clave principal esté cerca del inicio. El cliente web utiliza regex para extraer el nombre y generar el comando de interacción (ej. `[Item] Orbe de alma...` -> comando `look orbe`).
- **Interacción Ambiental**: Para objetos que el jugador debe usar en la sala (sin recogerlos), asegúrate de:
    1. Añadir `behaviors: usable: true`.
    2. Configurar `metadata: noPickup: true`.
    3. Implementar el listener `use` en el script del objeto. El comando `use` ha sido mejorado para detectar objetos en la habitación.

---

> [!IMPORTANT]
> **Combat Behavior & Atributos**: Para que un NPC sea atacable debe:
> 1. Tener `behaviors: combat: true`.
> 2. Tener definido el atributo `health` en la sección `attributes`. 
> Sin el atributo de vida, el sistema de combate lo tratará como un objetivo inválido.

> [!IMPORTANT]
> **roomId vs target**: Asegúrate de usar siempre `roomId` en las definiciones de salidas. El uso de `target` puede causar que el comando de movimiento no actualice la descripción de la sala automáticamente.

> [!TIP]
> **Uso de IDs**: Siempre usa el prefijo `nombre_zona:id_entidad` (ej. `bosque_oscuro:lobo`) para evitar conflictos entre áreas.
