---
title: "Abstract Class: Entity"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Entity

# Abstract Class: Entity

Defined in: [packages/engine/src/models/entity.model.ts:3](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L3)

## Extended by

- [`Player`](Player.md)
- [`Room`](Room.md)
- [`NPC`](NPC.md)
- [`Item`](Item.md)

## Constructors

### Constructor

> **new Entity**(`name`, `description?`, `id?`): `Entity`

Defined in: [packages/engine/src/models/entity.model.ts:10](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L10)

#### Parameters

##### name

`string`

##### description?

`string` = `''`

##### id?

`string`

#### Returns

`Entity`

## Properties

### activeEffects

> **activeEffects**: `any`[] = `[]`

Defined in: [packages/engine/src/models/entity.model.ts:8](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L8)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:6](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L6)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:4](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L4)

***

### metadata

> **metadata**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/engine/src/models/entity.model.ts:7](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L7)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:5](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L5)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/entity.model.ts:19](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L19)

Serializes the entity to a plain object.

#### Returns

`object`

##### activeEffects

> **activeEffects**: `any`[]

##### description

> **description**: `string`

##### id

> **id**: `string`

##### metadata

> **metadata**: `Record`\<`string`, `any`\>

##### name

> **name**: `string`

##### type

> **type**: `string`
