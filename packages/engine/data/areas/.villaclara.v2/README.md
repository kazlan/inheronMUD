# Paquete Villaclara MVP canónico — 2026-05-07

Estado: VALIDADO y ESTANDARIZADO
Tipo: Paquete canónico de producción

## Archivos
- `rooms.yml`: 10 salas completadas (Plaza, Pozo, Archivo, Tablón, Puerta Norte, Iglesia, Panadería, Gremio, Forja, Campo Norte).
- `npcs.yml`: 6 NPCs principales configurados con diálogos de Crónica Viva e inventarios fijos.
- `items.yml`: 9 ítems canónicos (incluyendo Pan de Alba Serena y Lanza del Alba).
- `rumors-cronica.yml`: Rumores y ganchos narrativos integrados.

## Advertencias
- BRECHA ENGINE: confirmar formato real de `interactions`.
- BRECHA ENGINE: confirmar si el loader acepta entidades de rumor/Crónica o si deben vivir bajo `metadata` de salas/NPCs.
- No sustituir destructivamente la maqueta: integrar por capas y validar IDs.

## Siguiente acción
Validar esquema del motor Custom TypeScript y convertir a parche final por archivos de contenido.
