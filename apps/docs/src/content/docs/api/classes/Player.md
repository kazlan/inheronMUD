---
title: "Class: Player"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Player

# Class: Player

Defined in: [packages/engine/src/models/player.model.ts:13](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L13)

## Extends

- [`Entity`](Entity.md)

## Constructors

### Constructor

> **new Player**(`accountId`, `name`, `stats`, `classId`, `raceId`, `roomId`, `id?`): `Player`

Defined in: [packages/engine/src/models/player.model.ts:30](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L30)

#### Parameters

##### accountId

`string`

##### name

`string`

##### stats

[`Stats`](../interfaces/Stats.md)

##### classId

`string`

##### raceId

`string`

##### roomId

`string`

##### id?

`string`

#### Returns

`Player`

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

### accountId

> **accountId**: `string`

Defined in: [packages/engine/src/models/player.model.ts:14](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L14)

***

### activeEffects

> **activeEffects**: `any`[] = `[]`

Defined in: [packages/engine/src/models/entity.model.ts:8](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L8)

#### Inherited from

[`Entity`](Entity.md).[`activeEffects`](Entity.md#activeeffects)

***

### classId

> **classId**: `string`

Defined in: [packages/engine/src/models/player.model.ts:21](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L21)

***

### coins

> **coins**: `number` = `0`

Defined in: [packages/engine/src/models/player.model.ts:28](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L28)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:6](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L6)

#### Inherited from

[`Entity`](Entity.md).[`description`](Entity.md#description)

***

### energyCurrent?

> `optional` **energyCurrent?**: `number`

Defined in: [packages/engine/src/models/player.model.ts:24](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L24)

***

### energyMax?

> `optional` **energyMax?**: `number`

Defined in: [packages/engine/src/models/player.model.ts:26](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L26)

***

### equipment

> **equipment**: `Record`\<`string`, `string`\> = `{}`

Defined in: [packages/engine/src/models/player.model.ts:20](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L20)

***

### experience

> **experience**: `number` = `0`

Defined in: [packages/engine/src/models/player.model.ts:16](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L16)

***

### hpCurrent?

> `optional` **hpCurrent?**: `number`

Defined in: [packages/engine/src/models/player.model.ts:23](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L23)

***

### hpMax?

> `optional` **hpMax?**: `number`

Defined in: [packages/engine/src/models/player.model.ts:25](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L25)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:4](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L4)

#### Inherited from

[`Entity`](Entity.md).[`id`](Entity.md#id)

***

### inventory

> **inventory**: `string`[] = `[]`

Defined in: [packages/engine/src/models/player.model.ts:19](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L19)

***

### level

> **level**: `number` = `1`

Defined in: [packages/engine/src/models/player.model.ts:15](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L15)

***

### metadata

> **metadata**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/engine/src/models/entity.model.ts:7](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L7)

#### Inherited from

[`Entity`](Entity.md).[`metadata`](Entity.md#metadata)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:5](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L5)

#### Inherited from

[`Entity`](Entity.md).[`name`](Entity.md#name)

***

### raceId

> **raceId**: `string`

Defined in: [packages/engine/src/models/player.model.ts:22](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L22)

***

### role

> **role**: `string` = `'USER'`

Defined in: [packages/engine/src/models/player.model.ts:27](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L27)

***

### roomId

> **roomId**: `string`

Defined in: [packages/engine/src/models/player.model.ts:18](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L18)

***

### stats

> **stats**: [`Stats`](../interfaces/Stats.md)

Defined in: [packages/engine/src/models/player.model.ts:17](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L17)

## Methods

### addExperience()

> **addExperience**(`amount`): `string`[]

Defined in: [packages/engine/src/models/player.model.ts:70](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L70)

#### Parameters

##### amount

`number`

#### Returns

`string`[]

***

### getXpToNextLevel()

> **getXpToNextLevel**(): `number`

Defined in: [packages/engine/src/models/player.model.ts:66](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L66)

#### Returns

`number`

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/player.model.ts:47](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/player.model.ts#L47)

Serializes the entity to a plain object.

#### Returns

`object`

##### accountId

> **accountId**: `string`

##### activeEffects

> **activeEffects**: `any`[]

##### classId

> **classId**: `string`

##### coins

> **coins**: `number`

##### description

> **description**: `string`

##### energyCurrent

> **energyCurrent**: `number` \| `undefined`

##### equipment

> **equipment**: `Record`\<`string`, `string`\>

##### experience

> **experience**: `number`

##### hpCurrent

> **hpCurrent**: `number` \| `undefined`

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

##### raceId

> **raceId**: `string`

##### role

> **role**: `string`

##### roomId

> **roomId**: `string`

##### stats

> **stats**: [`Stats`](../interfaces/Stats.md)

##### type

> **type**: `string`

#### Overrides

[`Entity`](Entity.md).[`toJSON`](Entity.md#tojson)
