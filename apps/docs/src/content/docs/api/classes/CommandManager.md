---
title: "Class: CommandManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / CommandManager

# Class: CommandManager

Defined in: [packages/engine/src/core/command-manager.ts:5](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L5)

## Constructors

### Constructor

> **new CommandManager**(`engine`): `CommandManager`

Defined in: [packages/engine/src/core/command-manager.ts:6](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L6)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

#### Returns

`CommandManager`

## Methods

### buy()

> **buy**(`playerId`, `itemName`, `targetName?`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:751](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L751)

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

Defined in: [packages/engine/src/core/command-manager.ts:841](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L841)

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

Defined in: [packages/engine/src/core/command-manager.ts:378](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L378)

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

Defined in: [packages/engine/src/core/command-manager.ts:424](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L424)

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

Defined in: [packages/engine/src/core/command-manager.ts:665](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L665)

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

Defined in: [packages/engine/src/core/command-manager.ts:352](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L352)

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

Defined in: [packages/engine/src/core/command-manager.ts:412](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L412)

#### Parameters

##### playerId

`string`

#### Returns

`any`

***

### getFormattedCronica()

> **getFormattedCronica**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:523](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L523)

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

Defined in: [packages/engine/src/core/command-manager.ts:403](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L403)

#### Parameters

##### playerId

`string`

#### Returns

`any`[]

***

### getScore()

> **getScore**(`playerId`): `any`

Defined in: [packages/engine/src/core/command-manager.ts:488](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L488)

#### Parameters

##### playerId

`string`

#### Returns

`any`

***

### getSkills()

> **getSkills**(`playerId`): `object`

Defined in: [packages/engine/src/core/command-manager.ts:821](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L821)

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

Defined in: [packages/engine/src/core/command-manager.ts:696](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L696)

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

Defined in: [packages/engine/src/core/command-manager.ts:234](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L234)

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

Defined in: [packages/engine/src/core/command-manager.ts:550](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L550)

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

Defined in: [packages/engine/src/core/command-manager.ts:727](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L727)

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

Defined in: [packages/engine/src/core/command-manager.ts:18](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L18)

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

Defined in: [packages/engine/src/core/command-manager.ts:120](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L120)

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

Defined in: [packages/engine/src/core/command-manager.ts:182](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L182)

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

Defined in: [packages/engine/src/core/command-manager.ts:787](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L787)

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

Defined in: [packages/engine/src/core/command-manager.ts:591](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L591)

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

Defined in: [packages/engine/src/core/command-manager.ts:458](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/command-manager.ts#L458)

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
