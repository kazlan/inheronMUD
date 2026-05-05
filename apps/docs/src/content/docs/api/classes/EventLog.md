---
title: "Class: EventLog"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / EventLog

# Class: EventLog

Defined in: [packages/engine/src/core/event-log.ts:4](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/event-log.ts#L4)

## Implements

- [`IEventLog`](../interfaces/IEventLog.md)

## Constructors

### Constructor

> **new EventLog**(): `EventLog`

#### Returns

`EventLog`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/engine/src/core/event-log.ts:34](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/event-log.ts#L34)

#### Returns

`void`

***

### getEvents()

> **getEvents**(`filter?`): [`IEvent`](../interfaces/IEvent.md)[]

Defined in: [packages/engine/src/core/event-log.ts:21](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/event-log.ts#L21)

#### Parameters

##### filter?

`Partial`\<[`IEvent`](../interfaces/IEvent.md)\>

#### Returns

[`IEvent`](../interfaces/IEvent.md)[]

#### Implementation of

[`IEventLog`](../interfaces/IEventLog.md).[`getEvents`](../interfaces/IEventLog.md#getevents)

***

### log()

> **log**(`eventData`): [`IEvent`](../interfaces/IEvent.md)

Defined in: [packages/engine/src/core/event-log.ts:7](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/core/event-log.ts#L7)

#### Parameters

##### eventData

`Omit`\<[`IEvent`](../interfaces/IEvent.md), `"id"` \| `"timestamp"`\>

#### Returns

[`IEvent`](../interfaces/IEvent.md)

#### Implementation of

[`IEventLog`](../interfaces/IEventLog.md).[`log`](../interfaces/IEventLog.md#log)
