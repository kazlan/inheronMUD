---
title: "Estudio UI/UX Profundo: Cliente Móvil InheronMUD"
---

# Estudio UI/UX Profundo: Cliente Móvil InheronMUD

## 1. Filosofía de Diseño: "Mobile-First Premium Isekai"
El diseño debe alejarse completamente de la "consola de terminal" tradicional de los MUDs. Para móviles, necesitamos una interfaz de usuario (UI) rica, táctil e intuitiva, que encapsule la complejidad mecánica del MUD detrás de menús contextuales, gestos y representaciones visuales claras.

El esquema de navegación base sugerido es un **Bottom Navigation Bar** (Barra Inferior) permanente con 5 iconos principales:
1.  **Mundo/Acción (Pantalla principal)**
2.  **Personaje (Hoja y Equipo)**
3.  **Inventario (Bolsas)**
4.  **Social/Grupos (Party y Gremio)**
5.  **Diario/Quests (Libro de misiones)**

A continuación, se detalla la UI/UX de cada sistema profundo del juego.

---

## 2. Mundo, Habitaciones y Mobs (Pantalla Principal)
Esta es la pantalla donde el jugador pasa el 80% del tiempo. Debe equilibrar la inmersión narrativa con la funcionalidad inmediata.

*   **Header (Cabecera):** Nombre de la sala, nivel de peligro (color), iconos de estado (Buffs/Debuffs aplicados a ti).
*   **Visual de la Sala (Opcional pero recomendado):** La mitad superior (o un 30%) muestra el arte generado de la zona.
*   **El "Radar" de Entidades (Novedad clave):** Justo debajo de la imagen y encima del log de texto, debe haber una fila desplazable horizontalmente (Carousel) de "Chips" o Iconos que representan lo que hay en la sala, divididos en tres filtros:
    *   `[ Mobs (3) ]` `[ Jugadores (1) ]` `[ Objetos (2) ]`
    *   Tocar "Mobs" despliega iconos/nombres de los monstruos.
    *   **Acción:** Tap en un Mob del radar abre instantáneamente el **Action Sheet** (Menú inferior): `[ Atacar ]`, `[ Mirar ]`, `[ Usar Habilidad > ]`, `[ Robar ]`. Esto evita tener que buscar el mob dentro del texto de la descripción.
*   **Log de Acción (Hypertext):** El texto descriptivo sigue siendo importante. Los nombres clave (salidas, mobs) están resaltados.
*   **Controles de Navegación Flotantes:** Un D-Pad discreto semitransparente o botones en cruz en la esquina inferior derecha superpuestos al log para moverse rápido sin abrir menús.

---

## 3. Hoja de Personaje, Habilidades y Hechizos

### Hoja de Personaje (Character Sheet)
*   **Visualización Base:** Un modelo 2D, ilustración, o silueta detallada del personaje en el centro.
*   **Gráfico de Radar (Pentágono/Hexágono):** Para mostrar los atributos principales (Fuerza, Agilidad, Inteligencia, Constitución, Suerte). Es mucho más visual que una lista de números.
*   **Pestañas Secundarias:**
    *   *Detalles:* Estadísticas de combate detalladas (DPS, Probabilidad de Crítico, Evasión, Resistencias Mágicas elementales).
    *   *Lore/Títulos:* Título actual equipado, alineamiento, religión o fama.

### Habilidades y Hechizos (Spellbook & Action Bar)
*   **Spellbook (Libro de Habilidades):** Estructurado en un árbol visual (Skill Tree) o categorías (Físico, Magia, Supervivencia). Cada habilidad muestra su coste (MP/Energía), *Cooldown* y un icono distintivo.
*   **Asignación de "Action Bar" (Drag & Drop / Tap & Set):**
    *   El jugador tiene una "Barra de Acción Rápidas" (ej. 5 slots) que se superpone en la pantalla de *Mundo* (Módulo 2).
    *   Para asignar, el jugador mantiene pulsado (Hold) un hechizo y lo arrastra a un slot, o toca "Asignar a acceso rápido" y elige la ranura.
*   **UX en Combate:** Los iconos de la Action Bar muestran el *cooldown* con un barrido radial oscuro. Si no hay maná suficiente, el icono se tiñe de gris o rojo con un pequeño aviso de "Sin Maná".

---

## 4. Inventario y Sistema de Equipo (Paperdoll)

El manejo de objetos suele ser tedioso en los MUDs clásicos. Aquí lo resolvemos con UI pura.

### Inventario (Bolsas)
*   **Vista de Grid:** Una cuadrícula de slots (ej. 5x6) mostrando iconos de objetos. Los bordes de los iconos indican rareza (Gris = Común, Verde = Mágico, Oro = Épico).
*   **Filtros Rápidos:** Botones arriba del grid: `[Todos]`, `[Armas]`, `[Armaduras]`, `[Consumibles]`, `[Materiales]`.
*   **Interacción (Objeto):** Tap en un objeto abre una ventana flotante (Tooltip) con las stats, el lore y botones de acción masiva: `[ Equipar ]`, `[ Usar ]`, `[ Tirar ]`, `[ Linkear al Chat ]`.

### Equipo (Paperdoll)
*   Se accede deslizando o mediante pestaña desde el inventario.
*   Muestra la silueta del jugador rodeada de **Slots Específicos**: Cabeza, Pecho, Piernas, Pies, Arma Principal, Mano Secundaria, Anillos, Cuello.
*   **Interacción UX de Equipamiento:**
    *   Tap en el slot "Cabeza" (esté vacío o no): Se abre un panel lateral o inferior mostrando *únicamente* los cascos/sombreros que tienes en el inventario. Si seleccionas uno, se equipa (y desequipa el actual automáticamente).
    *   **Comparativa Visual:** Al inspeccionar un casco nuevo, la UI muestra en verde/rojo cómo cambiarán tus estadísticas (`Defensa: 10 -> 15 (+5)`).

---

## 5. Interacción con NPCs y Sistema de Quests

### Diálogos con NPCs
*   **Estilo Visual Novel / JRPG:** Cuando hablas con un NPC clave o das un comando de "Hablar", el texto normal del MUD desaparece o se atenúa. Aparece un panel en la mitad inferior de la pantalla.
*   **Retrato:** Avatar del NPC (si existe) a un lado.
*   **Caja de Diálogo:** Texto escrito con efecto de máquina de escribir (opcional, para inmersión).
*   **Opciones de Respuesta:** Botones claros y anchos. `[1. ¿Qué sabes del dragón?]`, `[2. Aceptar el trabajo.]`, `[3. Me marcho.]`.
*   **Comercio (Tiendas):** Interfaz dual. Izquierda/Arriba lo que vende el NPC, Derecha/Abajo tu inventario. Un botón central de "Comprar/Vender" y selección de cantidad mediante un slider.

### Quests (Diario y Tracker)
*   **Diario de Misiones (Quest Log):** Dividido en `[Activas]` y `[Completadas]`.
*   **Estructura de la Quest:** Título, Lore/Narrativa, Recompensas esperadas, y **Pasos/Objetivos** (ej. "Mata 5 Goblins (3/5)").
*   **Quest Tracker en HUD principal:** Opción para "Marcar (Track)" una quest. Esto la pone en un panel muy pequeño y flotante en la pantalla del "Mundo", permitiendo ver el progreso (ej. 3/5) en tiempo real mientras combates, sin abrir el diario.

---

## 6. Sistema de Grupos (Party) y Gremios (Guilds)

La capa social y cooperativa requiere visibilidad constante de los aliados.

### Sistema de Grupos (Party HUD)
*   **HUD en el Mundo:** Cuando estás en grupo, aparecen mini-marcos (Party Frames) justo debajo de la barra de vida del jugador en la parte superior izquierda de la pantalla principal.
*   **Información:** Nombre, barra estrecha de HP y MP, y pequeños iconos si tienen debuffs veneno/stun (crítico para Healers).
*   **Interacción Táctil:** Tap en el retrato del aliado despliega el menú: `[ Curar (Hechizo rápido) ]`, `[ Seguir (Follow) ]`, `[ Intercambiar ]`, `[ Hacer Líder ]`, `[ Inspeccionar Equipo ]`.

### Sistema de Gremios (Guilds)
*   Una pantalla dedicada dentro del tab "Social".
*   **Tablón/Mensaje del Día:** Información estática gestionada por el líder.
*   **Chat Privado:** Pestaña de chat exclusiva del gremio, separada del ruido del chat global de la sala.
*   **Roster (Lista de Miembros):** Lista ordenada mostrando quién está Online/Offline, nivel, clase y su ubicación actual en el MUD. Tap en un miembro permite enviarle mensajes directos (Whispers) o invitarlo a Party.
*   **Progresión del Gremio:** Si hay sistema de niveles o tesorería, gráficos de barras mostrando la contribución y oro acumulado.

---

## 7. Requerimientos para el Engine del MUD (Backend)
Para que el cliente móvil pueda renderizar todo esto, el envío de datos en bruto mediante Telnet/Texto es insuficiente. El **MUD Engine** debe estructurar sus payloads JSON vía WebSocket de esta manera:

*   **Evento de Sala:** No envía `"Juanito te invita al grupo"`. Envía:
    `{ type: "event", action: "party_invite", source_id: "juan_123", source_name: "Juanito" }`. El cliente decide cómo renderizar esa notificación (un popup flotante).
*   **Payload de Inventario:** Envía arrays de objetos completos, no texto:
    `{ type: "inventory_data", items: [ { id: "wpn_77", name: "Espada de Fuego", type: "weapon", slot: "main_hand", rarity: "epic", stats: { atk: 25, fire_dmg: 10 } } ] }`
*   **Entidades en Sala:** El "Radar de la Sala" del cliente requiere que el servidor envíe en cada actualización o movimiento un array categorizado de UUIDs y metadatos básicos de lo que está presente en la habitación.
