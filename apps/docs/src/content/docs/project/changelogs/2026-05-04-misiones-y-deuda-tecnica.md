---
title: "Changelog - 2026-05-04 (Parte II) - Sistema de Misiones, Variables y Deuda Técnica"
---

# Changelog - 2026-05-04 (Parte II) - Sistema de Misiones, Variables y Deuda Técnica

## Resumen de Cambios
En esta segunda fase de la sesión, se ha implementado la infraestructura necesaria para misiones dinámicas con objetivos numéricos y se ha documentado la deuda técnica del motor.

### 1. Sistema de Crónica y Misiones (`packages/engine`)
- **Crónica Viva con Variables**: Se ha añadido un sistema de `variables` (Map<string, string>) al modelo `CronicaViva`. Esto permite rastrear contadores (ej: enemigos eliminados) que persisten en la base de datos.
- **Progresión Automática**: El `GameEngine` ahora detecta la muerte de NPCs relevantes y actualiza automáticamente los contadores de misión en la crónica del jugador (ej: incremento de `lobos_muertos`).
- **Indicadores Dinámicos**: El `CommandManager` ahora utiliza el sistema de variables para calcular en tiempo real si un NPC debe mostrar un indicador de "Misión Disponible" (`!`) o "Lista para Entregar" (`?`).
- **Sincronización de Diálogos**: Se ha actualizado el parser de diálogos para soportar condiciones basadas en las nuevas variables de la crónica (comparación de valores mínimos).

### 2. Inteligencia Artificial de Testers (`tester-client.ts`)
- **Navegación Inteligente**: Los testers ahora conocen la topografía básica de Villaclara y pueden navegar hacia la Plaza para buscar misiones o hacia los campos para cazar si tienen una misión activa.
- **Lógica de Misiones**: Implementada una máquina de estados para que los testers acepten, ejecuten (caza de 3 lobos) y entreguen misiones de forma autónoma.
- **Validación Narrativa**: Los testers verifican y reportan en los logs si los mensajes de los NPCs durante las distintas fases de una misión son coherentes con el diseño.

### 3. Documentación de Arquitectura
- **`docs/Inheron Engine/stuff.md`**: Creado un registro exhaustivo de la deuda técnica ("Hardcoded Stuff"). Incluye valores de combate, lógica de IA, umbrales de huida y parámetros de economía que actualmente están en el código y deben migrarse a YAML.
- **Bitácora de Desarrollo**: Actualización de los documentos de servicios y comandos para reflejar las nuevas capacidades de la Crónica Viva.

## Impacto
El motor de juego ahora es capaz de gestionar misiones con objetivos de combate ("Kill Quests") de forma nativa a través de datos, sin necesidad de scripting adicional por cada misión. Los testers ahora validan no solo la estabilidad técnica, sino el ciclo de progresión del jugador.
