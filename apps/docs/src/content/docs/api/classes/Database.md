---
title: "Class: Database"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / Database

# Class: Database

Defined in: [packages/engine/src/data/database.ts:4](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L4)

## Constructors

### Constructor

> **new Database**(): `Database`

#### Returns

`Database`

## Methods

### getInstance()

> `static` **getInstance**(): `PrismaClient`

Defined in: [packages/engine/src/data/database.ts:7](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L7)

#### Returns

`PrismaClient`

***

### loadMemoryFlags()

> `static` **loadMemoryFlags**(`playerId`): `Promise`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/engine/src/data/database.ts:111](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L111)

#### Parameters

##### playerId

`string`

#### Returns

`Promise`\<`Record`\<`string`, `string`\>\>

***

### loadPlayer()

> `static` **loadPlayer**(`id`): `Promise`\<`any`\>

Defined in: [packages/engine/src/data/database.ts:69](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L69)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`any`\>

***

### saveMemoryFlag()

> `static` **saveMemoryFlag**(`playerId`, `key`, `value`): `Promise`\<`void`\>

Defined in: [packages/engine/src/data/database.ts:97](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L97)

#### Parameters

##### playerId

`string`

##### key

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

***

### savePlayer()

> `static` **savePlayer**(`playerData`): `Promise`\<\{ `accountId`: `string`; `classId`: `string`; `coins`: `number`; `createdAt`: `Date`; `energyCurrent`: `number`; `equipment`: `string`; `experience`: `number`; `hpCurrent`: `number`; `id`: `string`; `inventory`: `string`; `level`: `number`; `metadata`: `string`; `name`: `string`; `raceId`: `string`; `role`: `string`; `roomId`: `string`; `stats`: `string`; `updatedAt`: `Date`; \}\>

Defined in: [packages/engine/src/data/database.ts:22](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/data/database.ts#L22)

#### Parameters

##### playerData

`any`

#### Returns

`Promise`\<\{ `accountId`: `string`; `classId`: `string`; `coins`: `number`; `createdAt`: `Date`; `energyCurrent`: `number`; `equipment`: `string`; `experience`: `number`; `hpCurrent`: `number`; `id`: `string`; `inventory`: `string`; `level`: `number`; `metadata`: `string`; `name`: `string`; `raceId`: `string`; `role`: `string`; `roomId`: `string`; `stats`: `string`; `updatedAt`: `Date`; \}\>
