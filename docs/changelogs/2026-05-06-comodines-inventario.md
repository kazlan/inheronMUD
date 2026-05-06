# Changelog - 2026-05-06: Comodines para gestión de inventario

## Nuevas Funcionalidades
*   **Comandos de Gestión Masiva (`get` y `drop`)**:
    *   Se ha implementado el uso de comodines (`todo`, `all`, o `.`) para los comandos de recogida y descarte de objetos.
    *   **Uso sin sufijo**: Permite ejecutar una acción sobre la totalidad del inventario o de la sala. Ejemplos:
        *   `get all` / `get todo`: Recoge absolutamente todos los objetos de la sala actual y los guarda en el inventario del jugador.
        *   `drop todo` / `drop .`: Tira al suelo todo tu inventario en un solo movimiento.
    *   **Uso con sufijos (filtros)**: Permite ejecutar acciones en lote solo sobre objetos cuyos nombres o alias empiecen por la palabra especificada. Ejemplos:
        *   `drop todo poci`: Suelta en la sala todos los objetos de tu inventario que empiecen por "poci" (como Poción de Vida, Poción de Maná, etc.).
        *   `get . espada`: Recoge del suelo todas las espadas presentes.
    *   **Soporte anticipado para contenedores simulados**: Si utilizas `get todo cofre` o `get . barril`, y existe un objeto en la sala (con la propiedad `metadata.inventory` activa), el sistema intentará extraer recursivamente su contenido e insertarlo en tu inventario sin llevarse el contenedor en sí.

## Refactorización Técnica
*   Actualizada la función `get()` y `drop()` en `packages/engine/src/core/command-manager.ts`.
*   Añadido sistema de parsing de strings para aislar los tokens de wildcards (`all`, `todo`, `.`) del texto de filtrado para los bucles de interacción en masa.
