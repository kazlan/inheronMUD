# Manual de Comandos de Jugador - InheronMUD

Esta es la guía de referencia sobre los comandos que los jugadores pueden utilizar en el mundo y cómo interactúan con los sistemas.

---

## Uso de Prefijos y Alias
El motor de juego soporta resolución inteligente de prefijos tanto para los comandos como para los parámetros:
*   **Prefijos de Comando:** No es necesario escribir la palabra entera. Por ejemplo, `k`, `ki`, o `kil` son interpretados automáticamente como `kill` (siempre que no haya ambigüedad con otro comando que empiece igual).
*   **Prefijos de Objetivo:** El motor buscará entidades evaluando si el texto escrito coincide con el inicio de alguna de las palabras del nombre. Escribir `k c` coincidirá y atacará al "Conejo Acorazado" porque la "c" coincide con "Conejo".

---

## 1. Navegación y Observación

*   **`look`** (o `l`, `mirar`): Examina la sala actual. Devuelve su nombre, descripción, lista de salidas y enumera cualquier NPC u objeto tirado en el suelo.
    *   *Nota: Las palabras clave del Escenario Interactivo se resaltarán en la interfaz del usuario.*
    *   **`look <objetivo>`**: Permite mirar en detalle un objeto del inventario, un equipo, un mob o un trozo de escenario específico. (Ej: `look estatua`).
*   **Movimiento:** Puedes moverte tecleando la dirección en inglés o español. Las abreviaturas son aceptadas.
    *   Norte (`north`, `n`, `norte`)
    *   Sur (`south`, `s`, `sur`)
    *   Este (`east`, `e`, `este`)
    *   Oeste (`west`, `w`, `oeste`, `o`)
    *   Arriba/Abajo (`up`, `u`, `arriba` / `down`, `d`, `abajo`)
    *   Diagonales (`ne`, `nw`, `se`, `sw`)
*   **`open <dirección>` / `abrir <dirección>`**: Intenta abrir una puerta en una dirección si está cerrada. Requiere llevar en el inventario la llave específica de esa puerta si ésta la tiene configurada.

---

## 2. Inventario y Equipo

*   **`i`** / **`inv`** / **`inventario`**: Muestra el contenido completo de tus bolsas y la cantidad de oro que posees.
*   **`eq`** / **`equipo`**: Despliega una vista de lo que tu personaje lleva equipado en este momento (Cabeza, Torso, Manos, etc).
*   **`get <objeto>`** / **`coger <objeto>`**: Recoge un objeto que esté tirado en el suelo de la sala. Si matas a un monstruo, el loot caerá al suelo y usarás este comando para tomarlo.
*   **`drop <objeto>`** / **`tirar <objeto>`**: Arroja un objeto de tu inventario al suelo de la sala.
*   **`equip <objeto>`** / **`equipar <objeto>`**: Si el objeto es un arma, armadura o accesorio y tienes el hueco de su `equipSlot` disponible, te lo equiparás.
*   **`unequip <slot>`** / **`desequipar <slot>`**: Te quita el objeto asociado a esa ranura de equipo y lo devuelve a la bolsa.
*   **`use <objeto>` / `usar <objeto>`**: Comando vital. Consume una poción, o activa una reliquia mágica desde el inventario aplicando sus efectos (gastando cargas si las tuviera).

---

## 3. Combate y Habilidades

*   **`kill <objetivo>`** / **`atacar <objetivo>`**: Inicia combate cuerpo a cuerpo con un NPC en la sala. Desde ese momento, el motor dictará turnos de autoataques cada par de segundos.
*   **`flee`** / **`huir`**: Intenta escapar del combate. Si tienes éxito, el sistema te forzará a moverte aleatoriamente a una de las salidas adyacentes y detendrá los ataques.
*   **`skills`** / **`habilidades`**: Muestra una lista de todas las magias y habilidades técnicas aprendidas por tu clase y nivel.
*   **`cast <habilidad> <objetivo>`** / **`lanzar <habilidad> <objetivo>`**: Ejecuta una habilidad gastando Energía o Maná.

---

## 4. Comercio

Estos comandos requieren la presencia de un NPC comerciante (`metadata.merchant: true`) en la misma sala que el jugador.
*   **`list`** / **`tienda`** / **`comprar`** (sin argumentos): El mercader listará todos los objetos que tiene en venta y sus precios en oro.
*   **`buy <objeto>`** / **`comprar <objeto>`**: Dedice tu oro y transfiere el ítem de la tienda a tu inventario.
*   **`sell <objeto>`** / **`vender <objeto>`**: Vende un objeto de tu inventario al mercader a cambio de una pequeña suma de monedas.

---

## 5. Comunicación y Social

*   **`say <mensaje>`** / **`decir <mensaje>`**: Mensaje que será escuchado únicamente por las entidades ubicadas en tu misma sala (rol cercano).
*   **`yell <mensaje>`** / **`gritar <mensaje>`**: Mensaje que se propaga y es escuchado en las salas adyacentes a donde te encuentres.
*   **`tell <personaje> <mensaje>`** / **`susurrar <personaje> <mensaje>`**: Mensaje privado directo a otro jugador, sin importar en qué parte del mundo se halle.
*   **`chat <mensaje>`** / **`c <mensaje>`**: Envía un mensaje por el canal global *OOC* (Out of Character) a todo el servidor.

---

## 6. Interacciones Contextuales de Entorno (Scenery)

Los mapas ahora pueden contener puzles lógicos y elementos inmersivos. Puedes escribir directamente ciertas acciones si crees que interactuar con el entorno lo amerita:

*   **`empujar <objeto>`**, **`tirar <objeto>`**, **`tocar <objeto>`**, **`subirse <objeto>`**, **`jugar <objeto>`**, etc.
    *   *Mecánica:* Si ingresas por ejemplo `empujar piedra`, el motor detectará que "empujar" no es un comando de combate estándar y lo derivará al escenario. Si hay una "piedra" que admita el verbo "empujar", desatará un evento (revelar un camino oculto, soltar loot, mostrar un texto, etc). Si no lo admite, dirá "No puedes empujar piedra."
