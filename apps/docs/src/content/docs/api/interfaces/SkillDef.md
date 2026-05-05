---
title: "Interface: SkillDef"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / SkillDef

# Interface: SkillDef

Defined in: [packages/engine/src/core/skill-manager.ts:9](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L9)

## Properties

### cooldown

> **cooldown**: `number`

Defined in: [packages/engine/src/core/skill-manager.ts:14](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L14)

***

### description

> **description**: `string`

Defined in: [packages/engine/src/core/skill-manager.ts:12](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L12)

***

### effects?

> `optional` **effects?**: `any`[]

Defined in: [packages/engine/src/core/skill-manager.ts:16](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L16)

***

### energyCost

> **energyCost**: `number`

Defined in: [packages/engine/src/core/skill-manager.ts:13](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L13)

***

### execute

> **execute**: (`engine`, `casterId`, `targetId?`) => [`SkillResult`](SkillResult.md)

Defined in: [packages/engine/src/core/skill-manager.ts:17](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L17)

#### Parameters

##### engine

[`GameEngine`](../classes/GameEngine.md)

##### casterId

`string`

##### targetId?

`string`

#### Returns

[`SkillResult`](SkillResult.md)

***

### id

> **id**: `string`

Defined in: [packages/engine/src/core/skill-manager.ts:10](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L10)

***

### name

> **name**: `string`

Defined in: [packages/engine/src/core/skill-manager.ts:11](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L11)

***

### type

> **type**: `"damage"` \| `"heal"` \| `"buff"` \| `"utility"`

Defined in: [packages/engine/src/core/skill-manager.ts:15](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/skill-manager.ts#L15)
