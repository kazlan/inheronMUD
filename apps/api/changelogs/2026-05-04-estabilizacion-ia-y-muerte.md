# Changelog - 2026-05-04

## [Estabilización de IA, Efectos Ambientales y Rutina de Muerte]

### Añadido
- **Rutina de Muerte**: Sistema de respawn inmediato. Al morir, el jugador pierde un 10% de experiencia, reaparece en la Plaza de Villaclara con un 10% de vida y recibe mensajes narrativos.
- **IA Social**: Los NPCs ahora saludan a los jugadores al entrar y lanzan mensajes de ambiente aleatorios (murmullos, acciones de sabor).
- **IA Sanadora**: NPCs con el flag `healer` ahora curan a los jugadores heridos fuera de combate.
- **IA Cobarde**: NPCs con el flag `cobarde` huyen del combate si su salud baja del 30%.
- **Eventos de Servidor**: Nuevo evento `force_look` que permite al motor forzar una actualización de la vista del cliente (usado en respawn).

### Cambiado
- **IA Wander**: Corregido el bug de "invasión de conejos". Ahora los NPCs respetan estrictamente su `areaId` y no cruzan fronteras de zona (ej. del campo a la ciudad).
- **Mensajes de Combate**: Se han eliminado los anuncios de "Ronda X" para limpiar el log de batalla, tal como solicitaron los testers.
- **Efectos de Área (AoE)**: El `EffectsManager` ahora soporta mensajes espaciales colectivos para auras (ej. la Capilla o el Ciervo Dorado).
- **Renderizado Inicial**: Corregido bug en el cliente web donde los NPCs/Items no aparecían en el primer `look` tras el login.
- **Datos de Mundo**: Actualizados `rooms.yml` y `npcs.yml` en Villaclara y Llanuras Ámbar con descripciones enriquecidas y efectos.

### Técnico
- Recompilación completa del workspace `engine` para asegurar integridad de tipos.
- Sincronización de eventos entre `GameEngine` y el servidor Fastify.
