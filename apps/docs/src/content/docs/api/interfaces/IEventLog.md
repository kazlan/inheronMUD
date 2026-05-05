---
title: "Interface: IEventLog"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / IEventLog

# Interface: IEventLog

Defined in: [packages/engine/src/interfaces/event.interface.ts:16](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/event.interface.ts#L16)

## Methods

### getEvents()

> **getEvents**(`filter?`): [`IEvent`](IEvent.md)[]

Defined in: [packages/engine/src/interfaces/event.interface.ts:18](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/event.interface.ts#L18)

#### Parameters

##### filter?

`Partial`\<[`IEvent`](IEvent.md)\>

#### Returns

[`IEvent`](IEvent.md)[]

***

### log()

> **log**(`event`): [`IEvent`](IEvent.md)

Defined in: [packages/engine/src/interfaces/event.interface.ts:17](https://github.com/kazlan/inheronMUD/blob/b4ba89392ddf52eaadf67d11005cd76e812fc43d/packages/engine/src/interfaces/event.interface.ts#L17)

#### Parameters

##### event

`Omit`\<[`IEvent`](IEvent.md), `"id"` \| `"timestamp"`\>

#### Returns

[`IEvent`](IEvent.md)
