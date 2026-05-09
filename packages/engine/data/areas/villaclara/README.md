# Villaclara — paquete de parche para subida y prueba

Fecha: 2026-05-08
Área: Villaclara
Tipo: parche_yaml
Estado: listo_para_revisión

## Contenido del paquete
- `rooms.yml`
- `npcs.yml`
- `items.yml`
- `spawners.yml`
- `rumors-cronica.yml`

## Resumen del parche
Este paquete amplía Villaclara como zona inicial jugable con identidad propia:
- Plaza con Pozo Cantante y registro público.
- Archivo de cuerdas y nombres.
- Gremio + tablón de Rango Cobre.
- Panadería, forja, atrio/capilla y acceso al Campo Norte.
- Capa urbana ampliada: Calle del Norte, calles mayores, calleja del horno, traspatio del gremio, posada, comedor, segundo piso, pasillo de huéspedes, jardines, camposanto, callejón y jardincillo.
- NPCs memorables con comercio, voz local y pistas redundantes.
- Contratos de Rango Cobre preparados en metadata de tablón e ítems de quest: conejos, campana y Otilia.
- Hostiles de prueba para combate inicial: lobo flaco, conejo acorazado y General Pelusa.
- Loot de prueba para sistemas: arma (`item_cuchilla_mellada`) y armadura (`item_peto_placas_remendado`) en mobs hostiles.
- Rumores y entradas de Crónica Viva preparados para integración.

## Qué testear al subir
1. `admin refresh area villaclara`
2. `admin goto villaclara_plaza`
3. `inspect-room`
4. Navegación básica:
   - puerta norte -> calle del norte -> plaza
   - plaza -> calles este/oeste
   - calle del sol naciente -> calleja del horno -> panadería -> forja
   - calle del sol poniente -> posada -> comedor -> segundo piso
   - plaza -> cuesta -> atrio -> capilla -> jardines -> camposanto
   - puerta norte -> campo norte -> lindero
5. Interacciones de scenery:
   - `look pozo`
   - `look agua`
   - `leer tablon`
   - `leer contrato_sospechoso`
   - `leer libro_mayor`
   - `escuchar campanario`
   - comprobar metadata de `board.contracts` en tablón
6. NPCs:
   - hablar con Doña Marga, Otilia, Bimba, Pex, Silo
   - hablar con Arnel, Lina, Greta, Hermana Lúa, Mirta, Brin
   - probar comercio con Doña Marga, Tarin, Arnel y Mirta
7. Combate:
   - `admin spawn mob_conejo_acorazado`
   - `admin spawn mob_lobo_flaco`
   - `admin spawn mob_general_pelusa`
   - validar caída/loot de `item_cuchilla_mellada` y `item_peto_placas_remendado`
   - validar respawn automático en Campo Norte/Lindero
8. Validar que `rumors-cronica.yml`:
   - cargue correctamente, o
   - sea ignorado sin romper el área

## Riesgos / brechas engine
- BRECHA ENGINE POSIBLE: `metadata.patrolPath`, `flags: [patrol|wandering|healer]` e `innkeeper: true` pueden ser solo semánticos si el runtime aún no los consume.
- BRECHA ENGINE VIGILADA: `spawners.yml` queda en contrato actualizado (`maxActive`, `intervalMs`, `variants`, `unique` raíz) y conserva valores legacy dentro de `metadata.legacy` solo como referencia.
- BRECHA ENGINE POSIBLE: la nueva malla de exits toca rutas existentes; conviene verificar colisiones tras el refresh.

## Nota de continuidad
No hay referencias operativas a Ranvier. Este paquete está orientado al motor propio Custom TypeScript con contenido YAML y metadata extendida.
