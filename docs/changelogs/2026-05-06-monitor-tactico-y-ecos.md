# Changelog: Monitor Táctico de Efectos y Mecánica de Ecos
**Fecha:** 2026-05-06
**Versión:** 0.8.12

## Resumen de Cambios
Se ha implementado un sistema avanzado de monitoreo de efectos en tiempo real dentro del Pulso Táctico, junto con mejoras visuales para la mecánica de "Ecos" de la clase Bardo.

## Motor del Juego (Engine)
- **Sincronización de Efectos**: Se ha actualizado el comando `score` para incluir los `activeEffects` en el estado del jugador.
- **Mecánica de Ecos**: El `EffectsManager` ahora etiqueta automáticamente los efectos generados como ecos con el flag `isEcho: true`.
- **Sincronización de Ticks**: Se ha añadido el rastreo de `lastTickTime` y `tickMs` para permitir que el cliente sincronice animaciones temporales.

## Servidor API
- **Payload de Combate**: El mensaje `COMBAT_UPDATE` ahora incluye los metadatos de efectos activos de todos los participantes y los tiempos del motor.

## Frontend (Web App)
- **Monitor Táctico (PulsePanel)**:
    - Nuevo monitor de efectos en vivo que muestra barras de progreso para buffs y debuffs.
    - Los buffs propios se muestran en cian y los debuffs en enemigos en rojo.
    - Los **Ecos** se visualizan con barras gris oscuro y opacidad reducida para indicar su estado de "fading".
    - El panel se refresca localmente cada segundo para mantener los cronómetros precisos sin sobrecargar el WebSocket.
- **Hoja de Personaje**: Actualizada para mostrar el tiempo restante real en minutos y barras de progreso dinámicas para efectos de larga duración.
- **Hoja de Ruta**: Se han unificado las fuentes de datos de efectos en `Play.tsx` para evitar discrepancias visuales.

## Documentación y Ayuda
- **Sistema de Ayuda**: 
    - Actualizado `help pulso` con información sobre el monitor de efectos.
    - Nuevo comando `help bardo_eco` que explica la mecánica de resonancia de habilidades.

## Impacto en el Jugador
Los jugadores (especialmente los Bardos) ahora tienen una visibilidad total sobre sus mantenimientos y combos, pudiendo ver exactamente cuántos segundos le quedan a un efecto antes de que se convierta en eco o desaparezca, facilitando la toma de decisiones tácticas.
