# Changelog: Refactorización y Vida en Villaclara
**Fecha:** 2026-05-07
**Agente:** Antigravity

## Resumen
En esta sesión nos enfocamos en refinar el comportamiento del motor para la generación de NPCs y en darle vida a los habitantes sociales del paquete MVP canónico de Villaclara. Se eliminaron "parches rápidos" introducidos durante el desarrollo inicial para asentar unas bases arquitectónicas más limpias y se incorporó un sistema de inmersión ambiental manejado por datos YAML.

## Cambios Principales

### 1. Motor Core (`packages/engine`)
- **Estadísticas de Entidades (`EntityManager.ts`)**: 
  - Refactorizada la creación y registro de NPCs. El motor ahora invoca al `StatCalculator` de manera centralizada al registrar cada NPC, inicializando de forma síncrona y precisa su `hpCurrent` y `hpMax` (resolviendo bugs pasados de entidades zombis o HP `undefined`).
  - Gracias a lo anterior, se han eliminado todos los *type assertions* confusos y lógicas defensivas en `CommandManager` y `SkillManager` respecto a la vida indefinida de los monstruos.
- **Data Loader (`loader.ts`)**:
  - Eliminado el hardcoding de exclusión de prefijos (`old_`). El motor confía plenamente en la convención estándar del sistema operativo ignorando directorios que comienzan por `.` (ej: `.old_clara`), permitiendo un manejo de módulos en desarrollo mucho más limpio.
- **Inteligencia Artificial (`AIManager.ts`)**:
  - Actualizado el método `handleSocial` para leer dinámicamente propiedades de comportamiento desde el YAML (`metadata.ambientMessages` y `metadata.greetings`).
  - Añadido soporte de variables de plantilla `{npc}` y `{player}` para los mensajes de saludo, generando interactividad textual dinámica.

- **Sistema de Objetos (`CommandManager.ts`)**:
  - Enriquecido el comando `examine` para mostrar visualmente a los jugadores la metadata narrativa de los objetos (rareza por colores, rango de misiones `rank`, etiquetas del lore `tags`, y advertencias de pistas `clueRoutes`).
- **Sistema de Crónica y Validación (`loader.ts`, `schemas.ts`, `world-factory.ts`)**:
  - El motor ahora carga y procesa los archivos `rumors-cronica.yml` en la inicialización de cada área.
  - Implementada la validación `zod` estricta para la estructura de `RumorSchema` y corregida la validación de `SpawnerSchema` (cambiando `weight` por `chance` y agregando soporte para jefes `unique`).

### 2. Diseño de Datos y Atmósfera (`areas/villaclara/npcs.yml`)
Se ha dado vida a los 6 NPCs sociales principales de la ciudad (Doña Marga, Pex, Otilia, Bimba, Varo y Silo), añadiendo:
- **`ambientMessages`**: Arrays de rutinas descriptivas (ej: *limpia la plumilla con extremo cuidado*, *comprueba la temperatura de los hornos*).
- **`greetings`**: Diálogos o gestos introductorios personalizados para cada NPC al percibir a un jugador nuevo.

### 3. Documentación
- Actualizada la guía del desarrollador/constructor (`docs/guias/manual-creacion-zonas.md`) para documentar detalladamente:
  - Saludos y rutinas ambientales (`greetings`, `ambientMessages`).
  - Parámetros de Spawners (`intervalMs`, `chance`, `unique`).
  - Metadatos de objetos de Misión/Pista (`rank`, `tags`, `clueFor`).
  - Archivos de Crónica y Rumores (`rumors-cronica.yml`).

## Próximos Pasos
- Integración de los diálogos condicionales (`requires_cronica`, `requires_flag`) en verdaderas misiones estructuradas para el Mileston 1 (Personajes y Progresión 1-60).
- Diseño y poblamiento del Campo Norte para combate de niveles 1 a 3.
