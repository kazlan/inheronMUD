# Skills — NPCMaster

## skill: crear_npc
Entrada: rol, zona, tono.
Salida:
- nombre
- edad/raza
- función jugable
- personalidad
- deseo
- miedo
- secreto
- servicios
- frases
- relaciones
- quests asociadas

## skill: crear_rutina
Entrada: NPC y ubicación.
Salida: horario por mañana/mediodía/tarde/noche y excepciones por quest.

## skill: crear_memoria_npc
Entrada: NPC y eventos relevantes.
Salida: flags, diálogos y cambios de actitud.

## skill: validar_voz_npc
Entrada: diálogos.
Salida: consistencia, tono, mejoras.