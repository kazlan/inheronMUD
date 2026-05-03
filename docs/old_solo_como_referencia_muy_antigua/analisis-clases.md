# Análisis de Clases: InheronMUD

Este documento detalla la implementación técnica, filosófica y mecánica de las 11 clases principales de InheronMUD. Diseñadas para ofrecer una progresión profunda desde el nivel 1 al 60, estas clases equilibran el combate solitario con la sinergia de grupo.

---

## 1. Sistemas de Recursos

Para diferenciar las clases, utilizamos cuatro sistemas de recursos principales:

| Recurso | Clase(s) Principal(es) | Mecánica de Generación |
| :--- | :--- | :--- |
| **Mana** | Mago, Bruja, Druida, Clérigo | Regeneración pasiva basada en Intelecto/Voluntad. |
| **Ira** | Guerrero | Se genera al recibir o infligir daño. Se pierde fuera de combate. |
| **Energía** | Ladrón, Asesino, Guardabosque, Bardo | Regeneración rápida constante. |
| **Favor/Fé** | Paladín, Clérigo | Se genera mediante oraciones, sacrificios o golpes sagrados. |
| **Enfoque** | Monje | Se genera mediante combos de ataques básicos. |

---

## 2. El Bardo: El Maestro de Todo (Spotlight)

El Bardo es la clase más versátil del juego. No destaca en daño puro ni en mitigación, pero es capaz de ocupar cualquier rol en una emergencia.

- **Atributos Clave:** Agilidad, Intelecto, Carisma (Cunning).
- **Mecánica Única: "Ecos de la Canción"**. El Bardo puede mantener un "Aire" activo que da un aura pasiva, mientras lanza "Notas" que consumen energía para efectos inmediatos.

### Tabla de Progresión: Bardo (1-60)

| Nivel | Habilidad / Hechizo | Tipo | Efecto |
| :--- | :--- | :--- | :--- |
| 1 | Balada del Novato | Aura | Regeneración leve de HP/Mana para el grupo. |
| 5 | Disonancia | Daño | Daño sónico instantáneo que puede interrumpir casting. |
| 12 | Marcha de Guerra | Aura | Aumenta el Daño Físico del grupo un 10%. |
| 20 | Sonata de Curación | Hechizo | Cura moderada basada en Intelecto. |
| 35 | Verso de la Parálisis | CC | Duerme a un enemigo con música (rompe al recibir daño). |
| 45 | Himno de los Héroes | Aura | Aumenta todos los atributos principales del grupo. |
| 55 | Rapsodia de Sangre | Daño/Buff | Gran daño de área que otorga robo de vida al grupo. |
| 60 | Maestro de Inheron | Pasiva | Permite equipar cualquier tipo de armadura ligera/media y armas de una mano. |

---

## 3. Análisis de Clases de Combate Físico

### Guerrero (El Muro de Acero)
Especialista en supervivencia y control de masas.
- **Stats:** Fuerza (10/10), Estamina (10/10), Agilidad (4/10).

| Niveles | Habilidades Clave | Función |
| :--- | :--- | :--- |
| 1-20 | Bash, Taunt, Cleave | Generación de amenaza y daño base. |
| 21-40 | Shield Wall, Whirlwind, Disarm | Mitigación pesada y control de armas enemigas. |
| 41-60 | Avatar, Execute, Last Stand | Transformación en coloso y remates de ejecución. |

### Ladrón (Utilidad y Rapidez)
Maestro de los objetos, las trampas y el movimiento.
- **Stats:** Agilidad (10/10), Astucia (8/10), Fuerza (5/10).

| Niveles | Habilidades Clave | Función |
| :--- | :--- | :--- |
| 1-20 | Pickpocket, Hide, Backstab | Sigilo básico y robo de NPCs. |
| 21-40 | Vanish, Trip, Poison Weapon | Escapes rápidos y debuffs de veneno. |
| 41-60 | Shadowstep, Blind, Master of Keys | Movimiento instantáneo y apertura de cualquier cerradura. |

---

## 4. Análisis de Clases de Combate Sagrado/Marcial

### Paladín (Cruzado Protector)
Híbrido de tanque y sanador.
- **Stats:** Fuerza (8/10), Estamina (8/10), Voluntad (7/10).

| Nivel | Habilidad | Efecto |
| :--- | :--- | :--- |
| 5 | Judge | Golpe sagrado que debilita al enemigo. |
| 15 | Lay on Hands | Curación instantánea masiva (cooldown largo). |
| 30 | Holy Shield | Refleja daño sagrado al bloquear. |
| 50 | Avenging Wrath | Aumenta el daño y curación un 50%. |

### Monje (Equilibrio Interior)
Combate sin armas, alta evasión y combos.
- **Stats:** Agilidad (9/10), Fuerza (7/10), Voluntad (7/10).

| Nivel | Habilidad | Efecto |
| :--- | :--- | :--- |
| 1 | Jab | Ataque básico que genera 1 de Enfoque. |
| 10 | Tiger Palm | Consume Enfoque para ignorar armadura. |
| 25 | Flying Kick | Cierra la distancia e incapacita. |
| 55 | Quivering Palm | Posibilidad de muerte instantánea en mobs (Stun largo en Boss). |

---

## 5. Análisis de Clases de Magia y Naturaleza

### Clérigo (Voz de la Providencia)
El sanador por excelencia, vital para cualquier grupo.
- **Stats:** Voluntad (10/10), Intelecto (8/10), Estamina (6/10).

| Nivel | Habilidad / Hechizo | Efecto |
| :--- | :--- | :--- |
| 1 | Sanación Menor | Cura básica de un solo objetivo. |
| 12 | Palabra de Poder: Escudo | Absorbe una cantidad fija de daño. |
| 25 | Rezo de Sanación | Curación de área para todo el grupo. |
| 40 | Resurrección | Devuelve a la vida a un aliado caído fuera de combate. |
| 55 | Intervención Divina | El clérigo se sacrifica para dar invulnerabilidad al grupo. |

### Guardabosque (Vigilante de la Naturaleza)
Maestro del arco y las trampas, con una mascota compañera.
- **Stats:** Agilidad (10/10), Estamina (7/10), Astucia (7/10).

| Nivel | Habilidad | Efecto |
| :--- | :--- | :--- |
| 1 | Disparo Firme | Daño físico a distancia. |
| 10 | Trampa de Hielo | Congela al primer enemigo que la pise. |
| 20 | Llamar Mascota | Invoca un lobo o jabalí para ayudar en combate. |
| 45 | Lluvia de Flechas | Daño masivo de área a distancia. |
| 60 | Marca del Cazador | Aumenta el daño recibido por el objetivo un 25%. |

### Asesino (Sombra Letal)
Especialista en daño explosivo y venenos mortales.
- **Stats:** Agilidad (10/10), Fuerza (8/10), Astucia (9/10).

| Nivel | Habilidad | Efecto |
| :--- | :--- | :--- |
| 1 | Puñalada | Ataque básico desde sigilo. |
| 15 | Veneno de Agonía | DoT potente que reduce la curación recibida. |
| 35 | Danza de Acero | Aumenta la velocidad de ataque un 100% por 10s. |
| 50 | Golpe al Tendón | Reduce la velocidad de movimiento y ataque del enemigo. |
| 60 | Ejecución Silenciosa | Daño masivo si el objetivo tiene menos del 20% de vida. |

---

## 5. Análisis de Clases de Magia y Naturaleza

### Mago (Poder Arcano)
Daño elemental puro y control del espacio-tiempo.
- **Stats:** Intelecto (10/10), Astucia (7/10), Estamina (3/10).

| Nivel | Hechizo | Efecto |
| :--- | :--- | :--- |
| 1 | Fireball | Daño de fuego + quemadura. |
| 15 | Polymorph | Convierte al enemigo en oveja (incapacitación). |
| 30 | Ice Block | El mago se congela, volviéndose invulnerable pero inmóvil. |
| 50 | Arcane Power | Dobla el daño mágico durante 15 segundos. |

### Bruja (Maldiciones y Sombras)
Maestra de los DoTs y la manipulación mental.
- **Stats:** Intelecto (9/10), Voluntad (8/10), Astucia (8/10).

| Nivel | Hechizo | Efecto |
| :--- | :--- | :--- |
| 1 | Agony | Daño que aumenta con el tiempo. |
| 20 | Curse of Weakness | Reduce la fuerza y daño físico del enemigo. |
| 45 | Haunt | Envía un espíritu que daña y sana a la bruja. |
| 60 | Ritual de Almas | Crea una gema que permite resucitar una vez automáticamente. |

### Druida (Polimorfismo Natural)
La clase híbrida definitiva, capaz de adaptarse a cualquier situación.
- **Stats:** Estamina (8/10), Intelecto (8/10), Agilidad (8/10).

| Nivel | Habilidad / Forma | Función |
| :--- | :--- | :--- |
| 10 | Forma de Oso | Rol: Tanque. Aumenta armadura y salud. |
| 20 | Forma de Felino | Rol: DPS Melé. Usa energía y sigilo. |
| 30 | Recrecimiento | Rol: Healer. Curación en el tiempo potente. |
| 45 | Forma de Lechúcico | Rol: DPS Mágico. Potencia hechizos de naturaleza. |
| 60 | Furia de la Naturaleza | Invoca un terremoto y tormenta de rayos masiva. |

---

## 6. Resumen de Roles y Sinergias

| Clase | Rol Principal | Recurso | Estilo de Juego |
| :--- | :--- | :--- | :--- |
| **Guerrero** | Tanque | Ira | Primera línea, agresivo. |
| **Mago** | DPS Mágico | Mana | Frágil, daño explosivo. |
| **Clérigo** | Healer | Mana | Soporte puro, defensivo. |
| **Paladín** | Tanque/Off-Heal | Favor | Protector, aura de soporte. |
| **Bardo** | Jack-of-all-trades | Energía | Versátil, adaptable, rítmico. |
| **Ladrón** | Utilidad | Energía | Rápido, oportunista, técnico. |
| **Asesino** | Burst DPS | Energía | Letal, oculto, de corta duración. |
| **Guardabosque** | DPS Rango | Energía | Constante, con mascota, táctico. |
| **Monje** | DPS/Evasión | Enfoque | Marcial, combos, rítmico. |
| **Bruja** | DPS DoT | Mana | Sádico, controlador, debilitador. |
| **Druida** | Híbrido | Mana/Ene/Ira | Complejo, adaptativo, completo. |

> [!IMPORTANT]
> Esta estructura permite que InheronMUD tenga un sistema de "clases puras" pero con suficiente solapamiento (especialmente a través del Bardo y el Druida) para que grupos pequeños puedan superar contenido difícil.


> [!TIP]
> Para una implementación técnica en RanvierMUD, cada una de estas habilidades debe definirse en `bundles/bundle-example-classes/skills/` y los hechizos en `spells/`. Las clases se configuran en los archivos YAML del bundle de clases.
