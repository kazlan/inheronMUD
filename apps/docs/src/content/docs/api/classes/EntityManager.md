---
title: "Class: EntityManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / EntityManager

# Class: EntityManager

Defined in: [packages/engine/src/core/entity-manager.ts:7](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L7)

## Constructors

### Constructor

> **new EntityManager**(): `EntityManager`

#### Returns

`EntityManager`

## Properties

### items

> **items**: `Map`\<`string`, [`Item`](Item.md)\>

Defined in: [packages/engine/src/core/entity-manager.ts:13](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L13)

***

### itemTemplates

> **itemTemplates**: `Map`\<`string`, `any`\>

Defined in: [packages/engine/src/core/entity-manager.ts:12](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L12)

***

### npcs

> **npcs**: `Map`\<`string`, [`NPC`](NPC.md)\>

Defined in: [packages/engine/src/core/entity-manager.ts:10](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L10)

***

### npcTemplates

> **npcTemplates**: `Map`\<`string`, `any`\>

Defined in: [packages/engine/src/core/entity-manager.ts:11](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L11)

***

### players

> **players**: `Map`\<`string`, [`Player`](Player.md)\>

Defined in: [packages/engine/src/core/entity-manager.ts:8](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L8)

***

### rooms

> **rooms**: `Map`\<`string`, [`Room`](Room.md)\>

Defined in: [packages/engine/src/core/entity-manager.ts:9](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L9)

***

### spawners

> **spawners**: `Map`\<`string`, [`Spawner`](Spawner.md)\>

Defined in: [packages/engine/src/core/entity-manager.ts:14](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L14)

## Methods

### applyEffect()

> **applyEffect**(`entityId`, `effect`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:64](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L64)

#### Parameters

##### entityId

`string`

##### effect

`any`

#### Returns

`void`

***

### getItem()

> **getItem**(`id`): [`Item`](Item.md) \| `undefined`

Defined in: [packages/engine/src/core/entity-manager.ts:52](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L52)

#### Parameters

##### id

`string`

#### Returns

[`Item`](Item.md) \| `undefined`

***

### getNPC()

> **getNPC**(`id`): [`NPC`](NPC.md) \| `undefined`

Defined in: [packages/engine/src/core/entity-manager.ts:48](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L48)

#### Parameters

##### id

`string`

#### Returns

[`NPC`](NPC.md) \| `undefined`

***

### getNPCsInRoom()

> **getNPCsInRoom**(`roomId`): [`NPC`](NPC.md)[]

Defined in: [packages/engine/src/core/entity-manager.ts:76](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L76)

#### Parameters

##### roomId

`string`

#### Returns

[`NPC`](NPC.md)[]

***

### getPlayer()

> **getPlayer**(`id`): [`Player`](Player.md) \| `undefined`

Defined in: [packages/engine/src/core/entity-manager.ts:44](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L44)

#### Parameters

##### id

`string`

#### Returns

[`Player`](Player.md) \| `undefined`

***

### getPlayers()

> **getPlayers**(): [`Player`](Player.md)[]

Defined in: [packages/engine/src/core/entity-manager.ts:72](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L72)

#### Returns

[`Player`](Player.md)[]

***

### getRoom()

> **getRoom**(`id`): [`Room`](Room.md) \| `undefined`

Defined in: [packages/engine/src/core/entity-manager.ts:40](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L40)

#### Parameters

##### id

`string`

#### Returns

[`Room`](Room.md) \| `undefined`

***

### getSpawner()

> **getSpawner**(`id`): [`Spawner`](Spawner.md) \| `undefined`

Defined in: [packages/engine/src/core/entity-manager.ts:56](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L56)

#### Parameters

##### id

`string`

#### Returns

[`Spawner`](Spawner.md) \| `undefined`

***

### registerItem()

> **registerItem**(`item`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:32](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L32)

#### Parameters

##### item

[`Item`](Item.md)

#### Returns

`void`

***

### registerNPC()

> **registerNPC**(`npc`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:24](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L24)

#### Parameters

##### npc

[`NPC`](NPC.md)

#### Returns

`void`

***

### registerNPCTemplate()

> **registerNPCTemplate**(`id`, `data`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:28](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L28)

#### Parameters

##### id

`string`

##### data

`any`

#### Returns

`void`

***

### registerPlayer()

> **registerPlayer**(`player`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:20](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L20)

#### Parameters

##### player

[`Player`](Player.md)

#### Returns

`void`

***

### registerRoom()

> **registerRoom**(`room`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:16](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L16)

#### Parameters

##### room

[`Room`](Room.md)

#### Returns

`void`

***

### registerSpawner()

> **registerSpawner**(`spawner`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:36](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L36)

#### Parameters

##### spawner

[`Spawner`](Spawner.md)

#### Returns

`void`

***

### removeItem()

> **removeItem**(`id`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:80](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L80)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### removeNPC()

> **removeNPC**(`id`): `void`

Defined in: [packages/engine/src/core/entity-manager.ts:60](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/entity-manager.ts#L60)

#### Parameters

##### id

`string`

#### Returns

`void`
