# Guía de Comandos de InheronMUD

Los comandos en InheronMUD se procesan en dos etapas: el enrutamiento en la sesión y la ejecución en el motor.

## 1. Flujo de un Comando
1.  **Entrada**: El cliente envía un JSON via WebSocket: `{ command: 'mirar', args: ['norte'] }`.
2.  **Enrutamiento (`Session.handleGameCommand`)**: 
    - Se normaliza el alias (ej: `l` -> `look`).
    - Se comprueba si es una dirección directa (ej: `n`, `s`).
    - Se busca la mejor coincidencia por prefijo (ej: `invent` -> `inventory`).
3.  **Ejecución (`CommandManager`)**: Se llama al método correspondiente con el `playerId` y argumentos.
4.  **Respuesta**: Se devuelve un objeto con `success`, `message` y opcionalmente `data` para actualizar la UI del cliente.

## 2. Lista de Comandos Disponibles

### Navegación y Entorno
| Comando | Aliases | Descripción |
| :--- | :--- | :--- |
| `look` | `mirar`, `l` | Describe la sala actual o un objeto/NPC específico. |
| `move` | `n`, `s`, `e`, `o`, `w`, `u`, `d`, etc. | Desplaza al jugador a una sala adyacente. |
| `open` | `abrir` | Abre una puerta bloqueada (puede requerir llave). |
| `interact`| `interactuar`, `usar` | Interactúa con objetos de la escenografía o ítems. |

### Inventario y Equipo
| Comando | Aliases | Descripción |
| :--- | :--- | :--- |
| `inventory`| `inventario`, `i` | Muestra los objetos que llevas. |
| `get` | `coger`, `tomar` | Recoge un objeto del suelo. |
| `drop` | `soltar`, `tirar` | Deja un objeto en la sala. |
| `equip` | `equipar` | Se pone una pieza de equipo en su slot correspondiente. |
| `unequip` | `desequipar` | Se quita una pieza de equipo. |

### Combate y Salud
| Comando | Aliases | Descripción |
| :--- | :--- | :--- |
| `kill` | `matar`, `k` | Inicia el combate contra un NPC hostil. |
| `flee` | `huir` | Intenta escapar del combate (75% éxito). |
| `heal` | `curar` | Usa energía vital para restaurar 20 PV (Demo). |
| `cast` | `lanzar` | Ejecuta una habilidad/hechizo aprendido. |

### Social y RPG
| Comando | Aliases | Descripción |
| :--- | :--- | :--- |
| `score` | `puntuacion` | Muestra la ficha detallada del personaje. |
| `cronica` | - | Muestra el progreso de misiones y hitos. |
| `talk` | `hablar` | Inicia un diálogo con un NPC. |
| `say` | `decir` | Habla con todos los presentes en la sala. |
| `tell` | `susurrar` | Envía un mensaje privado a otro jugador. |
| `yell` | `gritar` | Mensaje audible en toda el área. |
| `chat` | `c` | Canal global de comunicación. |

### Economía
| Comando | Aliases | Descripción |
| :--- | :--- | :--- |
| `list` | `listar`, `tienda`| Muestra el inventario de un mercader. |
| `buy` | `comprar` | Adquiere un objeto de un mercader. |
| `sell` | `vender` | Vende un objeto de tu inventario al mercader. |

## 3. Creación de Nuevos Comandos
Para añadir un comando nuevo:
1.  Añadir el método en `packages/engine/src/core/command-manager.ts`.
2.  Registrar el comando en la lista `VALID_COMMANDS` dentro de `apps/api/src/session.ts`.
3.  Añadir el bloque `else if` correspondiente en `handleGameCommand` para conectar el alias con el método del motor.
