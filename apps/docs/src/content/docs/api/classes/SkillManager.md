---
title: "Class: SkillManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / SkillManager

# Class: SkillManager

Defined in: [packages/engine/src/core/skill-manager.ts:20](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/skill-manager.ts#L20)

## Constructors

### Constructor

> **new SkillManager**(): `SkillManager`

Defined in: [packages/engine/src/core/skill-manager.ts:23](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/skill-manager.ts#L23)

#### Returns

`SkillManager`

## Methods

### getAllSkills()

> **getAllSkills**(): [`SkillDef`](../interfaces/SkillDef.md)[]

Defined in: [packages/engine/src/core/skill-manager.ts:124](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/skill-manager.ts#L124)

#### Returns

[`SkillDef`](../interfaces/SkillDef.md)[]

***

### getSkill()

> **getSkill**(`nameOrId`): [`SkillDef`](../interfaces/SkillDef.md) \| `undefined`

Defined in: [packages/engine/src/core/skill-manager.ts:110](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/skill-manager.ts#L110)

#### Parameters

##### nameOrId

`string`

#### Returns

[`SkillDef`](../interfaces/SkillDef.md) \| `undefined`

***

### loadFromData()

> **loadFromData**(`skillsData`): `void`

Defined in: [packages/engine/src/core/skill-manager.ts:27](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/skill-manager.ts#L27)

#### Parameters

##### skillsData

`any`[]

#### Returns

`void`
