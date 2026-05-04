# Skills — ZoneMaster

## skill: diseñar_hub
Entrada: región, tamaño, servicios requeridos.
Salida: barrios, salas, tiendas, NPCs, rutas, eventos, secretos.

## skill: diseñar_dungeon
Entrada: tema, nivel, boss, mecánica central.
Salida: estructura, salas, reloj de dungeon, enemigos, puzzles, loot, estados de sala.

## skill: crear_sala_ranvier
Entrada: nombre, función, conexiones.
Salida:
- id
- nombre
- descripción base
- salidas
- objetos visibles
- NPCs
- interacciones
- variantes condicionales
- rasgos de entorno

## skill: validar_zona
Entrada: lista de salas.
Salida: errores de navegación, salas vacías, salidas rotas, oportunidades de mejora.
Checklist obligatorio:
- ¿Todas las salas tienen coordenadas `[x, y, z]`?
- ¿La prosa está en voz activa?
- ¿Se evitó la palabra "tú" o "sientes"?
- ¿Se involucraron al menos dos/tres sentidos?
- ¿Es concisa (máx. 5 frases)?
- ¿Hay cero NPCs/Mobs descritos en texto fijo?
- ¿Hay al menos una interacción oculta/secreto?

## skill: generar_mapa_textual
Entrada: lista de salas o concepto.
Salida: diagrama ASCII o lista de conexiones.