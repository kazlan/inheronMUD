# Changelog - 2026-05-04 - Estabilización IA, Reporte Cualitativo y De-duplicación

## Resumen de Cambios
Esta sesión se centró en la mejora del sistema de observación de los testers, la corrección de errores en el motor de juego (muerte y sincronización) y la optimización de los logs cualitativos.

### 1. Sistema de Testers (`tester-client.ts`)
- **De-duplicación Agresiva**: Implementado un sistema basado en un `Set` estático compartido para evitar reportes duplicados de un mismo evento por diferentes testers (ej. el aura de la iglesia).
- **IA de Exploración**: Mejorada la lógica de movimiento. Los testers ahora analizan las salidas válidas de la sala en lugar de elegir direcciones al azar, evitando quedar atrapados en habitaciones con una sola salida.
- **Análisis de Consistencia**: Los testers ahora reportan discrepancias entre las salidas reales de la sala y su descripción narrativa.
- **Detección de Vida**: Se ha añadido lógica para detectar e informar sobre comportamientos sociales de NPCs y el uso de habilidades espaciales.
- **Objetivo de Progresión**: Configurados para buscar activamente combate y reportar subidas de nivel.

### 2. Motor de Juego y Sincronización
- **Rutina de Muerte**: Implementada la penalización de XP (10%), respawn en la plaza y restauración parcial de vida al morir.
- **Evento `force_look`**: Añadida señalización desde el motor al servidor API para forzar una actualización de la vista del jugador tras eventos críticos como el respawn.
- **Comportamiento NPC**: Corregido el wandering para respetar estrictamente los límites de área (`areaId`), evitando que monstruos invadan zonas urbanas.

### 3. Documentación y Reportes
- **`docs/reporte-testers.md`**: Limpieza de logs antiguos y reestructuración para incluir secciones de Inmersión, IA, Mapa y Progreso.
- **`docs/skills/testrun.md`**: Actualizado con los nuevos criterios de calidad exigidos a los agentes de prueba.

## Impacto
El sistema de pruebas ahora proporciona información cualitativa valiosa sobre la experiencia de juego, permitiendo identificar errores de diseño (como salidas no descritas) de forma automática.
