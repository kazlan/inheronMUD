# Changelog: Gran Actualización Sistémica - Mapeado, Combate y Usabilidad
**Fecha:** 2026-05-06
**Versión:** 0.9.0 (Hito de Desarrollo)

## 1. Sistema de Mapeado Dinámico y Exploración
Se ha implementado una de las mecánicas más solicitadas: la navegación visual y la persistencia de exploración.
- **MapManager**: Nuevo motor de grafos que realiza un recorrido BFS (Breadth-First Search) de las áreas para generar coordenadas 2D relativas.
- **Persistencia de Visitas**: Los jugadores ahora guardan las salas que han explorado en la base de datos SQLite (`visitedRooms`).
- **Mapa de Nodos y Enlaces (Estilo Mudlet)**: El minimapa y el mapa mundial han pasado de una cuadrícula rígida a una representación SVG de nodos y líneas, reflejando fielmente las conexiones entre salas.
- **WorldMapOverlay**: Un mapa de área completo a pantalla completa con leyenda, coordenadas, soporte para navegación táctica y visualización de conexiones.
- **Entrada Dinámica al Mundo**: El panel de mapa ahora cuenta con un "Velo de Sincronización" (black overlay) que se retira con un fundido (fade-out) cinematográfico al entrar al juego.

## 2. Refactorización del Monitor de Combate y Pulso
Se ha rediseñado la experiencia de combate para que sea puramente táctica y visual.
- **Monitor de Efectos en Vivo**: Integrado en el `PulsePanel`, muestra barras de duración para buffs y debuffs.
- **Mecánica de Ecos**: Soporte visual para habilidades de Bardo que "resuenan". Los ecos se muestran ensombrecidos y con opacidad reducida.
- **Sincronización de HP y Nivel**: Las barras de vida de los enemigos ahora se actualizan instantáneamente y muestran el nivel del objetivo.
- **Sincronización de Ticks**: El cliente ahora predice y visualiza el ritmo del motor de combate (2.5s) para una mejor coordinación.

## 3. Usabilidad e Inventario Avanzado
Mejoras significativas en la interacción con el mundo.
- **Comodines de Inventario**:
    - `get all`: Recoge todo de la sala.
    - `get . <cofre>`: Recoge todo el contenido de un contenedor.
    - `get <item> <n>`: Recoge la enésima instancia de un objeto.
    - `drop all`: Vacía el inventario rápidamente.
- **Comando `who`**: Lista dinámica de jugadores conectados con sus niveles y títulos.
- **Interactividad en Viewport**: Los nombres de NPCs y salidas en el texto ahora son clicables para realizar acciones automáticas (mirar, hablar, listar).

## 4. Mejoras en la Clase Bardo
- **Persistencia de Estado**: Se ha corregido la sincronización de Estrofas, Aplausos y Voz entre el motor y la UI.
- **Extensión de Cantos**: Mejorada la lógica de `sostener compás` para que afecte correctamente a todos los participantes del grupo.
- **Documentación**: Nuevas entradas de ayuda (`help bardo`, `help bardo_eco`, `help pulso`).

## 5. Infraestructura y Admin
- **Administración**: Finalización del comando `refresh` para restaurar estados y herramientas de teletransporte mejoradas.
- **Prisma/SQLite**: Actualización del esquema para soportar el historial de exploración.
- **Corrección de Errores Críticos**: Resueltos fallos de `ReferenceError` y `TypeError` en el Viewport causados por ráfagas de datos iniciales incompletos durante el login.
- **GitHub**: Sincronización completa de la rama de desarrollo con todos los cambios integrados.

---
*Esta actualización sienta las bases para la Fase de Pruebas con Testers, proporcionando una interfaz moderna y reactiva sobre el motor MUD tradicional.*
