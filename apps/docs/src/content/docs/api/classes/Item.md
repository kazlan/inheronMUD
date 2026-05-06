---
title: "Class: Item"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Item

# Class: Item

Defined in: [packages/engine/src/models/item.model.ts:11](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L11)

## Extends

- [`Entity`](Entity.md)

## Constructors

### Constructor

> **new Item**(`name`, `description`, `type`, `id?`): `Item`

Defined in: [packages/engine/src/models/item.model.ts:19](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L19)

#### Parameters

##### name

`string`

##### description

`string`

##### type

[`ItemType`](../enumerations/ItemType.md)

##### id?

`string`

#### Returns

`Item`

#### Overrides

[`Entity`](Entity.md).[`constructor`](Entity.md#constructor)

## Properties

### activeEffects

> **activeEffects**: `any`[] = `[]`

Defined in: [packages/engine/src/models/entity.model.ts:8](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L8)

#### Inherited from

[`Entity`](Entity.md).[`activeEffects`](Entity.md#activeeffects)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:6](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L6)

#### Inherited from

[`Entity`](Entity.md).[`description`](Entity.md#description)

***

### equipSlot?

> `optional` **equipSlot?**: `string`

Defined in: [packages/engine/src/models/item.model.ts:15](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L15)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:4](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L4)

#### Inherited from

[`Entity`](Entity.md).[`id`](Entity.md#id)

***

### metadata

> **metadata**: `Record`\<`string`, `any`\> = `{}`

Defined in: [packages/engine/src/models/item.model.ts:17](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L17)

#### Overrides

[`Entity`](Entity.md).[`metadata`](Entity.md#metadata)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/models/entity.model.ts:5](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/entity.model.ts#L5)

#### Inherited from

[`Entity`](Entity.md).[`name`](Entity.md#name)

***

### roomId?

> `optional` **roomId?**: `string`

Defined in: [packages/engine/src/models/item.model.ts:16](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L16)

***

### type

> **type**: [`ItemType`](../enumerations/ItemType.md)

Defined in: [packages/engine/src/models/item.model.ts:12](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L12)

***

### value

> **value**: `number` = `0`

Defined in: [packages/engine/src/models/item.model.ts:14](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L14)

***

### weight

> **weight**: `number` = `0`

Defined in: [packages/engine/src/models/item.model.ts:13](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L13)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/engine/src/models/item.model.ts:29](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/item.model.ts#L29)

Serializes the entity to a plain object.

#### Returns

`object`

##### activeEffects

> **activeEffects**: `any`[]

##### description

> **description**: `string`

##### equipSlot

> **equipSlot**: `string` \| `undefined`

##### id

> **id**: `string`

##### metadata

> **metadata**: `Record`\<`string`, `any`\>

##### name

> **name**: `string`

##### type

> **type**: [`ItemType`](../enumerations/ItemType.md)

##### value

> **value**: `number`

##### weight

> **weight**: `number`

#### Overrides

[`Entity`](Entity.md).[`toJSON`](Entity.md#tojson)
