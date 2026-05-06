---
title: "Class: CombatManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / CombatManager

# Class: CombatManager

Defined in: [packages/engine/src/core/combat-manager.ts:22](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L22)

## Constructors

### Constructor

> **new CombatManager**(`participants`): `CombatManager`

Defined in: [packages/engine/src/core/combat-manager.ts:28](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L28)

#### Parameters

##### participants

[`CombatParticipant`](../interfaces/CombatParticipant.md)[]

#### Returns

`CombatManager`

## Properties

### active

> **active**: `boolean` = `true`

Defined in: [packages/engine/src/core/combat-manager.ts:26](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L26)

***

### currentRound

> **currentRound**: `number` = `0`

Defined in: [packages/engine/src/core/combat-manager.ts:25](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L25)

***

### id

> `readonly` **id**: `string`

Defined in: [packages/engine/src/core/combat-manager.ts:23](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L23)

***

### participants

> **participants**: [`CombatParticipant`](../interfaces/CombatParticipant.md)[] = `[]`

Defined in: [packages/engine/src/core/combat-manager.ts:24](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L24)

## Methods

### getParticipantTurnOrder()

> **getParticipantTurnOrder**(): [`CombatParticipant`](../interfaces/CombatParticipant.md)[]

Defined in: [packages/engine/src/core/combat-manager.ts:147](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L147)

#### Returns

[`CombatParticipant`](../interfaces/CombatParticipant.md)[]

***

### processRound()

> **processRound**(): `string`[]

Defined in: [packages/engine/src/core/combat-manager.ts:38](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L38)

#### Returns

`string`[]

***

### removeParticipant()

> **removeParticipant**(`entityId`): `void`

Defined in: [packages/engine/src/core/combat-manager.ts:151](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/combat-manager.ts#L151)

#### Parameters

##### entityId

`string`

#### Returns

`void`
