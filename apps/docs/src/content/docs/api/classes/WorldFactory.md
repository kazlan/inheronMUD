---
title: "Class: WorldFactory"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / WorldFactory

# Class: WorldFactory

Defined in: [packages/engine/src/core/world-factory.ts:10](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L10)

## Constructors

### Constructor

> **new WorldFactory**(): `WorldFactory`

#### Returns

`WorldFactory`

## Methods

### createItem()

> `static` **createItem**(`engine`, `templateId`): [`Item`](Item.md) \| `null`

Defined in: [packages/engine/src/core/world-factory.ts:167](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L167)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

##### templateId

`string`

#### Returns

[`Item`](Item.md) \| `null`

***

### createNPC()

> `static` **createNPC**(`engine`, `templateId`, `roomId`): [`NPC`](NPC.md) \| `null`

Defined in: [packages/engine/src/core/world-factory.ts:185](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L185)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

##### templateId

`string`

##### roomId

`string`

#### Returns

[`NPC`](NPC.md) \| `null`

***

### populate()

> `static` **populate**(`engine`, `areaNames?`): `void`

Defined in: [packages/engine/src/core/world-factory.ts:11](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L11)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

##### areaNames?

`string`[]

#### Returns

`void`

***

### reloadArea()

> `static` **reloadArea**(`engine`, `areaName`): `void`

Defined in: [packages/engine/src/core/world-factory.ts:231](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L231)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

##### areaName

`string`

#### Returns

`void`

***

### watchAllData()

> `static` **watchAllData**(`engine`): `void`

Defined in: [packages/engine/src/core/world-factory.ts:314](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/world-factory.ts#L314)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

#### Returns

`void`
