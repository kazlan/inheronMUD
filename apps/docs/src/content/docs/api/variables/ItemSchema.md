---
title: "Variable: ItemSchema"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / ItemSchema

# Variable: ItemSchema

> `const` **ItemSchema**: `ZodObject`\<\{ `description`: `ZodString`; `equipSlot`: `ZodOptional`\<`ZodString`\>; `id`: `ZodString`; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `name`: `ZodString`; `roomId`: `ZodOptional`\<`ZodString`\>; `type`: `ZodEnum`\<\{ `CONSUMABLE`: `"CONSUMABLE"`; `EQUIPMENT`: `"EQUIPMENT"`; `KEY`: `"KEY"`; `MISC`: `"MISC"`; `QUEST`: `"QUEST"`; `TRASH`: `"TRASH"`; \}\>; `value`: `ZodOptional`\<`ZodNumber`\>; \}, `$strip`\>

Defined in: packages/engine/src/data/schemas.ts:46
