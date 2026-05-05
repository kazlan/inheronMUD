---
title: "Interface: ICombatAction"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / ICombatAction

# Interface: ICombatAction

Defined in: [packages/engine/src/interfaces/combat.interface.ts:10](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L10)

## Properties

### actorId

> **actorId**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:14](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L14)

***

### cost

> **cost**: `object`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:16](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L16)

#### energy?

> `optional` **energy?**: `number`

#### resource?

> `optional` **resource?**: `object`

##### resource.name

> **name**: `string`

##### resource.value

> **value**: `number`

***

### execute

> **execute**: (`engine`, `combat`) => [`ICombatResult`](ICombatResult.md)

Defined in: [packages/engine/src/interfaces/combat.interface.ts:20](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L20)

#### Parameters

##### engine

`any`

##### combat

`any`

#### Returns

[`ICombatResult`](ICombatResult.md)

***

### id

> **id**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:11](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L11)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:12](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L12)

***

### targetId?

> `optional` **targetId?**: `string`

Defined in: [packages/engine/src/interfaces/combat.interface.ts:15](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L15)

***

### type

> **type**: [`ActionType`](../enumerations/ActionType.md)

Defined in: [packages/engine/src/interfaces/combat.interface.ts:13](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/combat.interface.ts#L13)
