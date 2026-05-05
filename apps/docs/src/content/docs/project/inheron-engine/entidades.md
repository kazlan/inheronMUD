---
title: "Guía de Entidades de InheronMUD"
---

# Guía de Entidades de InheronMUD

InheronMUD utiliza un sistema de entidades desacoplado donde los datos definen el comportamiento.

## 1. Jerarquía del Mundo
1.  **Área**: Una carpeta física en `data/areas/`. Agrupa un conjunto lógico de salas.
2.  **Sala (Room)**: La unidad básica de espacio. Contiene descripciones, salidas, escenografía y entidades.
3.  **Entidad (Entity)**: Todo lo que puede estar "dentro" de una sala.
    - **Jugador (Player)**: Entidad persistente vinculada a una cuenta.
    - **NPC**: Personajes no jugadores (Aliados, Enemigos, Mercaderes).
    - **Objeto (Item)**: Equipo, consumibles, llaves, etc.
4.  **Spawner**: Un motor invisible vinculado a una sala que regenera NPCs específicos.

## 2. Tipos de Entidades en Detalle

### NPCs y Mobs
No hay distinción técnica entre un NPC "pacífico" y un "Mob". La diferencia reside en su `behaviorId` y sus `flags`.
- **Behaviors comunes**:
    - `idle`: No hace nada agresivo.
    - `hostile_beast`: Ataca a jugadores (si tiene el flag `agresivo`) y tiene stats de combate.
    - `merchant_baker` / `merchant_blacksmith`: NPCs con inventario para comercio.
- **Flags**: Definen rasgos de comportamiento extra (ej: `wandering`, `healer`, `cobarde`).

### Objetos (Items)
Clasificados por `type`:
- `EQUIPMENT`: Armas y armaduras que afectan a los stats derivados.
- `CONSUMABLE`: Pociones o comida que se destruyen al usar.
- `QUEST`: Objetos de misión, a menudo no vendibles.
- `KEY`: Objetos necesarios para abrir salidas bloqueadas.

### Escenografía (Scenery)
Elementos estáticos dentro de la descripción de una sala con los que se puede interactuar. No son entidades independientes (no tienen ID único global), sino que pertenecen a la sala.

## 3. Persistencia
- **Estática**: Definida en archivos YAML en `packages/engine/data/`.
- **Dinámica**: El estado de los jugadores y el progreso de la crónica se guarda en la base de datos PostgreSQL mediante Prisma.
- **Memoria**: El estado actual de la salud de los NPCs y su posición se mantiene solo en RAM mientras el servidor está encendido (a menos que se implemente un guardado de estado del mundo).
