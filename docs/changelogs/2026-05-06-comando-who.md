# Changelog - 2026-05-06: Comando WHO e Indicador de Presencia

## Nuevas Funcionalidades
*   **Comando `who`**:
    *   Permite a los jugadores ver una lista de todas las personas conectadas actualmente al mundo.
    *   Muestra el nombre, nivel, raza y clase de cada jugador.
    *   Incluye contadores totales para facilitar la visibilidad de la población del servidor.
*   **Sistema de Presencia en Tiempo Real**:
    *   Añadida la propiedad `isOnline` al modelo de jugador.
    *   El motor ahora rastrea automáticamente cuándo un jugador entra o sale del mundo para mantener la lista de `who` siempre actualizada.
    *   Integrado con el sistema de sesiones de Fastify para detectar desconexiones abruptas.

## Mejoras de UX
*   **Ayuda Integrada**: El comando `who` ha sido añadido al índice de `help` y cuenta con su propia descripción detallada mediante `help who`.
*   **Consistencia de Datos**: Los minions/agentes de prueba ahora aparecen correctamente en la lista de jugadores conectados, permitiendo verificar su actividad.

## Cambios Técnicos
*   Modificado `Player.model.ts` para incluir el estado de conexión.
*   Actualizado `CommandManager.ts` con la lógica de filtrado y formateo del comando `who`.
*   Ajustado `session.ts` y `server.ts` para gestionar el ciclo de vida de la presencia (`isOnline`).
