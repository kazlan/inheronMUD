---
title: "Class: AdminManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / AdminManager

# Class: AdminManager

Defined in: packages/engine/src/core/admin-manager.ts:10

AdminManager handles administrative commands and debugging tools.
It has higher privileges than the standard CommandManager.

## Constructors

### Constructor

> **new AdminManager**(`engine`): `AdminManager`

Defined in: packages/engine/src/core/admin-manager.ts:11

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

#### Returns

`AdminManager`

## Methods

### debugPlayer()

> **debugPlayer**(`playerId`): `any`

Defined in: packages/engine/src/core/admin-manager.ts:132

Returns a detailed report of a player's state.

#### Parameters

##### playerId

`string`

#### Returns

`any`

***

### giveItem()

> **giveItem**(`playerId`, `itemTemplateId`): `object`

Defined in: packages/engine/src/core/admin-manager.ts:101

Gives an item to a player.

#### Parameters

##### playerId

`string`

##### itemTemplateId

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### goto()

> **goto**(`playerId`, `targetRoomId`): `object`

Defined in: packages/engine/src/core/admin-manager.ts:16

Teleports a player to a specific room.

#### Parameters

##### playerId

`string`

##### targetRoomId

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### inspectRoom()

> **inspectRoom**(`adminId`): `any`

Defined in: packages/engine/src/core/admin-manager.ts:155

Returns a detailed report of a room's state.

#### Parameters

##### adminId

`string`

#### Returns

`any`

***

### setFlag()

> **setFlag**(`playerId`, `flag`, `value?`): `object`

Defined in: packages/engine/src/core/admin-manager.ts:88

Sets a memory flag for a player.

#### Parameters

##### playerId

`string`

##### flag

`string`

##### value?

`any`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### spawn()

> **spawn**(`adminId`, `npcTemplateId`): `object`

Defined in: packages/engine/src/core/admin-manager.ts:119

Spawns an NPC in the current room.

#### Parameters

##### adminId

`string`

##### npcTemplateId

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### summon()

> **summon**(`adminId`, `targetEntityId`): `object`

Defined in: packages/engine/src/core/admin-manager.ts:45

Summons an entity (NPC or Player) to the admin's location.

#### Parameters

##### adminId

`string`

##### targetEntityId

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`
