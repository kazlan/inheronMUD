---
title: "Class: Spawner"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Spawner

# Class: Spawner

Defined in: [packages/engine/src/models/spawner.model.ts:7](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L7)

## Constructors

### Constructor

> **new Spawner**(`id`, `roomId`, `maxActive`, `intervalMs`, `variants`): `Spawner`

Defined in: [packages/engine/src/models/spawner.model.ts:17](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L17)

#### Parameters

##### id

`string`

##### roomId

`string`

##### maxActive

`number`

##### intervalMs

`number`

##### variants

[`SpawnVariant`](../interfaces/SpawnVariant.md)[]

#### Returns

`Spawner`

## Properties

### activeInstances

> **activeInstances**: `string`[] = `[]`

Defined in: [packages/engine/src/models/spawner.model.ts:15](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L15)

***

### id

> **id**: `string`

Defined in: [packages/engine/src/models/spawner.model.ts:8](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L8)

***

### intervalMs

> **intervalMs**: `number`

Defined in: [packages/engine/src/models/spawner.model.ts:11](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L11)

***

### lastSpawnTime

> **lastSpawnTime**: `number` = `0`

Defined in: [packages/engine/src/models/spawner.model.ts:14](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L14)

***

### maxActive

> **maxActive**: `number`

Defined in: [packages/engine/src/models/spawner.model.ts:10](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L10)

***

### roomId

> **roomId**: `string`

Defined in: [packages/engine/src/models/spawner.model.ts:9](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L9)

***

### variants

> **variants**: [`SpawnVariant`](../interfaces/SpawnVariant.md)[]

Defined in: [packages/engine/src/models/spawner.model.ts:12](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/models/spawner.model.ts#L12)
