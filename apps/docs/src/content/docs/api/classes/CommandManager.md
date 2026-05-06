---
title: "Class: CommandManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / CommandManager

# Class: CommandManager

Defined in: [packages/engine/src/core/command-manager.ts:5](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L5)

## Constructors

### Constructor

> **new CommandManager**(`engine`): `CommandManager`

Defined in: [packages/engine/src/core/command-manager.ts:6](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L6)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

#### Returns

`CommandManager`

## Methods

### admin()

> **admin**(`playerId`, `cmd`, `args`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:8](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L8)

#### Parameters

##### playerId

`string`

##### cmd

`string`

##### args

`string`[]

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### buy()

> **buy**(`playerId`, `itemName`, `targetName?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:775](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L775)

#### Parameters

##### playerId

`string`

##### itemName

`string`

##### targetName?

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### cast()

> **cast**(`playerId`, `skillName`, `targetName?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:865](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L865)

#### Parameters

##### playerId

`string`

##### skillName

`string`

##### targetName?

`string`

#### Returns

`object`

##### combatLog?

> `optional` **combatLog?**: `string`[]

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### drop()

> **drop**(`playerId`, `itemName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:402](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L402)

#### Parameters

##### playerId

`string`

##### itemName

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### equip()

> **equip**(`playerId`, `itemName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:448](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L448)

#### Parameters

##### playerId

`string`

##### itemName

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### flee()

> **flee**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:689](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L689)

#### Parameters

##### playerId

`string`

#### Returns

`object`

##### combatLog?

> `optional` **combatLog?**: `string`[]

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### get()

> **get**(`playerId`, `itemName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:376](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L376)

#### Parameters

##### playerId

`string`

##### itemName

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### getEquipment()

> **getEquipment**(`playerId`): `any`

Defined in: [packages/engine/src/core/command-manager.ts:436](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L436)

#### Parameters

##### playerId

`string`

#### Returns

`any`

***

### getFormattedCronica()

> **getFormattedCronica**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:547](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L547)

#### Parameters

##### playerId

`string`

#### Returns

`object`

##### data

> **data**: `any`

##### message

> **message**: `string`

***

### getInventory()

> **getInventory**(`playerId`): `any`[]

Defined in: [packages/engine/src/core/command-manager.ts:427](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L427)

#### Parameters

##### playerId

`string`

#### Returns

`any`[]

***

### getScore()

> **getScore**(`playerId`): `any`

Defined in: [packages/engine/src/core/command-manager.ts:512](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L512)

#### Parameters

##### playerId

`string`

#### Returns

`any`

***

### getSkills()

> **getSkills**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:845](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L845)

#### Parameters

##### playerId

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### heal()

> **heal**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:720](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L720)

#### Parameters

##### playerId

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### interact()

> **interact**(`playerId`, `targetName`, `verb?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:258](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L258)

#### Parameters

##### playerId

`string`

##### targetName

`string`

##### verb?

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### isContextualMatch?

> `optional` **isContextualMatch?**: `boolean`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### kill()

> **kill**(`playerId`, `targetName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:574](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L574)

#### Parameters

##### playerId

`string`

##### targetName

`string`

#### Returns

`object`

##### combatLog?

> `optional` **combatLog?**: `string`[]

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### list()

> **list**(`playerId`, `targetName?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:751](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L751)

#### Parameters

##### playerId

`string`

##### targetName?

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### look()

> **look**(`playerId`, `targetName?`): `any`

Defined in: [packages/engine/src/core/command-manager.ts:42](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L42)

#### Parameters

##### playerId

`string`

##### targetName?

`string`

#### Returns

`any`

***

### move()

> **move**(`playerId`, `direction`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:144](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L144)

#### Parameters

##### playerId

`string`

##### direction

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### roomId?

> `optional` **roomId?**: `string`

##### success

> **success**: `boolean`

***

### open()

> **open**(`playerId`, `direction`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:206](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L206)

#### Parameters

##### playerId

`string`

##### direction

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### sell()

> **sell**(`playerId`, `itemName`, `targetName?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:811](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L811)

#### Parameters

##### playerId

`string`

##### itemName

`string`

##### targetName?

`string`

#### Returns

`object`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### talk()

> **talk**(`playerId`, `targetName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:615](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L615)

#### Parameters

##### playerId

`string`

##### targetName

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`

***

### unequip()

> **unequip**(`playerId`, `slotOrName`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:482](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/command-manager.ts#L482)

#### Parameters

##### playerId

`string`

##### slotOrName

`string`

#### Returns

`object`

##### data?

> `optional` **data?**: `any`

##### message

> **message**: `string`

##### success

> **success**: `boolean`
