# Diseño de Mazmorra: Las Catacumbas del Primogénito

## Visión General
- **Ubicación:** Panteón del Cementerio de Aethelgard.
- **Estructura:** 5 niveles (Sótano 1 al 5), escalando del Nivel 5 al 15 de jugador.
- **Tamaño Estimado:** ~150 salas (30 a 40 salas por nivel).

---

## Estado de Desarrollo

### Sótano 1: El Osario de los Falsos Santos (Lv 5-7)
**Estado:** ✅ **Completado (30 Salas)**
- **Temática:** No-muertos, criptas familiares, laboratorios de nigromancia incipiente.
- **Estructura:** Cruce de tumbas, fosas comunes, zonas de embalsamamiento y el gran trono circular.
- **Mecánicas:**
  - Puzzle de pared ilusoria (Antorcha Secreta).
  - Recolección de llaves en cadáveres para abrir cofres ornamentados.
- **Bestiario Implementado:**
  - Esqueleto Guardián, Acólito Renacido, Araña Sepulcral, Necrófago Hambriento, Nigromante Novicio, Caballero Caído.
- **Loot Destacado:** Pergamino de Sombras Menores, Cota de Malla Rota, Báculo de Nigromante, Espadón Cruzado.
- **Jefe de Planta:** Osric el Falso Santo (Liche Nv. 15). Suelta el *Cetro de la Corrupción Absoluta* y la *Corona del Hereje*.

### Transición (Sótano 1 -> Sótano 2)
**Estado:** ✅ **Completado (3 Salas Especiales)**
- **Trampa del Puente de la Confesión:** Falso puente con 50% de probabilidad de derrumbe al cruzarlo.
- **Foso de Pinchos:** Penalización brutal (50 de daño directo) y combate forzado contra el "Horror Abismal" (Nv. 12) si caes en la trampa antes de poder trepar de vuelta.

### Sótano 2: La Prisión Inquisitorial (Lv 7-9)
**Estado:** ✅ **Completado (40 Salas con Transición)**
- **Temática:** Tortura, celdas de aislamiento, inquisición sombría, locura pura.
- **Estructura Arquitectónica:** 
  - *Hub-and-Spoke* masivo centrado en la "Nave Central".
  - Bloque A y Bloque B (pasillos de prisioneros regulares).
  - Bloque C (Aislamiento a oscuras).
  - Cámaras de interrogatorio equipadas con doncellas de hierro y fosos de ahogamiento.
  - Pabellón privado y biblioteca del Alcaide.
- **Bestiario Implementado:**
  - Guardia Carcelero, Prisionero Demente, Torturador Ciego, Inquisidor de las Sombras.
- **Loot Destacado:** Porras de Hierro, Látigos de Púas, Tomos de Condena.
- **Jefe de Planta:** Gran Inquisidor Mordecai (Nv. 18, 600 HP). Suelta la *Gran Hacha del Verdugo* y la *Máscara de Hierro Fundido*.

### Sótano 3: Los Acueductos Hundidos (Lv 9-11)
**Estado:** ❌ **Pendiente**
- **Punto de Inicio:** El Ascensor de Poleas que baja desde el despacho de Mordecai en el Sótano 2.
- **Temática Proyectada:** Entorno acuático oscuro, ahogados, fango, bestias anfibias.
- **Mecánicas Proyectadas:** 
  - Puzzle central de válvulas para drenar zonas inundadas y abrir compuertas de presión.
  - Posibles mecánicas de ralentización o falta de aire (dependiendo de las capacidades del motor).

### Sótano 4: El Sagrario Corrompido (Lv 11-13)
**Estado:** ❌ **Pendiente**
- **Temática Proyectada:** Magia oscura, sectarios de alto nivel, laberintos de ilusión y altares de sacrificio de sangre.
- **Mecánicas Proyectadas:** 
  - Salas ilusorias que despistan la brújula o conectan de formas no euclidianas.

### Sótano 5: El Abismo del Primogénito (Lv 13-15)
**Estado:** ❌ **Pendiente**
- **Temática Proyectada:** El núcleo geológico del mal, estalactitas oscuras, la entidad suprema encerrada.
- **Mecánicas Proyectadas:** 
  - Recolección obligatoria de 4 "Sellos" arcanos custodiados por 4 sub-jefes ubicados en los extremos cardinales del mapa para poder quebrar el cierre de la puerta central del Abismo.

---

## Mejoras Globales y Reglas de Calidad Aseguradas en el Motor

Durante el desarrollo de estos primeros dos sótanos, hemos refinado e implementado las siguientes mejoras al motor y estándares de escritura que ahora constan en nuestra *Guía de Creación de Zonas*:

- ✅ **Inmersión Sin Etiquetas:** Se han purgado del MUD las etiquetas explícitas de sentidos `(Vista, Tacto)` a favor de descripciones fluidas, evocadoras e integradas en el texto de forma natural.
- ✅ **Navegación Intuitiva:** El flujo de descripciones siempre termina con un segundo párrafo que explica claramente hacia dónde llevan las salidas evidentes sin confundir al jugador.
- ✅ **Interacción Ambiental Web (`roomDesc`):** Todo objeto en el suelo o manipulable tiene ahora una descripción de entorno, permitiendo que el Frontend web moderno lo detecte como interactivo (mostrando el panel de "Tocar, Usar, Get...").
- ✅ **Sincronización Web Dinámica:** Solucionados problemas de sincronización de estado (como paredes falsas) forzando inteligentemente la ejecución oculta del comando `look` cuando el jugador manipula el entorno.
- ✅ **UI Contextual:** El panel del minimapa web ha sido parcheado para leer dinámicamente el `Title` de la sala en vez del estático "Map".
- ✅ **Ley de Integridad de Armas:** Implementado obligatoriamente el atributo `speed` a todas las armas para prevenir crasheos catastróficos del sistema de combate base.
- ✅ **Ley del Botín Accesible:** Integrado a nivel de sistema que los `[Skill: Economist]` fuercen la propiedad `lootable: true` y distribuyan un pool realista de pociones, armaduras y armas sobre los cadáveres.