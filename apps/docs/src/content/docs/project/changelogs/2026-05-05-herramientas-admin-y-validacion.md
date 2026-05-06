---
title: "Changelog: Herramientas de Administración e Integridad de Datos (Milestone 0)"
---

# Changelog: Herramientas de Administración e Integridad de Datos (Milestone 0)
**Fecha:** 2026-05-05
**Autor:** Antigravity (AI Assistant)

## Resumen
Se ha completado la infraestructura administrativa y de validación necesaria para soportar el desarrollo de sistemas complejos. Esto incluye comandos de "poder" para el desarrollo y un validador de esquemas para evitar errores en la definición de áreas.

## Cambios Principales

### Core Engine (`packages/engine`)
- **AdminManager**: Nuevo servicio que centraliza acciones administrativas.
  - Implementado `goto(playerId, targetRoomId)` para teletransporte.
  - Implementado `summon(adminId, targetEntityId)` para traer jugadores o NPCs.
  - Implementado `setFlag` y `setVariable` para manipular la memoria de los jugadores.
  - Implementado `giveItem` y `spawn` para generar objetos y NPCs desde plantillas.
  - Implementado `debugPlayer` para obtener un reporte detallado del estado interno de un jugador.
  - Implementado `inspectRoom` para visualizar entidades, IDs y secretos de la sala actual.
- **EntityManager**:
  - Añadidos métodos `movePlayer` y `moveNPC` que garantizan la consistencia de las listas de entidades en las salas durante los desplazamientos.
- **WorldFactory**:
  - Añadidos métodos estáticos `createItem` y `createNPC` para instanciar entidades individuales a partir de sus plantillas YAML en tiempo de ejecución.
- **GameEngine**:
  - Integrado el `AdminManager` y actualizados los métodos de gestión de memoria (`setMemoryFlag`, `setVariable`).
- **Schemas**:
  - Creados esquemas **Zod** para la validación de `Rooms`, `NPCs`, `Items` y `Spawners`.

### Herramientas y Scripts
- **Validator Script (`scripts/validate-world.ts`)**:
  - Herramienta de línea de comandos que valida todos los archivos YAML del mundo.
  - Detecta inconsistencias en tipos, IDs faltantes o estructuras de datos incorrectas.
- **Nuevos Comandos npm**:
  - `pnpm run docs:validate`: Ejecuta el validador del mundo.

### Correcciones de Datos
- Corregidos tipos de items inválidos en `villaclara/items.yml` detectados por el nuevo validador (cambio de `MISC` a tipos soportados por el esquema).

## Metodología de Pruebas
Se ha adoptado una arquitectura de **Pruebas en Memoria** (Decoupled Testing) aprovechando que el motor es puro TypeScript (Regla #3 de AGENTS.md). 

- **Ventaja**: Permite validar comandos administrativos, lógica de movimiento y estados de crónica sin necesidad de levantar el servidor Fastify o abrir conexiones WebSocket.
- **Script de Referencia**: `packages/engine/scratch/test_admin.ts`. Este script simula una sesión de juego completa instanciando el `GameEngine`, poblando el mundo real y ejecutando comandos programáticamente.

## Próximos Pasos
- Iniciar Milestone 1: Diseño e implementación del sistema de Personajes y Progresión (1-60).
- Refinar el sistema de combate para integrar los nuevos hooks administrativos.

---
> [!NOTE]
> Todos los cambios han sido sincronizados con el portal de documentación "Códice de Inheron".
