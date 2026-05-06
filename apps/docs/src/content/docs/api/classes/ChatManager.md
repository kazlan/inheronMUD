---
title: "Class: ChatManager"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / ChatManager

# Class: ChatManager

Defined in: [packages/engine/src/core/chat-manager.ts:4](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L4)

## Constructors

### Constructor

> **new ChatManager**(`engine`): `ChatManager`

Defined in: [packages/engine/src/core/chat-manager.ts:7](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L7)

#### Parameters

##### engine

[`GameEngine`](GameEngine.md)

#### Returns

`ChatManager`

## Methods

### channelMessage()

> **channelMessage**(`playerId`, `channelName`, `message`): `Promise`\<`any`\>

Defined in: [packages/engine/src/core/chat-manager.ts:156](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L156)

#### Parameters

##### playerId

`string`

##### channelName

`string`

##### message

`string`

#### Returns

`Promise`\<`any`\>

***

### processAdminCommand()

> **processAdminCommand**(`playerId`, `args`): `Promise`\<`any`\>

Defined in: [packages/engine/src/core/chat-manager.ts:89](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L89)

#### Parameters

##### playerId

`string`

##### args

`string`[]

#### Returns

`Promise`\<`any`\>

***

### say()

> **say**(`playerId`, `message`): `any`

Defined in: [packages/engine/src/core/chat-manager.ts:11](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L11)

#### Parameters

##### playerId

`string`

##### message

`string`

#### Returns

`any`

***

### tell()

> **tell**(`playerId`, `targetName`, `message`): `any`

Defined in: [packages/engine/src/core/chat-manager.ts:39](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L39)

#### Parameters

##### playerId

`string`

##### targetName

`string`

##### message

`string`

#### Returns

`any`

***

### yell()

> **yell**(`playerId`, `message`): `any`

Defined in: [packages/engine/src/core/chat-manager.ts:74](https://github.com/kazlan/inheronMUD/blob/31983555c8e67c86b685f8ad89d9667b7c7ad6ff/packages/engine/src/core/chat-manager.ts#L74)

#### Parameters

##### playerId

`string`

##### message

`string`

#### Returns

`any`
