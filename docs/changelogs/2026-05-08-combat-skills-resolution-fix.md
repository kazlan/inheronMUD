# 2026-05-08: Fixes en Resolución de Habilidades y Combat Log

## Problema Detectado (Reporte de Testers)
Se detectaron tres incidencias severas relativas al sistema de combate y habilidades (especialmente notorias al jugar con el Bardo):
1. **Fuego Amigo Involuntario:** Habilidades beneficiosas como `bardo_paso_liria` (`type: buff`) se estaban auto-apuntando por defecto a los enemigos en combate si el jugador no especificaba un objetivo (ej. usando el pulso automático o escribiendo `cast paso`).
2. **Daño Nulo en Habilidades de Daño sin Objetivo (Fuera de Combate):** Habilidades como `bardo_nota_cortante` fallaban en resolver su objetivo si se casteaban sin argumento fuera de combate, resultando en `targetEntityId` igual a `undefined`, lo que provocaba que se saltase el cálculo de daño por completo.
3. **Spam de Mensajes de Combate:** Al lanzar una habilidad, el cliente de juego imprimía el log de la habilidad hasta tres veces simultáneas en el chat del jugador.

## Soluciones Implementadas (`SkillManager.ts` y `Session.ts`)

### 1. Refactor de Resolución de Objetivos Automática
- Se ha actualizado la lógica interna en `SkillManager.executeSkill` para diferenciar correctamente el alineamiento de una habilidad basándose en su `type`.
- Ahora, si una habilidad es de tipo `heal`, `buff` o `utility`, el valor de `isBeneficial` es `true`.
- Si `isBeneficial` es `true` y el jugador no define un objetivo, el motor **se auto-asignará (`casterId`)** como objetivo por defecto, tanto dentro como fuera de combate.
- Para evitar que los jugadores "fallen" sus propios buffs, se ha implementado un salto (bypass) a la tirada de precisión (1d20 + precisión vs evasión) si la habilidad es `isBeneficial`.

### 2. Eliminación de Mensajes Duplicados/Triplicados
- **Orígen del Problema:** Al invocar el comando `cast`, `CommandManager` devolvía un objeto `RESPONSE` que contenía `message` (el texto renderizado) y `combatLog` (el array puro). El cliente React `useMUD.ts` imprimía ambos. Simultáneamente, `SkillManager` emitía un evento global `combat_message` dirigido al propio jugador, disparando un `COMBAT_UPDATE` por websockets que el cliente volvía a imprimir.
- **Solución:**
  - `SkillManager.executeSkill` ahora **solo** emite el evento `combat_message` a los **otros** participantes de la refriega (para que el resto del grupo pueda leer la acción). 
  - Al propio jugador que lanza la habilidad (`casterId`) se le emite un log vacío (`[]`) a través de `combat_message`, lo cual sirve para forzar una actualización silenciosa de UI (barras de vida, buffs, recomendación de pulso) a través del `COMBAT_UPDATE` sin duplicar el texto en el chat.
  - El array `combatLog` se ha purgado del objeto de retorno explícito de la función `executeSkill`, dejando unívocamente el string en `message` para ser impreso una sola vez en el cliente web.

### 3. Registro de Fallos en Combate
- Se ha corregido una rama de ejecución dentro de `executeSkill` donde, si el jugador fallaba la tirada de precisión contra el enemigo, la función abortaba retornando `{ success: true }` pero sin haber emitido nunca el evento `combat_message` al resto de combatientes, causando "turnos vacíos" donde nadie sabía qué había ocurrido.

## Estado Final
- El comando `pulso` y el atajo de habilidades rápidas pueden volver a utilizarse sin temor a curar o bufear enemigos por accidente.
- El chat se mantiene limpio y sin ruido visual duplicado.
