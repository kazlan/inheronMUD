# Changelog: 06 de Mayo de 2026 - Bardo, Persistencia y UI

## 🌟 Novedades Principales

### 1. Sistema de "Bardo de Crónica Viva"
Se ha completado la implementación base de la clase Bardo y sus mecánicas asociadas:
- **Recursos Nativos:** Transición de Energía genérica al uso de **Voz** (calculada con `100 + presencia * 5`).
- **Sistema de Trama y Estrofa:** Las habilidades del bardo ahora detectan cambios en la "familia" de la canción (Danza, Copla, Épica, etc.) y otorgan *Estrofas* progresivas.
- **Sistema de Armonías:** Implementado el evaluador en tiempo real dentro del motor de combate.
  - **Armonía de Vanguardia:** Combinación de *Himno de la Primera Chapa* + *Paso de Liria*. Otorga al grupo un bono automático del +10% en evasión.
  - **Armonía de Ridículo:** Combinación de *Copla Pegadiza* + *Síncopa Burlona*. Genera *Estrofa* para el Bardo cuando el enemigo esquivado falla, y otorga *Aplausos* en fallos críticos (evasión del 20%).

### 2. Persistencia y Supervivencia
- **Respawn en Combate:** Los jugadores derrotados en combate ahora ven restaurada su salud al máximo (o a un umbral seguro) y son transportados automáticamente a la *Plaza del Alba Chica* (`villaclara_plaza`).
- **Integridad de Datos Asegurada:** Tras morir en combate, el motor fuerza un `Database.savePlayer(player)` garantizando que no se pierdan objetos recogidos del suelo (`get`) momentos antes de la muerte debido al debounce del guardado.

### 3. Mejoras de Interfaz (UI) e Interacción
- **Prompt Configurable (`prompt`):** Los jugadores pueden ahora encender o apagar indicadores de su barra de estado (hp, voz, trama, aplauso, emoji) escribiendo `prompt <opcion> [on/off]`. Estas opciones se guardan en el perfil persistente del jugador.
- **Auto-Documentación en el Juego (`help` / `ayuda`):** 
  - `help`: Muestra la lista de todos los comandos y su descripción.
  - `help <comando>`: Detalla el uso, sinónimos y descripción extendida de un comando.
  - `help <skill>`: Extrae del sistema la familia, coste, descripción y tipo de la habilidad indicada.
  - `help <item>`: Permite inspeccionar objetos del inventario o sala para revisar estadísticas (daño, ranura, usos).
- **Inspección de Equipo (`equip`):** Ejecutar `equip` o `equipo` sin parámetros ahora imprime por pantalla un listado tabulado de los objetos actualmente equipados en el personaje.

## 🛠️ Modificaciones Técnicas (Bajo el capó)
- `SkillManager`: Añadido soporte real para inyectar objetos de tipo `buff` y `debuff` en la matriz `activeEffects` de las entidades, posibilitando efectos continuados por ronda.
- `GameEngine`: Interceptación asíncrona del evento de combate (`armonia_ridiculo_evade`) en el callback onAction del `CombatManager` para trenzar la narrativa con mecánicas numéricas.
- `CharacterSheet` / `CommandLine`: La UI web ahora interpreta inteligentemente si el jugador es un Bardo, cambiando las etiquetas visuales (Energía -> Voz) y ocultando elementos de interfaz no relevantes al usuario gracias a `promptSettings`.
