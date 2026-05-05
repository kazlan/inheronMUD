---
title: "Class: CronicaViva"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / CronicaViva

# Class: CronicaViva

Defined in: [packages/engine/src/models/cronica-viva.model.ts:3](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L3)

## Constructors

### Constructor

> **new CronicaViva**(`playerId`): `CronicaViva`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:11](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L11)

#### Parameters

##### playerId

`string`

#### Returns

`CronicaViva`

## Properties

### activeArcs

> **activeArcs**: `Map`\<`string`, [`StoryArc`](../interfaces/StoryArc.md)\>

Defined in: [packages/engine/src/models/cronica-viva.model.ts:7](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L7)

***

### activeQuests

> **activeQuests**: `Map`\<`string`, [`Quest`](../interfaces/Quest.md)\>

Defined in: [packages/engine/src/models/cronica-viva.model.ts:5](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L5)

***

### completedQuests

> **completedQuests**: `string`[] = `[]`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:6](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L6)

***

### memoryFlags

> **memoryFlags**: `Set`\<`string`\>

Defined in: [packages/engine/src/models/cronica-viva.model.ts:8](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L8)

***

### playerId

> **playerId**: `string`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:4](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L4)

***

### variables

> **variables**: `Map`\<`string`, `string`\>

Defined in: [packages/engine/src/models/cronica-viva.model.ts:9](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L9)

## Methods

### addQuest()

> **addQuest**(`quest`): `void`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:23](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L23)

#### Parameters

##### quest

[`Quest`](../interfaces/Quest.md)

#### Returns

`void`

***

### completeQuest()

> **completeQuest**(`questId`): `void`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:27](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L27)

#### Parameters

##### questId

`string`

#### Returns

`void`

***

### getVariable()

> **getVariable**(`key`): `string`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:19](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L19)

#### Parameters

##### key

`string`

#### Returns

`string`

***

### hasFlag()

> **hasFlag**(`flag`): `boolean`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:41](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L41)

#### Parameters

##### flag

`string`

#### Returns

`boolean`

***

### removeFlag()

> **removeFlag**(`flag`): `void`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:49](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L49)

#### Parameters

##### flag

`string`

#### Returns

`void`

***

### setFlag()

> **setFlag**(`flag`): `void`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:45](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L45)

#### Parameters

##### flag

`string`

#### Returns

`void`

***

### setVariable()

> **setVariable**(`key`, `value`): `void`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:15](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L15)

#### Parameters

##### key

`string`

##### value

`string`

#### Returns

`void`

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/cronica-viva.model.ts:53](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/cronica-viva.model.ts#L53)

#### Returns

`object`

##### activeArcs

> **activeArcs**: [`StoryArc`](../interfaces/StoryArc.md)[]

##### activeQuests

> **activeQuests**: [`Quest`](../interfaces/Quest.md)[]

##### completedQuests

> **completedQuests**: `string`[]

##### memoryFlags

> **memoryFlags**: `string`[]

##### playerId

> **playerId**: `string`

##### variables

> **variables**: `object`

###### Index Signature

\[`k`: `string`\]: `string`
