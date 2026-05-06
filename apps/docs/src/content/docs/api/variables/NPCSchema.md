---
title: "Variable: NPCSchema"
---

[**Inheron Engine API Reference**](../README.md)

***

[Inheron Engine API Reference](../globals.md) / NPCSchema

# Variable: NPCSchema

> `const` **NPCSchema**: `ZodObject`\<\{ `behaviorId`: `ZodString`; `description`: `ZodString`; `enemies`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `equipment`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodString`\>\>; `flags`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `id`: `ZodString`; `inventory`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `level`: `ZodOptional`\<`ZodNumber`\>; `metadata`: `ZodOptional`\<`ZodRecord`\<`ZodString`, `ZodAny`\>\>; `name`: `ZodString`; `roomId`: `ZodString`; `stats`: `ZodObject`\<\{ `constitucion`: `ZodNumber`; `destreza`: `ZodNumber`; `fuerza`: `ZodNumber`; `ingenio`: `ZodNumber`; `percepcion`: `ZodNumber`; `sabiduria`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>

Defined in: packages/engine/src/data/schemas.ts:31
