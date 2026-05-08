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
- Posada, jardines y camposanto en capa urbana ampliada.
- NPCs memorables con comercio, voz local y pistas redundantes.
- Hostiles de prueba para combate inicial: lobo flaco, conejo acorazado y General Pelusa.
- Rumores y entradas de Crónica Viva preparados para integración.

## Qué testear al subir
1. `admin refresh area villaclara`
2. `admin goto villaclara_plaza`
3. `inspect-room`
4. Navegación básica:
   - plaza -> pozo
   - plaza -> gremio -> tablón
   - plaza -> panadería -> forja
   - plaza -> iglesia/capilla
   - puerta norte -> campo norte -> lindero
5. Interacciones de scenery:
   - `look pozo`
   - `look agua`
   - `leer tablon`
   - `leer contrato_sospechoso`
   - `leer libro_mayor`
   - `escuchar campanario`
6. NPCs:
   - hablar con Doña Marga
   - hablar con Otilia
   - hablar con Bimba
   - hablar con Pex
   - hablar con Silo
   - probar comercio con Doña Marga y Tarin
7. Combate:
   - `admin spawn mob_conejo_acorazado`
   - `admin spawn mob_lobo_flaco`
   - validar respawn automático en Campo Norte/Lindero
8. Validar que `rumors-cronica.yml`:
   - cargue correctamente, o
   - sea ignorado sin romper el área

## Qué implementar o confirmar después
- Confirmar contrato real del loader para `rumors-cronica.yml`.
- Confirmar si `metadata.unique` en spawners debe subir a raíz como `unique: true`.
- Confirmar si `ambientMessages`, `greetings` y `dialogues` están soportados tal cual en runtime.
- Confirmar si `flags: [patrol]`, `flags: [healer]` o `flags: [weird]` tienen efecto real o son solo semántica por ahora.
- Integrar contratos jugables reales del tablón si ya existe sistema de quest/board activo.
- Revisar si alguna room ampliada debe entrar en `rooms.yml` final o dejarse para fase 2 según tamaño deseado del pueblo.

## Riesgos / brechas engine
- BRECHA ENGINE POSIBLE: `rumors-cronica.yml` puede estar documentado pero no cargado todavía.
- BRECHA ENGINE POSIBLE: algunas metadata narrativas pueden ser inocuas si el motor aún no las consume.
- BRECHA ENGINE POSIBLE: `interactions` se usa con forma conservadora, pero conviene validar contra el parser real.

## Sugerencia de prueba rápida mínima
- Refrescar área.
- Entrar en plaza.
- Leer tablón.
- Mirar pozo.
- Hablar con Bimba y Otilia.
- Spawnear conejo acorazado.
- Verificar comercio de panadería.

## Nota de continuidad
No hay referencias de Ranvier en este paquete. Está pensado para motor propio Custom TypeScript con contenido YAML y metadata extendida.
