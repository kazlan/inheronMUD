# Changelog: Implementación de Loot y Recompensas (2026-05-04)

## Resumen
Se ha completado la integración del sistema de recompensas tras el combate, solucionando la ausencia de loot y monedas. Además, se ha optimizado la IA de los testers para una exploración más agresiva y una mejor detección de eventos cualitativos.

## Cambios Técnicos

### 1. Sistema de Loot y Economía
- **`GameEngine`**: Implementada lógica de limpieza post-combate.
    - Los NPCs ahora sueltan su `inventory` en la habitación al morir.
    - Cálculo de monedas dinámico basado en el nivel del NPC (`Nivel * 2-5` aprox).
    - Reparto equitativo de monedas entre jugadores supervivientes.
- **`RespawnManager` & `WorldFactory`**: Corregida la carga de inventario. Ahora los NPCs clonados desde plantillas YAML heredan correctamente sus objetos.
- **`Item Model`**: Añadida propiedad `roomId` para soportar items persistentes en el suelo de las salas.

### 2. IA de Testers Autónomos
- **Detección de Combate**: Se ha corregido la lógica de detección de mobs. Los testers ahora identifican correctamente a los enemigos mediante el flag `isMob` procesado en el comando `look`.
- **Exploración Optimizada**: Se ha incrementado la probabilidad de movimiento. Los testers ya no se quedan "atrapados" en salas sociales una vez han interactuado con los NPCs, priorizando la búsqueda de zonas de caza.
- **Análisis de Loot**: El script `tester-client.ts` ahora detecta y reporta mensajes de obtención de monedas y items, permitiendo evaluar la economía del juego.

### 3. World Building (Villaclara)
- **Ajustes de Flags**: Se ha eliminado el flag `social` de mobs hostiles (Conejos Acorazados) para evitar comportamientos contradictorios (saludar antes de atacar).
- **Boss Correction**: Restaurado el flag `agresivo` al General Pelusa.

## Próximos Pasos
- [ ] Implementar el comando `get` / `tomar` para que los testers recojan el loot del suelo.
- [ ] Evaluar el ritmo de ganancia de monedas para ajustar precios en la forja y panadería.
- [ ] Corregir las descripciones de las salas de Villaclara que no mencionan sus salidas (Iglesia, Forja).
