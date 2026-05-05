# Deuda Técnica: Lógica Hardcoded en Inheron Engine

Este archivo lista las funcionalidades y valores que actualmente están "hardcoded" en el código fuente de TypeScript y que deberían migrarse a archivos de configuración (YAML) o a sistemas de datos dinámicos.

## 1. Inteligencia Artificial (`ai-manager.ts`)
- **Curación de Healers**: 
    - Intervalo fijo de 15 segundos.
    - Curación fija de `20% HP + 10`.
    - Mensajes de ambiente de curación fijos.
- **Umbral de Cobardía**: Los NPCs huyen exactamente al estar por debajo del `30% HP`.
- **Mensajes Sociales**: 
    - Probabilidad del 50% de saludar.
    - Lista de `genericMessages` ("te observa con curiosidad", etc.) definida en el código.
- **Tiempos de Acción**: 
    - Wandering: 10-30s.
    - Patrol: 5-10s.
    - Ambient: 30-60s.

## 2. Sistema de Combate (`combat-manager.ts`)
- **Evasión**: Probabilidad base fija del `15%`.
- **Críticos**: Probabilidad base fija del `10%`. Multiplicador fijo de `x2`.
- **Daño Desarmado**: Daño base de `1d4 + 1`.
- **Descripciones de Ataque**: Los verbos ("taja", "golpea", "muerde", "araña") y las partes del cuerpo ("pecho", "flanco") están definidos en arrays dentro del método `processRound`.

## 3. Motor de Juego (`game-engine.ts`)
- **Rutina de Muerte**:
    - Punto de respawn fijo: `villaclara_plaza`.
    - Penalización de XP fija: `10%`.
    - HP tras respawn fija: `10%`.
- **Recompensas**:
    - Cálculo de monedas: `Nivel * random(2-5)`.
    - XP base por victoria: `25 + (Nivel * 5)`.

## 4. Gestión de Sesión y Creación (`session.ts` / `character-creator.ts`)
- **Estadísticas Base**: El valor inicial de todos los atributos es `5`.
- **Puntos a Distribuir**: Total de `6` puntos fijos.
- **Rango Inicial**: Los personajes nuevos siempre empiezan con el rango de gremio `'COBRE'`.
- **HP Inicial**: Se fija manualmente a `100` durante la creación, ignorando a veces el cálculo derivado.

## 5. Comandos de Usuario (`command-manager.ts`)
- **Comando `heal`**: 
    - Curación fija de `20 PV`.
    - Coste de energía fijo (implícito en la lógica de demo).
- **Probabilidad de Huida**: Éxito fijo del `75%`.

## 6. Efectos Ambientales (`effects-manager.ts`)
- **Tipos de Efectos**: Solo `damage` y `heal` están implementados con lógica específica. Otros estados alterados no tienen soporte de motor.
- **Tick Rate**: Aunque el engine tiene un tick, el `EffectsManager` procesa a su propio ritmo hardcoded.

---
**Nota para el Agente:** Al refactorizar, priorizar mover estos valores a `system/config.yml` o a los metadatos de las entidades en sus respectivos `npcs.yml` e `items.yml`.
