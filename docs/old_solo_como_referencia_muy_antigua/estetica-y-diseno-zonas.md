# Master Plan: Diseño de Zonas Avanzado para InheronMUD

> [!NOTE]
> Este documento establece los estándares de oro para la creación de contenido. El objetivo es pasar de "habitaciones con texto" a "ecosistemas interactivos".

---

## 1. Arquitectura y Flujo de Navegación

El diseño de la planta es el esqueleto de la experiencia. Un mal flujo arruina la inmersión.

### El Modelo "Hub-and-Spoke" (Eje y Radios)
Evita los diseños lineales ("pasillos"). Las zonas deben tener un punto central de interés (Hub) desde donde ramifiquen los desafíos (Spokes).
*   **Beneficio:** Facilita la orientación y permite al jugador regresar a un punto seguro rápidamente.

### Bucles de Retorno (Looping)
Diseña caminos que eventualmente conecten de vuelta al inicio de la zona o a un atajo.
*   **Evita el "Backtracking":** Obligar al jugador a caminar 20 salas hacia atrás después de matar a un jefe es tedioso.
*   **Atajos Desbloqueables:** Una puerta que solo se abre desde el lado del jefe permite que, tras morir, el jugador regrese al combate rápidamente.

---

## 2. Escritura Sensorial y Atmosférica

En un MUD, el texto es tu motor gráfico. Debe ser vibrante pero eficiente.

### La Regla de los Tres Sentidos
Cada descripción de sala debe evocar al menos tres sentidos (Vista + otros dos).
*   **Ejemplo Pobre:** "Estás en una cueva oscura. Hay rocas y humedad."
*   **Ejemplo Premium:** "El aire en la gruta es pesado y huele a salitre (Olfato). Tus pasos resuenan con un eco metálico contra las paredes de obsidiana (Oído), mientras runas azuladas bañan el suelo de una luz fría y eléctrica (Vista)."

### Micro-descripciones Dinámicas
No pongas todo el texto en la descripción de la sala. Usa la técnica de "Divulgación Progresiva":
1.  **Sala:** Menciona un "altar antiguo" brevemente.
2.  **Interactividad:** Si el jugador hace `look altar`, ofrece un párrafo detallado sobre las inscripciones. 
3.  **Resultado:** Esto mantiene la descripción de la sala limpia para el combate, pero premia al **Explorador**.

---

## 3. Psicología del Jugador (Taxonomía de Bartle)

Una zona perfecta tiene algo para cada tipo de jugador:

| Tipo | Motivación | Qué incluir en la Zona |
| :--- | :--- | :--- |
| **Achiever** (Triunfador) | Poder y Loot | Mobs con drops raros, misiones de "mata X". |
| **Explorer** (Explorador) | Descubrimiento | Atajos ocultos, lore en objetos, salas secretas. |
| **Socializer** (Social) | Comunidad | Bancos, fogatas, zonas de "safe" donde charlar. |
| **Killer** (Competitivo) | Dominio | Zonas de riesgo (Aggro), mecánicas de emboscada. |

---

## 4. Diseño de Combate y Loot (Mecánicas)

### El "Punto de Control" (Choke Point)
Las zonas peligrosas deben tener una **Puerta Principal** controlada.
*   Esto permite al equipo de diseño colocar guardias (Aggro) que funcionen como un "filtro de nivel" antes de que el jugador se meta en problemas mayores.

### Progresión de Botín Significativa
Evita el loot "basura" genérico. Cada objeto debería contar una historia o tener una utilidad.
*   **Flavor Text:** En lugar de "Daga", usa "Daga de Ritual de Grik".
*   **Consumibles Tácticos:** Si el jefe de la zona hace daño de fuego, asegúrate de que los mobs previos suelten "Pociones de Resistencia al Fuego". Esto crea un ecosistema de autosuficiencia en la zona.

---

## 5. Lista de Verificación para Nuevas Zonas (Checklist)

Antes de dar una zona por terminada, debe cumplir esto:
- [ ] **Coordenadas**: Todas las salas tienen `[x, y, z]` para el minimapa.
- [ ] **Enlaces**: No hay edificios que funcionen como pasillos obligatorios.
- [ ] **Armamento**: Todos los mobs humanoides tienen `equipment: wield`.
- [ ] **Escalado**: Las armas tienen `minDamage` y `maxDamage`.
- [ ] **Atmosfera**: Al menos 3 sentidos en las descripciones principales.
- [ ] **Secretos**: Al menos una interacción oculta (`usable: true` o `look` especial).
