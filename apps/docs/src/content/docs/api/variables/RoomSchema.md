---
title: "Variable: RoomSchema"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / RoomSchema

# Variable: RoomSchema

> `const` **RoomSchema**: `ZodObject`\<\{ `area`: `ZodOptional`\<`ZodString`\>; `description`: `ZodString`; `effects`: `ZodOptional`\<`ZodArray`\<`ZodAny`\>\>; `exits`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `description`: `ZodOptional`\<`ZodString`\>; `direction`: `ZodString`; `hidden`: `ZodOptional`\<`ZodBoolean`\>; `keyId`: `ZodOptional`\<`ZodString`\>; `locked`: `ZodOptional`\<`ZodBoolean`\>; `targetRoomId`: `ZodString`; \}, `$strip`\>\>\>; `id`: `ZodString`; `name`: `ZodString`; `scenery`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodUnion`\<readonly \[`ZodString`, `ZodAny`\]\>\>\>; \}, `$strip`\>

Defined in: packages/engine/src/data/schemas.ts:21
