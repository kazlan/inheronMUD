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

## skill: generar_mapa_textual
Entrada: lista de salas o concepto.
Salida: diagrama ASCII o lista de conexiones.