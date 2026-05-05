---
title: "Guía Detallada de Parámetros YAML"
---

# Guía Detallada de Parámetros YAML

Esta guía detalla todos los campos disponibles para configurar el mundo de InheronMUD a través de archivos YAML.

## 1. Rooms (`rooms.yml`)
Define la estructura del mapa.
- `id` (string): Identificador único global de la sala.
- `name` (string): Nombre visible para el jugador.
- `description` (string): Texto descriptivo. Se pueden usar palabras clave para interactuar.
- `area` (string, opcional): Sobrescribe el área por defecto de la carpeta.
- `exits` (lista):
    - `direction` (string): `north`, `south`, `up`, `down`, etc.
    - `targetRoomId` (string): El ID de la sala destino.
    - `locked` (boolean, opcional): Si la puerta está cerrada.
    - `keyId` (string, opcional): El ID del objeto necesario para abrirla.
- `scenery` (mapa, opcional):
    - `description` (string): Descripción al mirar el objeto.
    - `interactions` (objeto, opcional):
        - `verbs` (lista): Verbos permitidos (ej: `[empujar, tirar]`).
        - `action` (string): Acción a ejecutar (ej: `unlock_exit`).
        - `target` (string): Objetivo de la acción (ej: `north`).
        - `message` (string): Mensaje al éxito.
- `effects` (lista, opcional): Efectos ambientales constantes en la sala.

## 2. NPCs (`npcs.yml`)
Define los habitantes y monstruos.
- `id` (string): Identificador único.
- `name` (string): Nombre visible.
- `description` (string): Descripción al mirar.
- `behaviorId` (string): `idle`, `hostile_beast`, `hostile_boss`, etc.
- `roomId` (string): Sala donde aparece inicialmente.
- `level` (number): Nivel del NPC (afecta a recompensas y dificultad).
- `flags` (lista): `wandering`, `healer`, `agresivo`, `social`, `cobarde`, `patrol`.
- `stats` (mapa): `fuerza`, `destreza`, `constitucion`, `ingenio`, `sabiduria`, `presencia`, `percepcion`.
- `enemies` (lista, opcional): IDs de otros NPCs que este NPC atacará (facciones).
- `equipment` (mapa, opcional): `weapon`, `head`, `chest`, etc., vinculado a IDs de ítems.
- `inventory` (lista, opcional): Lista de IDs de ítems que lleva encima.
- `metadata` (mapa, opcional):
    - `merchant` (boolean): Si permite comercio.
    - `dialogues` (lista): Nodos de conversación condicionada.
    - `patrolPath` (lista): IDs de salas para la ruta de patrulla.
    - `ambientMessages` (lista): Frases aleatorias que dice el NPC.

## 3. Items (`items.yml`)
Define el equipo y consumibles.
- `id` (string): Identificador único.
- `name` (string): Nombre visible.
- `description` (string): Descripción al mirar.
- `type` (string): `EQUIPMENT`, `CONSUMABLE`, `QUEST`, `KEY`.
- `equipSlot` (string, opcional): `weapon`, `head`, `chest`, `legs`, `feet`.
- `value` (number, opcional): Precio de compra/venta en soles.
- `metadata` (mapa, opcional):
    - `diceCount`, `diceSides`, `modifier`: Configuración de daño para armas.
    - `protection`: Reducción de daño para armaduras.
    - `charges`: Usos limitados para consumibles o varitas.
    - `lightSource`: Si permite ver en salas oscuras.
- `effects` (lista, opcional): Efectos que se aplican al usar o equipar el objeto.

## 4. Spawners (`spawners.yml`)
Controla la regeneración automática.
- `id` (string): Identificador único del spawner.
- `npcId` (string): ID del NPC que genera.
- `roomId` (string): Sala donde aparecen los clones.
- `maxActive` (number): Máximo de instancias de este NPC activas a la vez por este spawner.
- `intervalMs` (number): Tiempo entre intentos de spawn (milisegundos).
- `variants` (lista, opcional): IDs alternativos de NPCs para spawn aleatorio.

## 5. Datos de Sistema (`system/*.yml`)
- **Skills**: Define nombre, descripción, coste y efecto de las habilidades.
- **Classes**: Define los bonos de stats iniciales y habilidades por nivel.
- **Races**: Define los bonos raciales y descripciones.
