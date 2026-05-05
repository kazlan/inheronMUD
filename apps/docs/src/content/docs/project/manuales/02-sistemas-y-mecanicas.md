---
title: "Sistemas y Mecánicas Core - InheronMUD"
---

# Sistemas y Mecánicas Core - InheronMUD

El motor TypeScript de InheronMUD procesa sus eventos a través de gestores independientes acoplados al `GameEngine`. Este documento detalla cómo funciona internamente la reactividad del mundo.

---

## 1. EffectsManager (El Corazón de los Estados)

El `EffectsManager` se ejecuta en cada "tick" general del bucle del juego (aproximadamente cada 2 segundos). Su función es evaluar si los efectos temporales (`activeEffects`) en cualquier entidad han caducado o necesitan ejecutar una acción (como curar o dañar).

### Ciclo de Procesamiento:
1. **Recolección de Entidades:** Carga todos los Jugadores, NPCs y Salas activas.
2. **Evaluación de Equipo:** Por cada Jugador y NPC, escanea sus objetos en los slots de `equipment`. Si el arma/armadura/reliquia tiene modificadores en su array `activeEffects`, los agrega *virtualmente* al personaje.
    *   *Nota Arquitectónica:* Un objeto de regeneración tirado en el suelo no procesa curación. Al equiparlo, es el `EffectsManager` del portador el que recibe y aplica la curación en su tick.
3. **Manejo de Tiempos (`duration`):** Si un efecto tiene duración, expira al superar su límite. Si cuenta con `expireMessage`, se emite en el `spatial_message` para que la sala vea, por ejemplo: *"El aura mágica alrededor de Grom se desvanece."*
4. **Procesado (`tickInterval`):** Si un efecto tiene `tickInterval` (ej. 5000 ms), al transcurrir el tiempo disparará `applyTickEffect` (ej. daño por veneno, o curación).

---

## 2. CommandManager y Enrutamiento Contextual

El núcleo de interacciones es gestionado por `session.ts` interceptando los WebSockets, y desviando las peticiones al `CommandManager.ts`.

### Alias Globales vs Alias Contextuales
*   **Globales:** Comandos como `look`, `usar`, `norte`, `atacar` están harcodeados en el enrutador. 
*   **Contextuales (Scenery Verbs):** Cuando un usuario ingresa un comando no global (por ejemplo: `empujar roca`), el router delega la evaluación al comando `interact`. 
    *   `interact` evalúa la sala y verifica si existe un objeto "roca" en el `scenery`.
    *   Revisa el array `verbs` de dicho objeto. Si contiene "empujar", lo autoriza, devuelve un flag especial `isContextualMatch: true`, y ejecuta el efecto (ej. abrir puerta, mensaje, etc).
    *   Si el objeto no está, o el verbo no encaja, el fallback rechaza el comando.
    *   Esto permite verbos altamente inmersivos (`tocar orbe`, `tirar antorcha`, `jugar columpio`) sin requerir ensuciar el código global.

---

## 3. Combate e IA Pasiva

El sistema de combate está regido por `CombatManager` y el `AIManager`.

*   **Agro:** Un NPC con el flag `agresivo` evaluará la sala periódicamente y agregará a su lista de odio a cualquier jugador presente.
*   **Social:** Un NPC con flag `social` se unirá al combate automáticamente si otro NPC de la misma sala es atacado.
*   **Curación Pasiva (Healer):** Un NPC con flag `healer` iterará a todos los jugadores heridos en la misma sala. Si él mismo no está en combate activo, emitirá hechizos de sanación a sus aliados de manera incondicional, actuando como zona de respiro en puntos neurálgicos (ej. un clérigo en la iglesia).
*   **Confinamiento de Área (Wandering):** Los NPCs en modo deambular (wandering) están limitados por su `areaId`. Esta propiedad la heredan de la sala donde aparecen o *spawnean*. El `AIManager` comprueba el `areaId` de la sala destino antes de moverse; si no coinciden, el movimiento se bloquea. Esto crea "ecosistemas" herméticos sin necesidad de reglas condicionales pesadas.

---

## 4. Consumibles, Cargas y Desintegración

El sistema de inventario soporta el consumo directo de ítems en las bolsas de los jugadores:
1.  Si el objeto es tipo `CONSUMABLE` genérico y tiene `value` (ej. Pan, 50), al usarlo se curará al jugador ese valor y el `splice` lo borrará de su bolsa.
2.  Si el objeto posee `metadata.charges` (ej. una Varita de Cura con 3 cargas), en cada uso restará una carga aplicando los correspondientes `effects` del metadata.
3.  Al alcanzar 0 cargas, el objeto desaparece de la matriz.

---

## 5. El Bucle Táctico y Estadísticas (Derived Stats)

El archivo `StatCalculator.ts` genera al vuelo las estadísticas secundarias (`hpMax`, `energyMax`, daño, evasión) fusionando:
*   Las `stats` base del personaje (Fuerza, Destreza...).
*   Los modificadores fijos (bonos) del equipo o reliquias que lleve encima el personaje.
*   El nivel del personaje.
El motor no guarda permanentemente la "Fuerza total" en DB, siempre la recalcula mediante el patrón Facade cuando la necesita un evento (ej. el sistema de combate para ver cuánto pegas).
