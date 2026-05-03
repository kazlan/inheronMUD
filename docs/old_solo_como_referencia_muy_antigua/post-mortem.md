# Post-Mortem: Interacción con el Orbe y Panel Lateral

Este documento resume los cambios realizados para estabilizar la interacción con el **Orbe de Enlace de Alma** y las mejoras de inteligencia contextual en el **Panel de Detalle (ContextPanel)**.

## 1. Servidor (RanvierMUD)

### 🛠️ Enriquecimiento de Datos de Habitación
- **Archivo**: `websocket-networking/player-events.js`
- **Cambio**: Se modificó la serialización del evento `roomUpdate`. Ahora envía objetos completos (`name`, `entityReference`, `metadata`, `behaviors`) en lugar de solo strings de nombres.
- **Razón**: Permitir que el cliente web tome decisiones lógicas (como ocultar el botón "Get" si el objeto es inamovible).

### 🛠️ Comando `use` (Padre de `tocar`)
- **Archivo**: `bundle-example-commands/commands/use.js`
- **Cambios**:
    - Se añadió el alias `tocar`.
    - Se corrigió un `TypeError` donde se llamaba a `item.hasListener` (inexistente). Se cambió por `item.listeners('use').length > 0`.
    - Se implementó el uso del `Logger` oficial de Ranvier para trazabilidad total.
    - El comando ahora permite ejecutar scripts de objetos que tengan un listener de `use` incluso si no tienen el comportamiento `usable` estándar.

### 🛠️ Script del Orbe
- **Archivo**: `bundle-aethelgard/areas/aethelgard/scripts/items/soulbound_orb.js`
- **Cambio**: Simplificación de mensajes (eliminación de acentos y etiquetas complejas) para asegurar compatibilidad ANSI/WebSocket y evitar fallos silenciosos.

---

## 2. Cliente Web (React)

### 🛠️ Inteligencia Contextual del Panel
- **Archivo**: `apps/web/src/components/ContextPanel.tsx`
- **Cambios**:
    - Se implementó la función `actionsFor(entity)` que filtra acciones dinámicamente.
    - **Filtrado del Orbe**: Solo muestra "Tocar" (oculta "Use").
    - **Objetos Inamovibles**: Oculta "Get" si `metadata.noPickup` es `true`.
    - **Objetos en el Suelo**: Oculta "Equip" y "Drop" para objetos que no están en el inventario.
    - **Objetos Usables**: Solo muestra acciones de uso si el objeto tiene el behavior `usable` o es un caso especial identificado.

### 🛠️ Gestión de Estado e Inmutabilidad
- **Archivo**: `apps/web/src/App.tsx`
- **Cambio**: Al hacer clic en una entidad del chat, ahora se crea un **nuevo objeto** (`{ ...entity }`) enriquecido con los datos "live" del servidor.
- **Razón**: React no detectaba cambios en las propiedades internas del objeto si la referencia de memoria era la misma, lo que impedía que el panel se redibujara con los filtros aplicados.

---

## 3. Incidencias y Depuración

- **Error de Red**: Se detectaron múltiples `ECONNABORTED` en el servidor, sugiriendo inestabilidad en la conexión WebSocket local bajo carga de reinicios rápidos.
- **Conflicto de Puertos**: Los reinicios frecuentes causaron que el puerto de Vite (5174) se bloqueara ocasionalmente, requiriendo `taskkill` de procesos Node.
- **Trazabilidad**: Se establecieron prefijos de logs claros: `[CLIENT_CMD]`, `[WS]`, `[WSS_IN]`, `[ARG_PARSER]` y `[USE_CMD]`.
