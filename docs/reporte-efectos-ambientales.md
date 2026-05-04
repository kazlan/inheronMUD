# Reporte de Implementación: Efectos Ambientales (AoE)

**Fecha**: 4 de Mayo de 2026
**Sistema**: Motor (Engine) - `EffectsManager`

## Descripción del Cambio
Se ha ampliado el sistema de efectos del motor para soportar efectos de área (AoE). Ahora, tanto las habitaciones como ciertos PNJs (marcados con la etiqueta `aoe: true` en su efecto) pueden transmitir efectos a **todos los jugadores presentes en la misma sala**.

### Modificaciones Clave
1. **`EffectsManager.ts`**:
   - Se ha añadido la lógica condicional en la función `tick` para discriminar entre efectos individuales y efectos de área (`effect.aoe || entity.exits !== undefined`).
   - Se ha creado el nuevo método `applyAoEEffect(entity, effect)` que procesa la curación (y el daño) aplicándolo a cada jugador presente en la habitación, además de emitir mensajes ambientales (`spatial_message`) personalizados o genéricos.

2. **Habitaciones (`villaclara/rooms.yml`)**:
   - Se ha modificado el efecto `Aura Sagrada` en `villaclara_iglesia` (Capilla de la Luz Eterna).
   - Ahora incluye `aoe: true` y el mensaje personalizado: `"<cyan>Un aura de devoción reconforta a los presentes.</cyan>"`. Todos los jugadores que estén en la iglesia recibirán este mensaje y se curarán 2 PV cada 10 segundos.

3. **PNJs (`llanuras_ambar/npcs.yml`)**:
   - Se ha modificado el efecto `Brillo Consolador` del PNJ `npc_ciervo_dorado`.
   - Se ha añadido `aoe: true` y el mensaje: `"<cyan>Una fresca brisa te hace sentir mejor gracias a la presencia del Ciervo Dorado.</cyan>"`. Todos los jugadores en la misma sala que el ciervo recibirán los beneficios curativos.

## Recomendaciones para los Diseñadores
Al diseñar nuevas zonas y PNJs:
- Para que un PNJ transmita un efecto a la sala, asegúrate de añadir la propiedad `aoe: true` en el bloque de su efecto.
- Para personalizar el mensaje ambiental, utiliza la propiedad `message: "<color>Tu mensaje aquí</color>"`. Si se omite, el motor generará un mensaje automático indicando que "sientes los efectos de [Nombre del Efecto]".
- Los efectos en habitaciones **siempre** se consideran AoE de forma predeterminada, pero añadir la etiqueta `aoe: true` es una buena práctica semántica.
