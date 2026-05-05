---
title: "Estudio de Servicios de InheronMUD"
---

# Estudio de Servicios de InheronMUD

Este documento detalla el funcionamiento de los servicios centrales que componen el motor de juego de InheronMUD.

## 1. GameEngine (`core/game-engine.ts`)
El corazón del sistema. Coordina todos los demás servicios y maneja el bucle principal de ejecución.
- **Ciclo de Ticks**: Ejecuta un tick global (por defecto cada 2500ms) que procesa:
    - Respawn de entidades.
    - IA de NPCs.
    - Procesamiento de efectos activos (DoTs, HoTs).
    - Rondas de combate activo.
- **Sistema de Eventos**: Hereda de `EventEmitter`. Emite eventos críticos como `combat_message`, `spatial_message`, `chat_message` y `save_player`.
- **Gestión de Muerte**: Contiene la lógica hardcoded de muerte del jugador (pérdida de 10% XP, respawn en Villaclara con 10% HP).

## 2. EntityManager (`core/entity-manager.ts`)
Maneja el almacenamiento en memoria de todas las entidades vivas.
- **Colecciones**: Mantiene Mapas de `players`, `npcs`, `rooms`, `items` y `spawners`.
- **Plantillas**: Almacena `itemTemplates` y `npcTemplates` cargados de YAML para clonar entidades durante el spawn.
- **Consultas**: Proporciona métodos para obtener entidades por ID o filtrar por sala.

## 3. CommandManager (`core/command-manager.ts`)
Implementa la lógica de negocio de las acciones del jugador.
- **Categorías de Comandos**:
    - **Navegación**: `look`, `move`, `open`.
    - **Interacción**: `get`, `drop`, `interact` (incluye lógica contextual).
    - **Combate**: `kill`, `flee`, `heal`.
    - **Información**: `inventory`, `score`, `cronica`.
    - **Equipo**: `equip`, `unequip`.
    - **Economía**: `list`, `buy`, `sell`.
- **Lógica Contextual**: Permite que verbos no registrados se intenten usar como interacciones con el entorno (escenografía).

## 4. CombatManager (`core/combat-manager.ts`)
Gestiona los encuentros de combate por turnos.
- **Iniciativa**: Ordena a los participantes por su estadística de iniciativa.
- **Procesamiento de Ronda**:
    - Calcula evasión (15% base).
    - Calcula críticos (10% base).
    - Gestiona dados de daño basados en equipo (metadatos del arma).
    - Maneja huidas automáticas de NPCs "cobardes".
- **Finalización**: Reparte XP y botín a los supervivientes al terminar.

## 5. AIManager (`core/ai-manager.ts`)
Controla el comportamiento autónomo de los NPCs.
- **Flags de Comportamiento**:
    - `healer`: Cura a jugadores heridos en la misma sala (20% HP + 10).
    - `wandering`: Movimiento aleatorio entre salas (restringido a su `areaId`).
    - `agresivo`: Inicia combate automáticamente al ver a un jugador.
    - `social`: Saluda y emite mensajes de ambiente.
    - `patrol`: Sigue una ruta predefinida en su metadato `patrolPath`.
    - `cobarde`: Huye del combate si tiene poca vida.

## 6. EffectsManager (`core/effects-manager.ts`)
Gestiona los efectos temporales y de ticks.
- **Tipos de Efectos**: Soporta `damage` (daño por tick) y `heal` (curación por tick).
- **AoE**: Soporta efectos de área que afectan a todos en una sala.
- **Persistencia**: Los efectos pueden estar vinculados a la entidad o a objetos equipados.

## 7. RespawnManager (`core/respawn-manager.ts`)
Controla la repoblación del mundo.
- **Spawners**: Monitoriza los puntos de spawn definidos en YAML.
- **Temporizadores**: Maneja los tiempos de espera (`respawnTime`) tras la muerte de un NPC.

## 8. SkillManager (`core/skill-manager.ts`)
Gestiona el catálogo de habilidades disponibles.
- **Carga**: Lee las definiciones de habilidades de `system/skills.yml`.
- **Validación**: Comprueba requisitos (nivel, coste de energía) antes de ejecutar.

## 9. ChatManager (`core/chat-manager.ts`)
Maneja los canales de comunicación.
- **Canales**: `say` (local), `yell` (área), `tell` (privado), `chat` (global).
- **Filtros**: Permite a los administradores silenciar o gestionar canales.

## 10. CharacterCreator (`core/character-creator.ts`)
Se encarga de la lógica de generación de nuevos personajes.
- **Cálculo de Stats**: Suma los valores base con los bonos raciales, bonos de clase y puntos distribuidos por el usuario.
- **Inicialización**: Asigna habilidades iniciales, rasgos raciales y calcula la vida máxima inicial.

## 11. WorldFactory (`core/world-factory.ts`)
El orquestador de datos.
- **Población**: Carga recursivamente todas las áreas y el sistema al inicio.
- **Hot-Reload**: Implementa `fs.watch` para detectar cambios en los archivos YAML y actualizar el mundo en tiempo real sin reiniciar el servidor.
