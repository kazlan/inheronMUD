---
title: "Interface: Quest"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Quest

# Interface: Quest

Defined in: [packages/engine/src/interfaces/quest.interface.ts:20](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L20)

## Properties

### consequences?

> `optional` **consequences?**: `object`

Defined in: [packages/engine/src/interfaces/quest.interface.ts:32](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L32)

#### flagsToAdd?

> `optional` **flagsToAdd?**: `string`[]

#### flagsToRemove?

> `optional` **flagsToRemove?**: `string`[]

***

### description

> **description**: `string`

Defined in: [packages/engine/src/interfaces/quest.interface.ts:23](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L23)

***

### id

> **id**: `string`

Defined in: [packages/engine/src/interfaces/quest.interface.ts:21](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L21)

***

### objectives

> **objectives**: [`QuestObjective`](QuestObjective.md)[]

Defined in: [packages/engine/src/interfaces/quest.interface.ts:25](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L25)

***

### rewards

> **rewards**: `object`

Defined in: [packages/engine/src/interfaces/quest.interface.ts:26](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L26)

#### currency?

> `optional` **currency?**: `number`

#### experience?

> `optional` **experience?**: `number`

#### items?

> `optional` **items?**: `string`[]

#### reputation?

> `optional` **reputation?**: `Record`\<`string`, `number`\>

***

### status

> **status**: [`QuestStatus`](../enumerations/QuestStatus.md)

Defined in: [packages/engine/src/interfaces/quest.interface.ts:24](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L24)

***

### title

> **title**: `string`

Defined in: [packages/engine/src/interfaces/quest.interface.ts:22](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/quest.interface.ts#L22)
