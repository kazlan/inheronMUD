---
title: "INHERONMUD — SISTEMA DE EXPLORACIÓN TEXTUAL Y SALAS INTERACTIVAS"
---

# INHERONMUD — SISTEMA DE EXPLORACIÓN TEXTUAL Y SALAS INTERACTIVAS
## Diseño detallado para habitaciones vivas, interacción ambiental, descubrimiento y navegación inmersiva en Ranvier

Documento de diseño sistémico. Objetivo: definir cómo debe funcionar la exploración textual de InheronMUD para que cada sala, camino, edificio, bosque, mazmorra y rincón aparentemente inocente pueda ser jugable, legible, reactivo e inmersivo. Este sistema debe convertir el mundo en algo más que una red de habitaciones: debe ser una crónica explorada con botas, nariz, oído, mapas torcidos y una saludable desconfianza hacia las puertas que respiran.

Stack previsto: Ranvier / Node.js.
Región inicial de referencia: Villaclara, Altherion.
Sistemas relacionados: quests/arcos, combate por turnos, personajes/progresión, reputación, NPCs, tiempo, mazmorras, bestiario, objetos y Crónica Viva.

## 1. Principios de diseño

### 1.1 La habitación como unidad narrativa y jugable

En un MUD, la sala no es solo coordenada. Es escenario, interfaz, pista, obstáculo, memoria, amenaza y oportunidad. Cada sala relevante debe responder a la pregunta: “¿qué puede hacer aquí el jugador además de atravesarla?”.

Una buena sala de Inheron debe poder tener:
- Descripción evocadora.
- Salidas claras.
- Objetos examinables.
- NPCs o señales de vida.
- Posibles pistas.
- Cambios por hora, clima o quest.
- Interacciones opcionales.
- Ganchos de exploración.
- Conexión con reputación, clase o trasfondo.

No todas las salas necesitan diez secretos. Pero todas deberían parecer parte de un mundo que existe aunque el jugador cierre sesión.

### 1.2 Claridad antes que literatura ornamental

El texto puede ser bonito, pero debe informar. Si una sala tiene una salida al norte, un pozo interactivo, una trampilla sospechosa o un NPC clave, el jugador debe poder detectarlo sin leer como archivero castigado.

Estructura recomendada de sala:
1. Nombre de sala.
2. Descripción atmosférica breve.
3. Detalles visibles relevantes.
4. Entidades presentes.
5. Salidas claras.
6. Indicadores de quest o interacción, si procede.

Ejemplo:
Plaza del Alba Chica
La plaza despierta entre toldos dorados, olor a pan y campanas pequeñas. La estatua de Seralyne mira hacia el Camino de Candaluz con una paciencia que el alcalde no comparte.

Ves: tablón del Gremio, fuente solar, estatua de Seralyne, puesto de frutas.
Personas: Silo Brincacepa, Bimba Cascabel, dos mercaderes.
Salidas: norte al Alto de la Campana, este a la Calle del Pan Caliente, sur al Campo Norte, oeste a la Posada del Segundo Gallo.
Pista: el tablón tiene un contrato nuevo sin sello visible.

### 1.3 El jugador debe poder preguntar al mundo

La exploración textual debe premiar curiosidad. Comandos como mirar, examinar, buscar, escuchar, oler, tocar, leer y usar deben estar soportados de forma consistente.

Regla de oro:
Si el texto menciona algo interesante, el jugador debería poder examinarlo.

Si una descripción dice “la trampilla conserva gel brillante”, examinar trampilla o gel debe responder algo útil. Si no responde, el mundo se convierte en decorado pintado. Y los decorados pintados no esconden mazmorras, salvo en Verdanza, pero eso ya será otro problema.

### 1.4 Capas de información

Cada sala debe poder revelar información en capas:

Capa visible:
Lo que cualquier jugador ve al entrar.

Capa examinable:
Lo que aparece al examinar objetos, detalles o NPCs.

Capa sensorial:
Lo que se descubre con escuchar, oler, tocar o percibir.

Capa de búsqueda:
Lo que requiere buscar, atributo, skill, herramienta o condición.

Capa de historia:
Lo que aparece por quest, reputación, clase, Crónica o pista previa.

Capa secreta:
Lo que se descubre con alta Percepción, Cartógrafo, Arcanista, Inspector, objeto especial o evento.

### 1.5 El entorno debe ser interactivo, pero no agotador

No queremos que el jugador tenga que escribir examinar piedra, tocar piedra, lamer piedra y declarar enemistad a la piedra para avanzar. El sistema debe ser generoso con sinónimos, pistas y redundancia.

Toda pista crítica debe tener varias vías:
- Examinar objeto.
- Hablar con NPC.
- Usar skill.
- Buscar sala.
- Avanzar por quest alternativa.

### 1.6 El mundo recuerda

La exploración debe cambiar según lo ocurrido:
- Si el jugador salva a Otilia, el tablón muestra una cinta con su nombre.
- Si quema la bodega de Doña Marga, la panadería huele a reproche y carbón.
- Si descubre el Pozo Cantante, su descripción nocturna cambia.
- Si la Cámara actúa, algunos textos muestran huecos, repeticiones o nombres borrados.

Este sistema debe alimentar la sensación de que los arcos tienen consecuencias visibles.

## 2. Comandos principales de exploración

### 2.1 mirar

Comando base para ver la sala actual.

Alias sugeridos:
- mirar
- look
- l
- ver

Debe mostrar:
- Nombre de sala.
- Descripción actual según estado.
- Objetos visibles.
- NPCs visibles.
- Criaturas visibles.
- Salidas.
- Pistas o avisos, si son evidentes.

Variantes:
- mirar [objeto]
- mirar [npc]
- mirar salidas
- mirar alrededor
- mirar combate, cuando está en combate.

### 2.2 examinar

Profundiza en un objeto, NPC, detalle o elemento mencionado.

Alias:
- examinar
- inspeccionar
- observar
- mirar de cerca

Debe revelar:
- Descripción detallada.
- Estado del objeto.
- Posibles interacciones.
- Pistas.
- Requisitos si falta algo.

Ejemplo:
examinar trampilla
“La trampilla del horno viejo está cerrada con un pestillo que alguien ha limpiado mal. Hay gel transparente en el borde, y una cuchara asoma entre las tablas. Pex evita mirar en esta dirección con una disciplina sospechosa”.

### 2.3 buscar

Acción activa de exploración. Puede consumir tiempo, activar eventos o requerir tirada.

Alias:
- buscar
- registrar
- rebuscar

Usos:
- buscar
- buscar en [objeto]
- buscar [pista]
- buscar salida secreta

Reglas:
- En sala segura: sin riesgo.
- En dungeon: puede activar encuentro, trampa o consumir turno de exploración.
- Si hay una pista crítica, no debe depender de una única tirada fallida permanente.

Ejemplo:
buscar en sacos
“Entre harina normal y harina con ambiciones, encuentras una cuchara mordida y una marca circular en el suelo”.

### 2.4 escuchar

Detecta sonidos, conversaciones, maquinaria, magia sonora, monstruos o señales.

Importante para:
- Pozo Cantante.
- Campanas.
- Bardos.
- Topos campaneros.
- Enemigos preparando acciones.
- Mazmorras vivas.

Ejemplo:
escuchar pozo
“El pozo no canta exactamente una melodía. Tararea un nombre al que todavía le faltan letras”.

### 2.5 oler

Comando sensorial útil, especialmente en cocina, alquimia, bestias, venenos, mazmorras y rastreo.

Ejemplo:
oler horno
“Huele a pan, piedra antigua y algo que no es quemado, pero se está planteando el tema”.

Aplicaciones:
- Detectar venenos.
- Identificar slimes.
- Encontrar cocina o ingredientes.
- Detectar corrupción de Sombra.
- Leer estado de una mazmorra orgánica.

### 2.6 tocar

Interactúa físicamente de forma ligera. Puede revelar textura, temperatura, vibración o activar efectos pequeños.

Ejemplo:
tocar estatua
“La piedra está tibia, aunque la plaza sigue a la sombra. Durante un instante, la placa bajo la estatua parece tener una línea más de texto”.

Advertencia:
Tocar cosas mágicas debe ser útil, pero también puede ser imprudente. El juego debe avisar cuando algo parezca peligroso.

### 2.7 leer

Para carteles, libros, actas, tablones, inscripciones, mapas y documentos.

Alias:
- leer
- consultar

Ejemplo:
leer contrato
“El contrato promete veinte soles por vigilar forasteros de procedencia inestable. El sello parece correcto, quizá demasiado correcto. La tinta no proyecta sombra”.

### 2.8 usar

Comando genérico para objetos, herramientas o elementos ambientales.

Usos:
- usar llave en puerta
- usar vela en registro
- usar tiza en suelo
- usar pan duro en slime
- usar campanilla

Debe conectarse con inventario, quests, combate y entorno.

### 2.9 abrir / cerrar / empujar / tirar / mover

Comandos físicos para interacción clara.

Ejemplos:
abrir trampilla
cerrar verja
empujar estatua
tirar de palanca
mover mesa

Deben soportar alias razonables y mensajes útiles si falla.

### 2.10 entrar / salir / viajar

Para transiciones especiales:
- entrar panadería
- entrar pozo, si se desbloquea
- salir de la mazmorra
- viajar a Candaluz

### 2.11 mapa / rutas / orientarse

Comandos de navegación. Se diseñarán en detalle en el sistema de mapas, pero exploración debe reservarlos.

mapa:
Muestra zona conocida.

rutas:
Muestra destinos desde posición actual.

orientarse:
Ayuda a jugadores perdidos; usa Percepción, Cartografía o conocimiento local.

## 3. Anatomía de una sala

### 3.1 Campos mínimos

Cada sala debería tener:

id:
Identificador técnico único.

nombre:
Nombre visible.

tipo:
Interior, exterior, dungeon, hub, camino, tienda, santuario, peligro, instancia.

zona:
Villaclara, Campo Norte, Sótano de Masa Viva, etc.

descripción base:
Texto principal.

salidas:
Direcciones y destinos.

objetos visibles:
Elementos examinables/interactivos.

NPCs/criaturas:
Habitantes, enemigos, mascotas, comerciantes.

flags:
Estados técnicos.

scripts:
Eventos al entrar, examinar, buscar, interactuar.

### 3.2 Campos avanzados

variantes de descripción:
Por hora, clima, quest, reputación, clase, estado de mundo.

detalles sensoriales:
Sonido, olor, temperatura, tacto, magia.

pistas:
Clues asociadas.

secretos:
Objetos o salidas ocultas.

rasgos de entorno:
Para combate: harina en suspensión, cobertura, agua, luz, espejos.

interacciones:
Acciones posibles con objetos.

nivel de peligro:
Seguro, bajo, medio, alto, boss.

respawn:
Reglas de aparición de criaturas.

visitado:
Por jugador o party.

memoria de sala:
Cambios por consecuencia.

### 3.3 Ejemplo YAML de sala

```yaml
id: villaclara_panaderia_principal
name: Panadería Panbendito
type: shop
zone: villaclara
tags: [hub, shop, food, quest, villaclara]
baseDescription: >
  La Panadería Panbendito huele a trigo dorado, mantequilla y autoridad doméstica.
  Tras el mostrador, los hornos trabajan con una obediencia que ningún aventurero ha logrado igualar.
  Una trampilla vieja junto al horno parece demasiado limpia para no ser culpable.
exits:
  west: villaclara_calle_pan_caliente
  down:
    target: sotano_masa_viva_entrada
    lockedBy: quest:villaclara_pex_cucharas:step_open_trapdoor
visibleObjects:
  - mostrador
  - hornos
  - trampilla
  - cestas_de_pan
  - pex
npcs:
  - dona_marga_panbendito
conditionalDescriptions:
  - condition: flag:panaderia_bodega_quemada
    append: >
      Un olor tenue a carbón recuerda cierto incidente del que Doña Marga no habla: lo sirve en forma de mirada.
  - condition: questActive:villaclara_pex_cucharas
    append: >
      Pequeñas gotas de gel forman una ruta irregular hacia la trampilla del horno viejo.
interactions:
  trampilla:
    examine: clue_pex_gel_trampilla
    open:
      requires: questStep:villaclara_pex_cucharas:follow_pex
      successMoveTo: sotano_masa_viva_entrada
  hornos:
    examine: clue_horno_piedra_aureana
    useWith:
      vela_lua: clue_linea_solar_horno
```

## 4. Descripciones variables

### 4.1 Por hora del día

El tiempo debe cambiar el tono y la información.

Mañana:
- Tiendas abren.
- Pan fresco.
- Milicia entrena.
- Campo activo.

Mediodía:
- Mercado.
- Tías del Mantel Blanco en lavadero.
- Luz solar intensa.
- Cámara puede actuar con símbolos verticales.

Tarde:
- Regreso de campesinos.
- Taberna se llena.
- Sombras largas.

Noche:
- Pozo canta.
- Varo trabaja en archivo.
- Ruidos de dungeon.
- Contratos falsos aparecen.

Ejemplo Pozo Cantante:
Día:
“El pozo parece viejo, amable y ligeramente más importante de lo que el alcalde admite”.

Noche:
“El agua del pozo refleja estrellas que no están arriba. Una melodía sube desde la piedra, fina como hilo dorado”.

### 4.2 Por clima

Climas iniciales sugeridos:
- Despejado.
- Llovizna solar.
- Niebla de arroyo.
- Viento de Hojaluna.
- Calor de cosecha.
- Tormenta de campanas.

Efectos:
- Cambios descriptivos.
- Modificadores leves a exploración.
- Aparición de criaturas.
- Habilitar pistas.

Ejemplo:
Con niebla de arroyo, los reflejos del agua pueden mostrar rutas de Verdanza.

### 4.3 Por progreso de quest

Las salas deben tener capas por quest activa/completada.

Antes de Otilia:
“El archivo municipal huele a pergamino, polvo y sellos obedientes”.

Durante Otilia:
“Un registro abierto sobre la mesa muestra una línea en blanco donde debería haber un nombre. La tinta blanca parece esperar”.

Después de Otilia:
“Alguien ha atado una cinta azul al lomo del registro corregido. Otilia dice que fue ella. Nadie se atreve a discutirlo”.

### 4.4 Por reputación

Reputación baja o alta cambia cómo se percibe el lugar.

Villaclara alta:
“Dos vecinos te saludan por tu nombre y apartan una cesta para dejarte pasar”.

Villaclara baja:
“Las conversaciones bajan un tono al verte entrar. Alguien protege una cesta de pan con instinto maternal”.

### 4.5 Por clase/origen

Algunas clases ven matices diferentes.

Arcanista:
Percibe corrientes, sellos, resonancias, magia residual.

Cartógrafo:
Percibe simetrías, rutas, puertas ocultas, geometría rara.

Inspector:
Percibe peligros, incumplimientos, trampas, normas violadas por arquitectura arrogante.

Bardo:
Percibe ecos, ritmo, nombres, tensión social.

Cocinero:
Percibe olores, ingredientes, fermentaciones sospechosas.

Invocado:
Percibe rarezas que no cuadran con lógica del mundo.

Ejemplo:
En la panadería, un Cocinero detecta que la masa madre está “emocionalmente despierta”. Un Arcanista detecta Corriente de Brasa y Alba bajo el horno. Un Inspector detecta que el sótano no cumple normativa espacial en tres dimensiones y media.

## 5. Objetos examinables e interactivos

### 5.1 Categorías de objetos de sala

Decorativos examinables:
Dan sabor y pequeños datos. No siempre tienen función.

Pistas:
Desbloquean clues o pasos de quest.

Interactivos simples:
Puertas, palancas, cofres, bancos, campanas.

Herramientas ambientales:
Se pueden usar en combate o puzzles.

Contenedores:
Sacos, estanterías, baúles, cajones.

Peligros:
Trampas, grietas, cristales, tinta viva.

Servicios:
Tablón, mostrador, altar, cama, fuente, herrería.

Reliquias/objetos especiales:
Con memoria, estados o progresión.

### 5.2 Todo objeto visible debe tener respuesta

Si aparece en “Ves:”, debe responder a examinar.

Respuesta mínima:
“No parece tener nada especial, salvo que alguien lo limpia con más fe que técnica”.

Mejor respuesta:
“El banco está lleno de marcas de navaja: iniciales, fechas de feria y un dibujo sorprendentemente táctico de un conejo con casco”.

### 5.3 Verbos por objeto

Cada objeto puede soportar verbos definidos.

Ejemplo campana:
- examinar campana
- escuchar campana
- tocar campana
- usar campanilla
- tirar de cuerda

Ejemplo registro:
- leer registro
- examinar tinta
- usar vela en registro
- buscar nombre en registro
- firmar registro

Ejemplo pozo:
- mirar pozo
- escuchar pozo
- tocar agua
- lanzar moneda
- usar cuerda
- usar vela
- cantar nombre

### 5.4 Interacciones fallidas útiles

Cuando el jugador intenta algo incorrecto, no decir solo “no puedes”. Dar información.

Malo:
“No puedes hacer eso”.

Bueno:
“La trampilla no se abre. El pestillo está cerrado desde dentro, lo cual tiene poco sentido y demasiada personalidad”.

Mejor:
“La trampilla no se abre. Quizá Pex sepa cómo entra, si consigues que deje de fingir ser un charco inocente”.

## 6. Sistema de pistas ambientales

### 6.1 Pistas visibles y pistas descubiertas

Pista visible:
Se menciona en la sala, pero aún no se registra.

Pista descubierta:
Tras examinar, usar herramienta o cumplir condición, se añade a la Crónica.

Ejemplo:
Visible: “la tinta no proyecta sombra”.
Descubierta: clue_tinta_blanca_no_sombra.

### 6.2 Pistas críticas con redundancia

Toda pista crítica debe poder encontrarse por al menos dos métodos.

Ejemplo: línea solar entre horno y pozo.
Métodos:
- Arcanista usa Detectar Resonancia en horno.
- Hermana Lúa presta vela de Lúa.
- Cartógrafo observa alineación en mapa antiguo.
- Cocinero detecta que la masa fermenta al ritmo del pozo.

### 6.3 Pistas de baja, media y alta importancia

Baja:
Sabor, lore menor, chistes, color local.

Media:
Ayuda a resolver quest opcional, mejora recompensa.

Alta:
Necesaria para avanzar o entender un arco.

### 6.4 Registro en Crónica Viva

Al descubrir pista:
[Crónica actualizada] Has descubierto: La tinta blanca no proyecta sombra.

La Crónica debe explicar por qué importa:
“La misma falta de sombra aparece en contratos falsos del tablón. Quizá ambos documentos compartan origen”.

## 7. Secretos y descubrimiento

### 7.1 Tipos de secretos

Salidas ocultas:
Pasadizos, trampillas, rutas de bosque, puertas de mazmorra.

Objetos ocultos:
Llaves, diarios, reliquias, monedas raras, ingredientes.

Pistas ocultas:
Datos de lore o quest.

Encuentros ocultos:
NPCs, monstruos raros, eventos.

Capas de memoria:
Versiones antiguas de sala o recuerdos.

### 7.2 Descubrimiento activo y pasivo

Pasivo:
Si Percepción/skill suficiente, el jugador recibe aviso al entrar.

Ejemplo:
“Notas una corriente fría bajo la estantería”.

Activo:
Buscar, examinar, usar herramienta o skill.

Ejemplo:
buscar estantería
“Una sección de libros no tiene polvo. El libro de contabilidad está pegado a un mecanismo”.

### 7.3 No bloquear contenido crítico por mala tirada

Los secretos críticos deben ser reintentables o encontrables por otras rutas. Los secretos opcionales sí pueden fallarse temporalmente.

### 7.4 Descubrimiento por clase

Cartógrafo:
Más fácil detectar rutas, simetrías y mapas falsos.

Inspector:
Más fácil detectar trampas, incumplimientos y mecanismos.

Arcanista:
Más fácil detectar magia y Corrientes.

Bardo:
Más fácil detectar memoria, ecos y nombres.

Cocinero:
Más fácil detectar ingredientes y organismos comestibles, comestibles con dudas o definitivamente no comestibles.

## 8. Movimiento y navegación

### 8.1 Salidas claras

Toda sala debe listar salidas disponibles.

Formato:
Salidas: norte, este, sur, oeste, arriba, abajo.

Para rutas especiales:
Salidas: norte al Alto de la Campana, este a la Calle del Pan Caliente.

### 8.2 Direcciones y destinos nombrados

Soportar:
- norte / n
- ir norte
- ir a panadería
- entrar panadería
- viajar a Candaluz, si es ruta larga

### 8.3 Puertas y barreras

Salidas pueden tener estados:
- abierta.
- cerrada.
- bloqueada.
- oculta.
- sellada.
- peligrosa.
- requiere quest.
- requiere llave.
- requiere reputación.
- requiere skill/herramienta.

Mensaje de salida bloqueada:
“La puerta al archivo está cerrada. Silo tiene la llave durante el día; de noche, Varo parece tener demasiada”.

### 8.4 Orientación para jugadores perdidos

Comando orientarse:
Muestra ubicación relativa, rutas importantes y próximo objetivo si hay quest activa.

Ejemplo:
Estás en la Calle del Pan Caliente, al este de la Plaza del Alba Chica. La Panadería Panbendito está aquí. El Gremio queda al oeste y norte. Tu Crónica sugiere seguir el rastro de gel hacia la trampilla del horno viejo.

### 8.5 Atajos

Atajos se desbloquean por exploración, quest o reputación.

Ejemplos:
- Pasaje entre panadería y callejón del arroyo.
- Ruta de Bimba entre plaza y lavadero.
- Sendero de Hojaluna hacia bosque.
- Pliegue de Cartógrafo en dungeon.

## 9. Exploración y tiempo

### 9.1 Acciones que consumen tiempo

En zonas seguras, el tiempo puede ser ligero. En dungeons o eventos, algunas acciones avanzan reloj.

Acciones que pueden consumir tiempo:
- buscar exhaustivamente.
- forzar puerta.
- descansar.
- leer documento largo.
- ritual.
- abrir cerradura.
- preparar trampa.

### 9.2 Reloj de dungeon

En mazmorras, cada X acciones de exploración puede activar:
- patrulla.
- cambio de sala.
- respawn menor.
- evento ambiental.
- avance de peligro.

Ejemplo Sótano de Masa Viva:
Cada 5 acciones lentas, la masa respira y cambia una conexión menor.

### 9.3 Horarios de NPCs

La exploración debe consultar rutinas de NPCs.

Ejemplo:
Doña Marga está en panadería por la mañana/tarde, en plaza durante feria y en cocina de la posada en evento especial.

### 9.4 Ventanas temporales de quest

Algunas pistas solo aparecen en horario:
- Pozo de noche.
- Tías al mediodía.
- Varo en archivo de noche.
- Slime dorado al amanecer tras lluvia.

Debe haber pistas que indiquen cuándo volver.

## 10. Exploración y combate

### 10.1 Precombate

La exploración puede permitir ventaja antes de luchar.

Ejemplos:
- escuchar conejos antes de entrar al campo.
- buscar trampas en sala.
- examinar slime para ver debilidad.
- mover mesa como cobertura.
- apagar horno antes de combatir Masa Madre.

### 10.2 Rasgos de entorno en combate

Cada sala de combate puede tener rasgos:
- cobertura.
- terreno pegajoso.
- luz solar.
- agua.
- harina en suspensión.
- espejos.
- campana.
- barriles.
- mesas.
- altura.

Comando mirar combate debe mostrar esos rasgos.

### 10.3 Transición exploración-combate

Si una interacción activa combate, el mensaje debe ser claro.

Ejemplo:
“Al tirar del saco, la harina cae en una nube blanca. Algo dentro estornuda. Luego ruge. Combate iniciado: Hada de Harina irascible”.

### 10.4 Evitar combate mediante exploración

Algunos encuentros pueden evitarse:
- alimentar slime.
- cerrar puerta.
- tocar campana.
- usar luz.
- negociar.
- encontrar ruta alternativa.

El sistema debe recompensar con XP/Crónica cuando proceda.

## 11. Exploración y clases

### 11.1 Caballero del Alba

Explora protegiendo, abriendo paso, jurando mantener rutas y leyendo símbolos de honor.

Interacciones especiales:
- sostener puerta.
- proteger NPC durante búsqueda.
- jurar guardia sobre lugar.
- detectar profanación de juramentos.

### 11.2 Monje de Candaluz

Explora con calma, movimiento y percepción corporal.

Interacciones:
- cruzar pasarelas frágiles.
- escuchar vibraciones.
- evitar trampas por equilibrio.
- meditar ante campanas.

### 11.3 Cocinero de Mazmorra

Explora con olfato, ingredientes y lectura culinaria de monstruos.

Interacciones:
- identificar ingredientes.
- detectar veneno por olor.
- cocinar para atraer/evitar criaturas.
- distinguir masa normal de masa con objetivos.

### 11.4 Cartógrafo Vivo

Explora rutas, geometría y memoria espacial.

Interacciones:
- trazar mapa.
- detectar salas móviles.
- encontrar atajos.
- revelar rutas con Tinta Viva.

### 11.5 Invocado Desubicado

Explora rarezas y contradicciones.

Interacciones:
- comparar lógica de otro mundo.
- detectar objetos “fuera de género”.
- improvisar herramientas.
- resolver puzzles por analogía rara.

### 11.6 Clérigo del Sol Quieto

Explora luz, verdad y presencia espiritual.

Interacciones:
- bendecir lugar.
- detectar sombras falsas.
- calmar espíritus.
- leer vitrales/reliquias solares.

### 11.7 Duelista de Academia

Explora códigos sociales, duelos y presencia elegante.

Interacciones:
- leer marcas de duelo.
- detectar emboscadas por postura.
- abrir caminos mediante desafío formal.
- evitar conflictos con etiqueta.

### 11.8 Inspector de Mazmorras

Explora con protocolos, sellos y análisis de peligro.

Interacciones:
- clasificar sala.
- detectar trampas.
- colocar sellos.
- clausurar mecanismos.
- convertir peligro en herramienta.

### 11.9 Bardo de Crónica Viva

Explora ecos, canciones, nombres y memoria social.

Interacciones:
- cantar a una sala.
- recordar nombres.
- detectar tensión social.
- activar recuerdos mediante melodías.

### 11.10 Arcanista de las Cinco Corrientes

Explora magia, Corrientes, reliquias y anomalías.

Interacciones:
- detectar resonancia.
- leer Corrientes.
- estabilizar Sobrecarga ambiental.
- identificar sellos.
- revelar tinta blanca.
- manipular Alba, Raíz, Brasa, Marea o Sombra de forma contextual.

## 12. Exploración y reputación

### 12.1 Acceso social

Algunas áreas pueden estar abiertas o cerradas según reputación.

Ejemplos:
- Archivo municipal requiere confianza o permiso.
- Trastienda de Mirta requiere reputación con La Cesta Serena.
- Habitación 3B de la posada requiere confianza con Hermandad.
- Cocina de Doña Marga requiere haber demostrado no ser un desastre con patas.

### 12.2 Descripciones sociales

La sala refleja cómo te ve la gente.

Reputación alta:
“Los vecinos te dejan sitio junto a la fuente”.

Reputación baja:
“Las conversaciones tropiezan al verte llegar”.

### 12.3 Búsqueda social

Al buscar en zonas habitadas, reputación importa.

Buscar archivo sin permiso puede bajar reputación.
Buscar con permiso puede abrir pistas.
Buscar con Otilia al lado puede añadir comentarios de bastón.

## 13. Exploración y objetos/herramientas

### 13.1 Herramientas básicas

- Antorcha.
- Cuerda.
- Tiza.
- Vela de Lúa.
- Campanilla.
- Pan duro.
- Frasco vacío.
- Ganzúa simple.
- Kit de escriba.
- Libreta de mapas.
- Guantes de cuero.

### 13.2 Herramientas como llaves blandas

No deben bloquear siempre, pero ayudan.

Ejemplo:
Sin cuerda: bajar pozo requiere ayuda o ruta alternativa.
Con cuerda: seguro.
Con Cartógrafo: puede improvisar anclaje.
Con Invocado: puede inventar algo que preocupa a todos.

### 13.3 Objetos consumibles en exploración

- Tiza marca ruta.
- Vela detecta tinta o sombra.
- Pan atrae slime.
- Hierbas calman bestia.
- Agua clara limpia residuo.

## 14. Exploración en hubs

### 14.1 Hubs como espacios densos

Villaclara debe tener pocas salas, pero muy densas y reactivas. Mejor 30 salas memorables que 150 pasillos con complejo de trámite.

Tipos de sala de hub:
- Plaza central.
- Tiendas.
- Posada.
- Ayuntamiento.
- Capilla.
- Calles.
- Barrios.
- Campos cercanos.
- Puntos de quest.

### 14.2 Actividad ambiental

Los hubs deben mostrar vida:
- NPCs moviéndose.
- Rumores.
- Puestos de mercado.
- Horarios.
- Niños corriendo.
- Slimes domésticos.
- Campanas.
- Eventos temporales.

### 14.3 Mensajes ambientales periódicos

Mensajes cortos cada cierto tiempo, no invasivos.

Ejemplos:
“Bimba cruza la plaza con tres cartas y una expresión de importancia oficial autoproclamada”.

“Desde la panadería llega un golpe seco y la voz de Doña Marga: ‘¡Pex!’”.

“El pozo guarda silencio. Demasiado silencio, si eso fuera una medida legal”.

## 15. Exploración en mazmorras

### 15.1 Mazmorra textual viva

Una dungeon debe ser más que habitaciones con enemigos. Debe tener identidad, reglas y cambios.

Sótano de Masa Viva:
- Salas orgánicas de panadería antigua.
- Olor, calor, respiración.
- Paredes blandas.
- Rutas que cambian.
- Enemigos de harina, mermelada y masa.
- Interacciones culinarias.

### 15.2 Estados de sala en dungeon

- Inexplorada.
- Explorando.
- Limpiada.
- Alterada.
- Sellada.
- Colapsada.
- Recordada.
- Corrompida.

### 15.3 Mapa incompleto

El jugador no debería tener mapa perfecto al entrar. Debe descubrir sala a sala.

Cartógrafo puede mejorar esto.
Tiza puede marcar ruta.
Inspector puede sellar salas.
Arcanista puede estabilizar pasillos.

### 15.4 Puzzles y mecanismos

Puzzles textuales deben ser claros, con feedback:
- campanas en orden.
- hornos y presión.
- espejos.
- actas correctas.
- símbolos de Corrientes.
- recetas.

Evitar acertijos oscuros sin pista. El enemigo debe ser la mazmorra, no el diseñador con hambre de venganza.

## 16. Estados de sala y memoria

### 16.1 Flags de sala

Ejemplos:
- visited_by_player.
- searched_by_player.
- clue_found_tinta_blanca.
- trap_disarmed.
- door_unlocked.
- panaderia_bodega_quemada.
- pozo_awakened.
- camara_touched.
- otilia_name_restored.

### 16.2 Memoria local

Algunas salas recuerdan acciones.

Ejemplo:
La mesa rota en taberna puede permanecer rota hasta que se repare.
La campana bendecida puede sonar distinto.
La puerta sellada por Inspector muestra sello.
El mapa de Cartógrafo queda colgado en Gremio.

### 16.3 Memoria alterada

La Cámara puede cambiar descripciones:
- nombres en blanco.
- repeticiones extrañas.
- objetos que “siempre estuvieron ahí”.
- NPCs que dudan.

Ejemplo:
“El cartel del archivo enumera tres normas. Estás seguro de que ayer eran cuatro, aunque nadie parece recordar la cuarta”.

## 17. Salas especiales de Villaclara

### 17.1 Plaza del Alba Chica

Funciones:
- Centro de hub.
- Tablón de misiones.
- Rumores.
- Eventos de feria.
- Encuentros con Silo y Bimba.

Interacciones:
- leer tablón.
- examinar estatua.
- escuchar fuente.
- hablar vecinos.
- buscar rumores.

Secretos:
La estatua proyecta una sombra distinta al mediodía tras activar el arco del Pozo.

### 17.2 Panadería Panbendito

Funciones:
- Tienda de comida.
- Doña Marga.
- Pex.
- Entrada a dungeon.

Interacciones:
- comprar pan.
- examinar hornos.
- seguir gel.
- abrir trampilla.
- oler masa.
- usar vela en horno.

Secretos:
Línea solar entre horno y pozo.

### 17.3 Pozo Cantante

Funciones:
- Nodo de campaña.
- Pistas nocturnas.
- Mapa del Primer Umbral.

Interacciones:
- escuchar.
- tocar agua.
- cantar nombre.
- lanzar moneda.
- usar cuerda.
- usar Sello de Resonancia.

Secretos:
Una gota del Cáliz duerme bajo su agua.

### 17.4 Archivo Municipal

Funciones:
- Quests legales.
- Tinta blanca.
- Varo.
- Otilia.

Interacciones:
- leer actas.
- buscar nombre.
- usar vela.
- examinar tinta.
- firmar o negarse.

Secretos:
Un registro no pesa lo mismo antes y después de medianoche.

### 17.5 Lavadero del Arroyo Brillacepa

Funciones:
- Tías del Mantel Blanco.
- Rumores.
- Slimes.
- Reflejos.

Interacciones:
- escuchar chismes.
- lavar objeto.
- mirar reflejo.
- buscar gel dorado.

Secretos:
Con niebla, el agua muestra una ruta a Verdanza que no existe en mapas normales.

### 17.6 Campo Norte

Funciones:
- Combate inicial.
- Conejos acorazados.
- Calzada aureana.

Interacciones:
- buscar madrigueras.
- examinar huellas.
- recoger verduras.
- tocar piedra enterrada.

Secretos:
Fragmentos de metal aureano conectan con ruinas bajo la pradera.

## 18. Formato de salida recomendado

### 18.1 Sala normal

```
Plaza del Alba Chica
La plaza despierta entre toldos dorados, olor a pan y campanas pequeñas. La estatua de Seralyne mira hacia el Camino de Candaluz.

Ves: tablón del Gremio, fuente solar, estatua de Seralyne, puesto de frutas.
Personas: Silo Brincacepa, Bimba Cascabel.
Salidas: norte, este, sur, oeste.
```

### 18.2 Sala con quest activa

```
Panadería Panbendito
El aire huele a pan caliente y a paciencia agotada. Doña Marga vigila el mostrador como si fuera una frontera militar.

Ves: hornos, mostrador, trampilla vieja, gotas de gel.
Personas: Doña Marga. Pex intenta parecer una mancha.
Salidas: oeste.

[Quest] Pex y las cucharas desaparecidas: el rastro de gel llega hasta la trampilla.
```

### 18.3 Sala peligrosa

```
Entrada del Sótano de Masa Viva
Los escalones bajan hacia una oscuridad tibia. Las paredes parecen piedra, pero respiran con la discreción de quien sabe que no debería.

Ves: sacos de harina, marcas de cucharas, grieta palpitante.
Rasgos: harina en suspensión, suelo pegajoso.
Salidas: arriba, este, abajo.
Peligro: bajo-medio.
```

### 18.4 Examinar objeto

```
examinar grieta
La grieta no es exactamente una grieta. Es una boca arquitectónica con olor a levadura. Varias cucharas desaparecen hacia dentro, alineadas como ofrendas diminutas.

[Crónica actualizada] Pex no robaba cucharas por codicia. Algo bajo la panadería las reclama.
```

## 19. Implementación técnica en Ranvier

### 19.1 Bundle recomendado

inheron-exploration

Subcarpetas:
- commands/exploration/
- data/rooms/
- data/objects/
- data/interactions/
- data/secrets/
- data/environment_traits.yml
- lib/RoomRenderer.js
- lib/InteractionManager.js
- lib/DiscoveryManager.js
- lib/SensoryManager.js
- lib/NavigationManager.js
- lib/RoomStateManager.js
- scripts/rooms/

### 19.2 Componentes principales

RoomRenderer:
Genera descripción según estado, hora, clima, reputación, quest y clase.

InteractionManager:
Gestiona verbos sobre objetos y sala.

DiscoveryManager:
Controla pistas, secretos, tiradas y flags de descubrimiento.

SensoryManager:
Responde escuchar, oler, tocar y percepciones especiales.

NavigationManager:
Gestiona salidas, rutas, puertas, bloqueos y atajos.

RoomStateManager:
Persistencia de cambios por jugador, party o mundo.

EnvironmentTraitManager:
Proporciona rasgos de sala al sistema de combate.

### 19.3 Eventos emitidos

- playerLookRoom.
- playerExamineObject.
- playerSearchRoom.
- playerListenRoom.
- playerSmellRoom.
- playerTouchObject.
- playerReadObject.
- playerUseObject.
- playerMoveRoom.
- clueDiscovered.
- secretFound.
- roomStateChanged.
- interactionFailedUseful.

### 19.4 Integración con QuestManager

Al descubrir pista:
DiscoveryManager emite clueDiscovered.
QuestManager actualiza objetivo.
ChronicleRenderer muestra actualización.

Al entrar en sala relevante:
QuestManager puede añadir indicador.
RoomRenderer puede añadir descripción condicional.

### 19.5 Integración con CombatManager

RoomRenderer proporciona rasgos de entorno.
InteractionManager permite preparar entorno antes de combate.
CombatManager puede modificar sala tras combate.

Ejemplo:
Si se usa Brasa en harina, RoomStateManager añade flag harina_quemada y CombatManager aplica explosión.

## 20. Datos técnicos de interacción

### 20.1 Ejemplo objeto interactivo

```yaml
id: objeto_pozo_cantante
name: Pozo Cantante
aliases: [pozo, brocal, agua]
verbs:
  examine:
    default: desc_pozo_examine_day
    conditions:
      - if: time:night
        text: desc_pozo_examine_night
  listen:
    effects:
      - if: questActive:villaclara_pozo_do_menor
        discoverClue: clue_pozo_tararea_nombre
  touch:
    effects:
      - if: hasItem:vela_lua
        discoverClue: clue_agua_refleja_mapa
  use:
    with:
      cuerda:
        action: descend_if_unlocked
      moneda:
        action: rumor_minor
      sello_resonancia_pozo:
        discoverClue: clue_gota_caliz
```

### 20.2 Ejemplo secreto

```yaml
id: secreto_pasaje_panaderia_arroyo
room: villaclara_panaderia_principal
requirements:
  any:
    - skill: cartografia.basic
    - clueFound: clue_linea_solar_horno
    - reputation: dona_marga >= 20
search:
  difficulty: 12
  attribute: perception
onDiscover:
  unlockExit:
    from: villaclara_panaderia_principal
    direction: callejon_arroyo
    to: villaclara_arroyo_callejon
  message: >
    Detrás de los sacos encuentras una puerta estrecha que da al callejón del arroyo.
    Doña Marga la llama salida de emergencia. La puerta parece llamarse a sí misma descanso digestivo.
```

## 21. Herramientas admin y debug

Comandos necesarios:
- roomdebug
- roomflags
- setroomflag [flag]
- clearroomflag [flag]
- showinteractions [room]
- showsecrets [room]
- discoverclue [player] [clue]
- teleport [room]
- reloadroom [id]
- validateRooms

Validación automática:
- Toda salida apunta a sala existente.
- Todo objeto visible tiene descripción.
- Todo alias no colisiona gravemente.
- Toda pista crítica tiene al menos una fuente.
- Toda interacción con quest referencia quest válida.
- Todo rasgo de combate existe en catálogo.

## 22. Roadmap de implementación

### Fase A: Núcleo básico
- Comandos mirar, examinar, buscar.
- Salas con objetos visibles.
- Salidas claras.
- RoomRenderer simple.
- 10 salas de Villaclara.

### Fase B: Interacciones y pistas
- leer, escuchar, oler, tocar, usar.
- Clues integradas con Crónica.
- Objetos interactivos.
- Pistas de Pex, Otilia y Pozo.

### Fase C: Descripciones condicionales
- Hora del día.
- Quest activa/completada.
- Reputación.
- Clase/origen.

### Fase D: Secretos y herramientas
- Secretos por búsqueda.
- Herramientas: vela, tiza, cuerda, pan duro.
- Atajos.

### Fase E: Integración con combate y dungeons
- Rasgos de entorno.
- Sótano de Masa Viva.
- Reloj de dungeon.
- Interacciones precombate.

### Fase F: Pulido de hub vivo
- Mensajes ambientales.
- NPCs con rutinas.
- Eventos de feria.
- Cambios persistentes.

## 23. Riesgos y soluciones

Riesgo: demasiados comandos confunden.
Solución: mirar y examinar deben bastar para la mayoría. Comandos sensoriales añaden profundidad, no obligación.

Riesgo: texto demasiado largo.
Solución: descripciones base breves, detalles bajo examinar. Capas, no ladrillos.

Riesgo: el jugador no sabe qué hacer.
Solución: salidas claras, objetos visibles, indicadores de quest, comando orientarse y Crónica.

Riesgo: secretos injustos.
Solución: pistas críticas redundantes, fallos útiles, alternativas por clase/herramienta.

Riesgo: demasiadas variantes complican datos.
Solución: empezar con condiciones simples: hora, quest, reputación. Añadir clase/clima después.

Riesgo: mundo estático.
Solución: flags de sala y pequeños cambios visibles tras quests.

Riesgo: explorar sea irrelevante frente a combate.
Solución: ventajas precombate, pistas, XP por descubrimiento, rutas alternativas y recompensas de Crónica.

## 24. Recomendación de fase 1 para Villaclara

Implementar primero estas salas:
1. Plaza del Alba Chica.
2. Calle del Pan Caliente.
3. Panadería Panbendito.
4. Posada del Segundo Gallo.
5. Alto de la Campana.
6. Ayuntamiento.
7. Archivo Municipal.
8. Capilla del Sol Quieto.
9. Lavadero del Arroyo Brillacepa.
10. Campo Norte.
11. Pozo Cantante.
12. Entrada del Sótano de Masa Viva.
13. Primera sala del Sótano.
14. Corral de los Oficios.
15. Herrería Buenclavo.

Objetivo fase 1:
Que el jugador pueda llegar, mirar, orientarse, leer tablón, hablar con NPCs, seguir pistas, buscar secretos, entrar al primer dungeon y ver cómo las salas cambian tras resolver Pex, Otilia y el primer canto del Pozo.

## 25. Cierre

La exploración de InheronMUD debe hacer que el jugador sienta que el mundo responde. Una plaza debe tener rumores. Una panadería debe tener olor, secretos y riesgo de masa con iniciativa. Un archivo debe poder mentir. Un pozo debe cantar solo cuando la noche afila el oído. Una sala no debe ser un casillero: debe ser una pequeña escena esperando el verbo correcto.

Cuando este sistema funcione, Villaclara dejará de ser un mapa inicial y se convertirá en un lugar habitable: un sitio donde mirar importa, escuchar cambia quests, oler salva vidas, tocar cosas puede ser mala idea, y examinar una cuchara robada puede abrir la primera puerta hacia una conspiración de memoria sagrada.

FIN DEL DOCUMENTO DE EXPLORACIÓN TEXTUAL Y SALAS INTERACTIVAS
