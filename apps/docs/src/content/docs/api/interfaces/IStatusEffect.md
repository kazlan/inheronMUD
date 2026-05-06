---
title: "Interface: IStatusEffect"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / IStatusEffect

# Interface: IStatusEffect

Defined in: [packages/engine/src/interfaces/combat.interface.ts:31](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L31)

## Properties

### duration

> **duration**: `number`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:34](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L34)

***

### id

> **id**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:32](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L32)

***

### modifiers?

> `optional` **modifiers?**: `Record`\<`string`, `number`\>

Defined in: [packages/engine/src/interfaces/combat.interface.ts:37](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L37)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:33](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L33)

***

### onRoundEnd?

> `optional` **onRoundEnd?**: (`participant`) => `void`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:36](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L36)

#### Parameters

##### participant

`any`

#### Returns

`void`

***

### onRoundStart?

> `optional` **onRoundStart?**: (`participant`) => `void`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:35](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/interfaces/combat.interface.ts#L35)

#### Parameters

##### participant

`any`

#### Returns

`void`
