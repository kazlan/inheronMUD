---
title: "Class: Room"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Room

# Class: Room

Defined in: [packages/engine/src/models/room.model.ts:11](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L11)

## Extends

- [`Entity`](Entity.md)

## Constructors

### Constructor

> **new Room**(`name`, `description?`, `id?`, `areaId?`): `Room`

Defined in: [packages/engine/src/models/room.model.ts:17](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L17)

#### Parameters

##### name

`string`

##### description?

`string` = `''`

##### id?

`string`

##### areaId?

`string`

#### Returns

`Room`

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

### activeEffects

> **activeEffects**: `any`[] = `[]`

Defined in: [packages/engine/src/models/entity.model.ts:8](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L8)

#### Inherited from

[`Entity`](Entity.md).[`activeEffects`](Entity.md#activeeffects)

***

### areaId?

> `optional` **areaId?**: `string`

Defined in: [packages/engine/src/models/room.model.ts:14](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L14)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:6](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L6)

#### Inherited from

[`Entity`](Entity.md).[`description`](Entity.md#description)

***

### entities

> **entities**: `string`[] = `[]`

Defined in: [packages/engine/src/models/room.model.ts:13](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L13)

***

### exits

> **exits**: [`Exit`](../interfaces/Exit.md)[] = `[]`

Defined in: [packages/engine/src/models/room.model.ts:12](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L12)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:4](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/entity.model.ts#L4)

#### Inherited from

[`Entity`](Entity.md).[`id`](Entity.md#id)

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

### scenery?

> `optional` **scenery?**: `Record`\<`string`, `any`\>

Defined in: [packages/engine/src/models/room.model.ts:15](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L15)

## Methods

### addEntity()

> **addEntity**(`entityId`): `void`

Defined in: [packages/engine/src/models/room.model.ts:26](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L26)

#### Parameters

##### entityId

`string`

#### Returns

`void`

***

### addExit()

> **addExit**(`exit`): `void`

Defined in: [packages/engine/src/models/room.model.ts:22](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L22)

#### Parameters

##### exit

[`Exit`](../interfaces/Exit.md)

#### Returns

`void`

***

### removeEntity()

> **removeEntity**(`entityId`): `void`

Defined in: [packages/engine/src/models/room.model.ts:32](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L32)

#### Parameters

##### entityId

`string`

#### Returns

`void`

***

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/room.model.ts:36](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/models/room.model.ts#L36)

Serializes the entity to a plain object.

#### Returns

`object`

##### activeEffects

> **activeEffects**: `any`[]

##### description

> **description**: `string`

##### entities

> **entities**: `string`[]

##### exits

> **exits**: [`Exit`](../interfaces/Exit.md)[]

##### id

> **id**: `string`

##### metadata

> **metadata**: `Record`\<`string`, `any`\>

##### name

> **name**: `string`

##### type

> **type**: `string`

#### Overrides

[`Entity`](Entity.md).[`toJSON`](Entity.md#tojson)
