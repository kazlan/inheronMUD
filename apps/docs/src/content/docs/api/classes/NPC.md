---
title: "Class: NPC"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / NPC

# Class: NPC

Defined in: [packages/engine/src/models/npc.model.ts:4](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L4)

## Extends

- [`Entity`](Entity.md)

## Constructors

### Constructor

> **new NPC**(`name`, `description`, `stats`, `behaviorId`, `roomId`, `id?`): `NPC`

Defined in: [packages/engine/src/models/npc.model.ts:17](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L17)

#### Parameters

##### name

`string`

##### description

`string`

##### stats

[`Stats`](../interfaces/Stats.md)

##### behaviorId

`string`

##### roomId

`string`

##### id?

`string`

#### Returns

`NPC`

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

### activeEffects

> **activeEffects**: `any`[] = `[]`

Defined in: [packages/engine/src/models/entity.model.ts:8](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L8)

#### Inherited from

[`Entity`](Entity.md).[`activeEffects`](Entity.md#activeeffects)

***

### aiState

> **aiState**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/engine/src/models/npc.model.ts:12](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L12)

***

### areaId?

> `optional` **areaId?**: `string`

Defined in: [packages/engine/src/models/npc.model.ts:15](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L15)

***

### behaviorId

> **behaviorId**: `string`

Defined in: [packages/engine/src/models/npc.model.ts:9](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L9)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:6](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L6)

#### Inherited from

[`Entity`](Entity.md).[`description`](Entity.md#description)

***

### enemies

> **enemies**: `string`[] = `[]`

Defined in: [packages/engine/src/models/npc.model.ts:14](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L14)

***

### equipment

> **equipment**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/engine/src/models/npc.model.ts:8](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L8)

***

### flags

> **flags**: `string`[] = `[]`

Defined in: [packages/engine/src/models/npc.model.ts:11](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L11)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:4](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L4)

#### Inherited from

[`Entity`](Entity.md).[`id`](Entity.md#id)

***

### inventory

> **inventory**: `string`[] = `[]`

Defined in: [packages/engine/src/models/npc.model.ts:7](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L7)

***

### level

> **level**: `number` = `1`

Defined in: [packages/engine/src/models/npc.model.ts:10](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L10)

***

### metadata

> **metadata**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/engine/src/models/npc.model.ts:13](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L13)

#### Overrides

[`Entity`](Entity.md).[`metadata`](Entity.md#metadata)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:5](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L5)

#### Inherited from

[`Entity`](Entity.md).[`name`](Entity.md#name)

***

### roomId

> **roomId**: `string`

Defined in: [packages/engine/src/models/npc.model.ts:6](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L6)

***

### stats

> **stats**: [`Stats`](../interfaces/Stats.md)

Defined in: [packages/engine/src/models/npc.model.ts:5](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L5)

## Methods

### getXpReward()

> **getXpReward**(): `number`

Defined in: [packages/engine/src/models/npc.model.ts:31](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L31)

#### Returns

`number`

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/npc.model.ts:35](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/npc.model.ts#L35)

Serializes the entity to a plain object.

#### Returns

`object`

##### activeEffects

> **activeEffects**: `any`[]

##### areaId

> **areaId**: `string` \| `undefined`

##### behaviorId

> **behaviorId**: `string`

##### description

> **description**: `string`

##### flags

> **flags**: `string`[]

##### id

> **id**: `string`

##### inventory

> **inventory**: `string`[]

##### level

> **level**: `number`

##### metadata

> **metadata**: `Record`\<`string`, `any`\>

##### name

> **name**: `string`

##### roomId

> **roomId**: `string`

##### stats

> **stats**: [`Stats`](../interfaces/Stats.md)

##### type

> **type**: `string`

#### Overrides

[`Entity`](Entity.md).[`toJSON`](Entity.md#tojson)
