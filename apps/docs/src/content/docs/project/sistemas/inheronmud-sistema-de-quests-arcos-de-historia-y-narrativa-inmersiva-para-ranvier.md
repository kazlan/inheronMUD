---
title: "INHERONMUD — SISTEMA DE QUESTS Y ARCOS DE HISTORIA"
---

# INHERONMUD — SISTEMA DE QUESTS Y ARCOS DE HISTORIA
## Diseño detallado para ampliar Ranvier con narrativa inmersiva, progresión guiada y arcos jugables

Documento de diseño mecánico y narrativo. Objetivo: definir un sistema de quests para InheronMUD que vaya más allá del encargo clásico de MUD. Queremos que el jugador no solo “complete tareas”, sino que se sumerja en arcos de historia con estructura, memoria, decisiones, consecuencias, escenas, NPCs persistentes, cambios de mundo y una interfaz textual que le oriente sin convertir la aventura en una lista de la compra con espada.

Stack previsto: Ranvier / Node.js.
Región inicial de referencia: Villaclara, Altherion.
Tono: fantasía isekai luminosa, gremios, rumores, tablones, crónicas vivas, humor diegético, reliquias inquietas y conspiración de memoria.

## 1. Principios de diseño

### 1.1 Del “recado” al arco
Una quest aislada puede ser divertida, pero InheronMUD debe apoyarse en arcos de historia. Un arco es una secuencia de quests conectadas que desarrolla un conflicto, introduce NPCs, cambia la relación del jugador con una zona y deja consecuencias visibles.

Ejemplo:
No es solo “mata conejos”. Es:
- Los conejos acorazados bloquean el Campo Norte.
- Uno lleva metal aureano.
- El metal apunta a una calzada enterrada.
- La calzada conecta con la panadería y el Pozo Cantante.
- La Cámara intenta borrar el registro de quien descubra la ruta.

La primera quest enseña combate. El arco enseña que Villaclara tiene memoria bajo la tierra.

### 1.2 El jugador debe saber qué hacer sin perder misterio
El sistema debe dirigir acciones con claridad:
- Qué objetivo inmediato tiene.
- Dónde ir.
- Con quién hablar.
- Qué pista ha encontrado.
- Qué decisión está pendiente.

Pero sin quitar sabor:
- Los objetivos pueden escribirse como indicaciones diegéticas.
- El diario puede estar narrado como crónica.
- Las pistas pueden tener interpretación.
- El mapa puede marcar “posibles lugares” en vez de flecha mágica universal.

Ejemplo malo:
“Ve a X: 34, Y: 12 y mata 5 slimes”.

Ejemplo Inheron:
“Doña Marga cree que Pex lleva las cucharas hacia el sótano. El rastro de gel cruza la Calle del Pan Caliente y desaparece junto a la trampilla del horno viejo”.

### 1.3 La historia debe reaccionar
Las quests deben dejar huella:
- NPCs cambian diálogos.
- Tiendas alteran precios.
- El tablón actualiza rumores.
- El entorno cambia descripción.
- Aparecen o desaparecen enemigos.
- Una facción sube o baja reputación.
- El diario registra decisiones.

No todo debe ser enorme. A veces basta con que Otilia salude al jugador como “la persona que me devolvió a los papeles”. Eso vale oro narrativo y cuesta poco técnico.

### 1.4 El sistema debe soportar resolución múltiple
Una quest debe poder resolverse por combate, social, sigilo, investigación, crafting, reputación, clase o combinación.

Ejemplo: Otilia no existe.
- Bardo: componer canción que fija memoria.
- Clérigo: Sello de Verdad sobre el registro.
- Inspector: Formulario 13-B para invalidar acta falsa.
- Invocado: detectar contradicción con lógica externa.
- Cartógrafo: seguir ruta de tinta blanca.
- Combate: derrotar Tinta Blanca Animada.

### 1.5 Los arcos deben tener estructura de temporada
Cada arco importante debe tener:
- Premisa clara.
- Número concreto de quests.
- NPCs centrales.
- Antagonista o tensión.
- Punto medio con revelación.
- Decisión o clímax.
- Consecuencias.
- Epílogo local.

El jugador debe poder consultar su “Crónica” para recordar dónde está en la historia.

### 1.6 Humor integrado, no parodia
Las quests pueden tener nombres como “Pex y las cucharas desaparecidas” o “Inspección pedagógicamente contundente”, pero deben aportar mundo, mecánica o personaje. El humor funciona mejor cuando la consecuencia es real.

Si la panadería arde, Doña Marga sube precios. Eso sí enseña respeto.

## 2. Tipos de contenido narrativo

### 2.1 Arco de historia
Unidad narrativa mayor. Contiene varias quests. Tiene progresión, capítulos, fases, estados, escenas y consecuencias.

Ejemplo:
Arco: El Pozo que Tarareaba Demasiado.
Quests: 8.
Zona: Villaclara.
Nivel sugerido: 1-20.
Tema: memoria, Cáliz de Mediodía, Cámara del Mediodía, defensa del hogar.

### 2.2 Quest
Unidad jugable individual con objetivos, pasos, diálogos, recompensas y estado de progreso.

Ejemplo:
Quest: Otilia no existe.
Objetivo general: demostrar que Otilia Cuerda existe legalmente antes de que su casa sea reclamada por un noble muerto.

### 2.3 Paso de quest
Objetivo concreto dentro de una quest.

Ejemplos:
- Habla con Otilia en la Plaza del Alba Chica.
- Revisa el registro municipal.
- Pregunta a tres vecinos que la recuerden.
- Encuentra la tinta blanca en el archivo.
- Decide cómo anclar su nombre.

### 2.4 Pista
Fragmento de información que puede desbloquear objetivos, diálogos o rutas alternativas. Las pistas son esenciales para investigación.

Ejemplos:
- “La tinta blanca no proyecta sombra”.
- “La firma del acta falsa pertenece a un noble muerto hace siglos”.
- “Fennel cantó el nombre de Otilia la noche en que desapareció del registro”.

### 2.5 Escena
Momento narrativo controlado. Puede ser breve y textual, con participación del jugador o puramente descriptivo. Sirve para arranques, revelaciones y finales.

Ejemplo:
“El pozo canta por primera vez el nombre del jugador”.

### 2.6 Evento dinámico
Contenido que puede aparecer según estado del mundo, hora, reputación o progreso.

Ejemplos:
- Slime dorado avistado.
- Contrato falso en tablón.
- Feria de Cosecha Clara.
- Repique de nombres.

### 2.7 Tarea repetible
Quest ligera y repetible con variaciones. Útil para reputación y economía, pero debe tener sabor.

Ejemplo:
“Ingredientes para el Caldero Feliz”: hoy Nana quiere gel de slime; mañana, huevo de pollo elemental; pasado, una seta que insulta en eldáryn.

### 2.8 Contrato de gremio
Quest formal del Gremio de Aventureros. Tiene rango, paga, dificultad, emisor y condiciones.

Ejemplo:
Contrato Cobre: Conejos con casco.

### 2.9 Rumor accionable
Texto de taberna o pueblo que puede convertirse en quest si el jugador investiga.

Ejemplo:
“Dicen que el pozo cantó una nana que nadie conocía y tres abuelas lloraron”.

## 3. Estructura jerárquica del sistema

Propuesta:
- Campaign: gran campaña global o temporada.
- StoryArc: arco regional o temático.
- Quest: misión individual.
- Step: paso de quest.
- Objective: condición concreta medible.
- Clue: pista descubierta.
- Scene: escena narrativa.
- Consequence: efecto persistente.

Ejemplo:
Campaign: El Canon del Mediodía.
StoryArc: El Pozo que Tarareaba Demasiado.
Quest 1: Registro de Rango Cobre.
Quest 2: Pex y las cucharas desaparecidas.
Quest 3: Conejos con casco.
Quest 4: El pozo canta en do menor.
Quest 5: Otilia no existe.
Quest 6: Inspección pedagógicamente contundente.
Quest 7: El escriba amable.
Quest 8: Mapa de Mediodía.

## 4. Estados de quest

### 4.1 Estados básicos
Locked:
No visible o no disponible.

Available:
Disponible para aceptar o iniciar.

Discovered:
El jugador conoce el rumor o pista, pero aún no aceptó formalmente.

Active:
En progreso.

ReadyToTurnIn:
Objetivo cumplido, falta entregar o cerrar escena.

Completed:
Completada.

Failed:
Fallida por condición explícita.

Abandoned:
Abandonada por jugador.

Paused:
Temporalmente detenida por horario, reputación, fase de arco o evento.

HiddenCompleted:
Completada de forma encubierta sin que el jugador supiera que era quest. Útil para descubrimientos orgánicos.

### 4.2 Estados narrativos adicionales
BranchLocked:
Una ruta de resolución queda bloqueada por decisión previa.

Consequenced:
La quest terminó y sus efectos de mundo están aplicados.

Remembered:
Estado especial para quests de memoria: el resultado queda anclado en Crónica Viva.

Contested:
Una facción está intentando revertir o corromper el resultado.

Example:
Otilia no existe puede pasar a Completed, pero luego a Contested si la Cámara intenta borrar otra acta.

## 5. Componentes de una quest

Toda quest importante debería tener:

ID único:
Ejemplo: villaclara_otilia_no_existe.

Título visible:
Otilia no existe.

Subtítulo opcional:
Una anciana, un archivo imposible y un bastón muy convincente.

Resumen corto:
Otilia Cuerda ha desaparecido de los registros municipales, aunque todo el pueblo la recuerda.

Descripción inicial:
Texto inmersivo cuando se acepta o descubre.

Arco asociado:
El Pozo que Tarareaba Demasiado.

Capítulo del arco:
Capítulo 4: Documentos que muerden.

Nivel sugerido:
7-10.

Rango de gremio sugerido:
Cobre alto / Hierro inicial.

NPC inicial:
Otilia Cuerda.

NPCs implicados:
Silo, Hermana Lúa, Fennel, Varo, Tías del Mantel Blanco.

Ubicaciones:
Ayuntamiento, archivo, plaza, capilla, posada.

Objetivos:
Lista de pasos.

Pistas:
Lista de pistas posibles.

Resoluciones:
Múltiples finales.

Recompensas:
XP, reputación, soles, item, skill, desbloqueo.

Consecuencias:
Cambios en mundo, diálogos, facciones.

Flags:
Variables persistentes.

Repetible:
No, salvo tareas.

Tiempo límite:
Opcional.

Fallos posibles:
Opcional y controlado.

## 6. Diario del jugador: la Crónica Viva

### 6.1 Concepto
El diario de quests no debe llamarse simplemente “quest log”. En InheronMUD será la Crónica Viva: un registro de aventuras, pistas, nombres, promesas y consecuencias.

La Crónica Viva debe mostrar:
- Arcos activos.
- Quests activas.
- Pasos actuales.
- Pistas descubiertas.
- NPCs relevantes.
- Decisiones tomadas.
- Reputaciones afectadas.
- Próximo objetivo sugerido.

### 6.2 Vista por arcos
Comando sugerido:
cronica

Salida ejemplo:
Crónica Viva de Jorge
Campaña activa: El Canon del Mediodía
Arco activo: El Pozo que Tarareaba Demasiado
Progreso: 3/8 quests completadas
Tono del arco: misterio rural, memoria, reliquias solares

Quests activas:
1. Otilia no existe
   Paso actual: Revisa el registro municipal en el Alto de la Campana.
   Pistas: La tinta blanca no proyecta sombra. Fennel cantó el nombre de Otilia.

2. Pex y las cucharas desaparecidas
   Paso actual: Sigue el rastro de gel hasta la trampilla del horno viejo.

Sugerencia narrativa:
El pozo canta con más fuerza desde que Otilia perdió su nombre en los papeles.

### 6.3 Vista de una quest concreta
Comando:
quest Otilia

Salida:
Otilia no existe
Arco: El Pozo que Tarareaba Demasiado
Estado: Activa
Nivel sugerido: 7-10

Resumen:
Otilia Cuerda ha desaparecido de los registros. Todo Villaclara la recuerda, pero el archivo municipal insiste en que su casa pertenece a un noble muerto.

Paso actual:
Busca el acta de nacimiento de Otilia en el Archivo de Actas y Sellos.

Pistas descubiertas:
- La campana de San Orencio repicó su nombre a medianoche.
- Fennel recuerda haber cantado una copla sobre ella.
- La tinta blanca del registro no proyecta sombra.

Opciones posibles:
- Consultar a Hermana Lúa en la capilla.
- Pedir a Fennel que cante la copla.
- Examinar el archivo con una vela de Lúa.

### 6.4 Estilo de escritura de objetivos
Los objetivos deben ser claros, pero narrativos.

Malo:
“0/3 vecinos interrogados”.

Bueno:
“Habla con tres vecinos que recuerden a Otilia. Las Tías del Mantel Blanco suelen reunirse en el lavadero al mediodía”.

También se puede mostrar contador cuando sea necesario:
“Testimonios reunidos: 1/3”.

## 7. Arcos de historia

### 7.1 Definición técnica
Un arco de historia es un contenedor de quests con:
- ID.
- Título.
- Descripción.
- Nivel recomendado.
- Región.
- Quests ordenadas.
- Quests opcionales.
- Requisitos de avance.
- Estado global del arco.
- Variables persistentes.
- Escenas de inicio, punto medio y final.
- Consecuencias.

### 7.2 Estados de arco
Locked:
Aún no descubierto.

Foreshadowed:
El jugador ha visto pistas o rumores, pero no inició el arco.

Active:
Arco en progreso.

AtTurningPoint:
Punto medio, revelación o decisión.

FinaleReady:
El clímax está disponible.

Completed:
Arco completado.

Aftermath:
Epílogo y consecuencias activas.

Corrupted:
El arco fue afectado por una facción enemiga o por decisiones fallidas.

### 7.3 Estructura recomendada de arco
Arcos pequeños: 3-4 quests.
Arcos medios: 5-8 quests.
Arcos grandes regionales: 8-12 quests.
Arcos de temporada: 12-20 quests, divididos en actos.

Para Villaclara, proponemos un arco medio-grande de 8 quests.

### 7.4 Arco modelo: El Pozo que Tarareaba Demasiado

Arco: El Pozo que Tarareaba Demasiado.
Región: Villaclara.
Nivel: 1-20.
Campaña: El Canon del Mediodía.
Tema: memoria, pueblo, Cáliz de Mediodía, Cámara, primer hogar.

Quest 1: Registro de Rango Cobre.
Función: tutorial de hub, gremio, Crónica Viva.
Revelación: el nombre del jugador parpadea en blanco.

Quest 2: Pex y las cucharas desaparecidas.
Función: tutorial de rastreo, interacción y panadería.
Revelación: el sótano respira.

Quest 3: Conejos con casco.
Función: tutorial de combate, bestiario y Campo Norte.
Revelación: fragmento aureano bajo el casco.

Quest 4: El pozo canta en do menor.
Función: introduce misterio principal.
Revelación: el pozo muestra un mapa antiguo.

Quest 5: Otilia no existe.
Función: investigación social y memoria.
Revelación: tinta blanca, primer rastro de Cámara.

Quest 6: Inspección pedagógicamente contundente.
Función: dungeon tutorial, entorno y Mazmorras Cívicas.
Revelación: el Sótano de Masa Viva reacciona al Cáliz.

Quest 7: El escriba amable.
Función: antagonista humano, elecciones morales, documentos falsos.
Revelación: Varo Nomenclaro es agente de la Cámara.

Quest 8: Mapa de Mediodía.
Función: finale de arco.
Revelación: Villaclara es el Primer Umbral del Canon.
Clímax: proteger el pueblo mediante canción, sello, archivo, combate, pacto o combinación.

Consecuencia del arco:
- Villaclara queda protegida parcialmente contra Borrón de Nombre.
- El Pozo Cantante se convierte en nodo de campaña.
- Se desbloquean rutas a Solazur, Candaluz, Verdanza y Luminara.
- Los NPCs reconocen al jugador como “nombre de Villaclara”.

## 8. Escenas narrativas

### 8.1 Tipos de escena
Intro:
Presenta quest o arco.

Revelación:
Entrega información clave.

Decisión:
Pide al jugador elegir.

Clímax:
Combate, ritual, juicio, persecución o escena mixta.

Epílogo:
Muestra consecuencias.

Ambiental:
Pequeño momento de vida.

### 8.2 Escenas interactivas
Deben permitir comandos o elecciones:
- responder [opción]
- jurar [texto]
- cantar [nombre]
- firmar / negarse
- tocar campana
- romper sello
- guardar silencio

Ejemplo:
Escena: Otilia ante el archivo.
Opciones:
1. Defender a Otilia con testigos.
2. Pedir revisión legal.
3. Acusar a Varo.
4. Cantar la copla de Fennel.
5. Usar Sello de Verdad.

### 8.3 Escenas no bloqueantes
En un MUD multiusuario, las escenas no deben secuestrar al jugador demasiado tiempo. Deben ser breves o permitir continuar.

Comando:
continuar
saltar escena, si ya vista.

Pero en primera experiencia, conviene mostrarlas completas.

### 8.4 Recuerdos como escenas repetibles
Algunas escenas pueden quedar guardadas como recuerdos en la Crónica.

Comando:
recordar Otilia

Salida:
“Recuerdas a Otilia golpeando el suelo con el bastón mientras el archivo negaba su nombre. Nadie en Villaclara volvió a mirar un acta igual”.

## 9. Pistas, investigación y deducción

### 9.1 Sistema de pistas
Las pistas deben ser objetos lógicos dentro del sistema, no solo texto.

Cada clue tiene:
- ID.
- Título.
- Descripción.
- Fuente.
- Quest/arco asociado.
- Si desbloquea pasos o diálogos.
- Si es opcional o necesaria.

Ejemplo:
clue_tinta_blanca_no_sombra
Título: La tinta blanca no proyecta sombra.
Fuente: Examinar registro con vela de Lúa.
Desbloquea: acusar a Varo, consultar a Hermana Lúa, usar Sello de Verdad.

### 9.2 Pistas redundantes
Para evitar bloqueo, toda pista crítica debe tener al menos dos fuentes.

Ejemplo:
La tinta blanca se descubre:
- Examinando el registro con vela de Lúa.
- Con Percepción alta.
- Preguntando a Bimba.
- Usando skill de Cartógrafo.

### 9.3 Deducción guiada
Cuando el jugador reúne pistas suficientes, la Crónica puede sugerir conexión.

Ejemplo:
“Has visto tinta blanca en el archivo y contratos falsos en el tablón. Ambos documentos carecen de sombra. Quizá no sean errores administrativos, sino la misma mano”.

### 9.4 Pistas falsas
Usar con moderación. Si hay pistas falsas, deben poder refutarse.

Ejemplo:
Un Purificador acusa a un forastero de alterar registros. Pistas posteriores muestran que la tinta blanca ya estaba allí antes de su llegada.

## 10. Decisiones y consecuencias

### 10.1 Tipos de decisiones
Morales:
Proteger forastero o entregarlo.

Tácticas:
Entrar por sótano o por pozo.

Sociales:
Apoyar a Silo, Doña Marga, Capilla o Gremio.

Faccionales:
Aceptar ayuda de Fundación del Alba Verdadera o rechazarla.

De resolución:
Combatir, negociar, cantar, sellar, investigar.

### 10.2 Consecuencias visibles
Cada decisión importante debería tener al menos una consecuencia visible:
- Diálogo cambiado.
- Reputación alterada.
- NPC presente/ausente.
- Tienda con descuento/sobrecoste.
- Rumor nuevo.
- Estado del entorno.
- Ruta desbloqueada/bloqueada.
- Quest alternativa.

### 10.3 Consecuencias sin castigo excesivo
No queremos que el jugador se sienta arruinado por elegir “mal”. Queremos caminos distintos.

Ejemplo:
Si acusa públicamente a Varo sin pruebas:
- Varo escapa.
- Silo se enfada por el escándalo.
- Hermana Lúa ofrece investigar discretamente.
- Se abre ruta alternativa: seguir a Varo fuera del pueblo.

### 10.4 Consecuencias de memoria
El sistema debe registrar nombres protegidos, borrados o en disputa.

Flags ejemplo:
- otilia_name_restored = true
- villaclara_name_anchor_strength = 2
- varo_exposed = false
- chamber_attention_villaclara = 3

## 11. Reputación integrada en quests

### 11.1 Reputaciones locales
- Villaclara.
- Gremio de Aventureros.
- Capilla del Sol Quieto.
- Caldero Feliz.
- Hermandad de la Segunda Página.
- Tías del Mantel Blanco.
- Mazmorras Cívicas.
- Fundación del Alba Verdadera.
- Cámara del Mediodía, oculta.

### 11.2 Reputación como requisito suave
Evitar bloquear demasiado. Mejor usar reputación para abrir alternativas.

Ejemplo:
Capilla alta:
Hermana Lúa te presta una vela de verdad.
Capilla baja:
Puedes conseguir otra en mercado, más cara, o robar una con consecuencias.

### 11.3 Reputación como memoria social
La reputación debe sentirse como lo que el pueblo recuerda del jugador.

Ejemplo:
Villaclara +20:
Los vecinos te saludan por nombre y te avisan de rumores.
Villaclara -10:
Los tenderos preguntan si esta vez vas a quemar otra bodega.

## 12. Tablón de misiones y contratos

### 12.1 Tablón como interfaz diegética
El tablón del Gremio no debe ser una lista plana. Debe mostrar contratos con rango, emisor, urgencia, tono y posible rareza.

Comando:
tablon

Salida:
Tablón de Villaclara — Contratos Cobre
1. Conejos con casco
   Emisor: Concejo de Villaclara
   Rango: Cobre
   Zona: Campo Norte
   Nota: Uno de ellos lleva algo parecido a un casco. Nadie está orgulloso de haber escrito esto.

2. Harina para Candaluz
   Emisor: Panadería Panbendito / Capilla
   Rango: Cobre
   Zona: Camino de Candaluz
   Nota: No dejar que los duendes firmen recibos.

3. Inspección de sótano
   Emisor: Mazmorras Cívicas
   Rango: Cobre alto
   Zona: Panadería Panbendito
   Nota: Casco recomendado. Optimismo opcional.

### 12.2 Contratos falsos
La Cámara y Purificadores pueden introducir contratos falsos.

Indicadores sutiles:
- Sello demasiado perfecto.
- Emisor ambiguo.
- Lenguaje rígido.
- Recompensa demasiado alta.
- Objetivo contra forasteros, sombríos o registros.

Ejemplo:
“Vigilar a forasteros de procedencia inestable”.

### 12.3 Contratos por rango
Cobre:
Tutorial, plagas, recados, escoltas cortas.

Hierro:
Mazmorras menores, bandidos, investigación peligrosa.

Plata:
Ruinas, facciones, elites, decisiones políticas.

Oro:
Amenazas regionales, reliquias, jefes mayores.

Alba:
Campaña principal, Cámara, Canon, Trono de Nadie.

Leyenda:
Contenido endgame y eventos continentales.

## 13. Sistema de guía inmersiva

### 13.1 Próximo paso sugerido
La Crónica debe mostrar siempre un paso recomendado, pero sin impedir exploración.

Ejemplo:
Próximo paso sugerido:
“El rastro de gel de Pex apunta a la Calle del Pan Caliente. Doña Marga no parece dispuesta a esperar mucho”.

### 13.2 Marcadores textuales por sala
Al entrar en una sala relacionada con quest, la descripción puede resaltar detalles.

Ejemplo:
La trampilla del horno viejo conserva una mancha de gel brillante. Pex evita mirarla con una intensidad sospechosa.

### 13.3 NPCs con recordatorios naturales
Si el jugador vuelve tras tiempo, los NPCs recuerdan.

Ejemplo:
Doña Marga dice: “Si has acabado de mirar nubes, mis cucharas siguen desaparecidas”.

### 13.4 Comando “pistas”
Muestra pistas disponibles de quests activas.

Comando:
pistas

Salida:
Pistas activas:
- Pex deja gel cerca del horno viejo.
- El pozo canta más fuerte después de medianoche.
- Otilia existe en la memoria de todos, pero no en papel.

### 13.5 Comando “siguiente”
Para jugadores perdidos.

Salida:
Tu Crónica sugiere:
1. Ve al Archivo de Actas y Sellos para revisar el registro de Otilia.
2. Habla con Fennel en la Posada si quieres una ruta menos legalista.
3. Consulta a Hermana Lúa si sospechas magia solar.

## 14. Quests multietapa con objetivos variados

### 14.1 Tipos de objetivo
Hablar:
Conversar con NPC.

Obtener:
Conseguir objeto.

Entregar:
Llevar objeto o información.

Explorar:
Entrar en zona o descubrir sala.

Derrotar:
Vencer enemigo.

Sobrevivir:
Aguantar rondas o evento.

Proteger:
Mantener NPC/objeto vivo.

Investigar:
Reunir pistas.

Decidir:
Elegir entre rutas.

Crear:
Craftear objeto o comida.

Usar skill:
Aplicar habilidad concreta o equivalente.

Interactuar:
Tocar campana, sellar grieta, firmar acta, etc.

Reputación:
Alcanzar nivel de confianza.

Tiempo:
Esperar hora/día o actuar antes de límite.

### 14.2 Objetivos alternativos
Una quest puede tener varios objetivos equivalentes.

Ejemplo:
“Ancla el nombre de Otilia” puede completarse con:
- Canción de Fennel.
- Sello de Verdad.
- Tres testimonios + acta corregida.
- Derrotar Tinta Blanca.
- Usar Protección de Nombre Propio.

### 14.3 Objetivos ocultos
Opcionales que aumentan recompensa o consecuencia.

Ejemplo:
En “Pex y las cucharas desaparecidas”:
Objetivo oculto: no asustar a Pex.
Recompensa: Pex ayuda en la dungeon.

## 15. Ejemplos completos de quests

### 15.1 Quest completa: Pex y las cucharas desaparecidas

ID: villaclara_pex_cucharas.
Arco: El Pozo que Tarareaba Demasiado.
Capítulo: Problemas pequeños, raíces hondas.
Nivel: 1-4.
Inicio: Doña Marga Panbendito.
Tipo: investigación ligera, tutorial de rastreo, humor, acceso a dungeon.

Descripción inicial:
Doña Marga ha perdido doce cucharas, dos cucharones y la paciencia, aunque esta última ya venía tocada de antes. El principal sospechoso es Pex, slime semidomesticado de la panadería, que niega los hechos con una transparencia gelatinosa poco convincente.

Pasos:
1. Habla con Doña Marga en la Panadería Panbendito.
2. Examina el mostrador y encuentra restos de gel.
3. Sigue el rastro hasta la trampilla del horno viejo.
4. Decide cómo tratar a Pex: asustarlo, convencerlo, alimentarlo o seguirlo en silencio.
5. Baja al primer tramo del sótano.
6. Recupera al menos 6 cucharas.
7. Descubre la grieta de masa que respira.
8. Vuelve con Doña Marga.

Pistas:
- Pex evita mirar la trampilla.
- Las cucharas tienen restos de levadura viva.
- El sótano no coincide con el tamaño de la panadería.

Resoluciones:
Amable con Pex:
Pex se convierte en ayudante ocasional.

Agresiva:
Pex se esconde durante varias quests y Doña Marga regaña al jugador.

Investigadora:
Se obtiene pista extra sobre la Masa Madre.

Recompensas:
- Pan de Alba Serena x2.
- 15 soles.
- Reputación con Doña Marga/Villaclara.
- Desbloqueo: Sótano de Masa Viva.

Consecuencias:
- Descripción de panadería cambia: “La trampilla ya no parece una simple trampilla”.
- Pex puede aparecer en eventos futuros.

### 15.2 Quest completa: Otilia no existe

ID: villaclara_otilia_no_existe.
Arco: El Pozo que Tarareaba Demasiado.
Capítulo: Documentos que muerden.
Nivel: 7-10.
Inicio: Otilia Cuerda o Silo Brincacepa.
Tipo: investigación social, memoria, Cámara.

Descripción inicial:
Otilia Cuerda ha vivido ochenta y dos años en Villaclara. Ha ganado discusiones, partidas de dominó y al menos una pelea con una gárgola usando un paraguas. Sin embargo, el archivo municipal insiste en que nunca existió. Su casa aparece ahora a nombre de Lord Remiel Valdaran, muerto hace nueve siglos y con una educación inmobiliaria cuestionable.

Pasos base:
1. Escucha la denuncia de Otilia.
2. Revisa el registro municipal.
3. Reúne tres testimonios vecinales.
4. Examina la tinta blanca del acta.
5. Consulta a Hermana Lúa, Fennel o Mirta.
6. Enfrenta la anomalía del archivo.
7. Ancla el nombre de Otilia.
8. Decide si acusas públicamente a Varo o investigas en secreto.

Rutas:
Ruta legal:
Reunir pruebas, invalidar acta falsa.

Ruta religiosa:
Sello de Verdad y campana de San Orencio.

Ruta barda:
Canción de Nombre Propio.

Ruta combativa:
Derrotar Tinta Blanca Animada.

Ruta astuta:
Hacer que Varo corrija su propia acta mediante trampa legal.

Recompensas:
- Protección de Nombre Propio menor.
- Reputación con Villaclara y Tías del Mantel Blanco.
- Acceso a secretos del archivo.
- Pista: Canon del Mediodía.

Consecuencias:
- Otilia saluda al jugador por nombre.
- Las Tías del Mantel Blanco abren red de rumores.
- La Cámara aumenta atención sobre Villaclara.

### 15.3 Quest completa: El escriba amable

ID: villaclara_escriba_amable.
Arco: El Pozo que Tarareaba Demasiado.
Capítulo: Documentos que muerden.
Nivel: 11-15.
Inicio: Varo Nomenclaro o Dama Celiane por carta.
Tipo: intriga, confrontación, decisión.

Descripción inicial:
Varo Nomenclaro ofrece ayuda para ordenar actas viejas tras el incidente de Otilia. Su voz es amable, su caligrafía impecable y su sombra tarda una fracción demasiado larga en seguirle. Nada sospechoso, salvo todo.

Pasos:
1. Acepta o rechaza ayudar a Varo.
2. Revisa tres actas antiguas.
3. Detecta contradicciones.
4. Decide si firmas como testigo.
5. Si firmas, sufres Juramento Falso menor y debes romperlo.
6. Si no firmas, Varo intenta borrar un nombre secundario.
7. Confronta a Varo en archivo, capilla o callejón.
8. Recupera folio sellado.

Resoluciones:
Exponer públicamente:
Varo huye, pero el pueblo ve la amenaza.

Capturar:
Difícil, requiere preparación o ayuda.

Engañar:
Se obtiene más información sobre la Cámara.

Fallida parcial:
Varo escapa y borra un registro menor.

Recompensas:
- Tinta blanca sellada.
- Reputación con Capilla/Gremio.
- Desbloqueo de Dama Celiane como contacto.

## 16. Quests de clase y trasfondo

### 16.1 Quests por clase
Cada clase debería tener miniquests en Villaclara para enseñar identidad.

Caballero:
Mantener la línea durante un ataque de conejos mientras campesinos evacúan.

Clérigo:
Bendecir la campana de San Orencio y descubrir nombres olvidados.

Bardo:
Ayudar a Fennel a cantar la Copla de Otilia.

Cocinero:
Preparar receta con gel de slime y harina lunar sin crear otro pudin legalmente problemático.

Cartógrafo:
Dibujar mapa del sótano móvil que cambia de forma.

Inspector:
Clasificar correctamente una sala que intenta parecer despensa.

Invocado:
Ayudar a otro forastero a adaptarse y reconocer una skill resonante.

Monje:
Escoltar harina a Candaluz sin responder a provocaciones de duendes.

Duelista:
Resolver un duelo de plaza sin herir al rival ni el orgullo del alcalde.

### 16.2 Quests de trasfondo
Forastero planar:
Encontrar un objeto que llegó contigo y decidir si conservarlo, entregarlo o usarlo como foco resonante.

Local de Villaclara:
Proteger a alguien de tu familia durante Feria de Cosecha.

Exmiliciano:
Reactivar campanillas de defensa del pueblo.

Aprendiz de gremio:
Investigar contrato falso sin manchar reputación del Gremio.

Sombrío:
Enfrentar prejuicio de Purificadores y demostrar inocencia en una falsa acusación.

## 17. Quests repetibles con variación

Las repetibles deben variar objetivos, texto, enemigos o condiciones.

### Ingredientes para el Caldero Feliz
Variantes:
- Gel de slime de mermelada.
- Harina lunar.
- Huevo de pollo elemental.
- Seta saltarina.
- Vellón de oveja cumulonimbo.

Modificadores:
- Ingrediente fresco.
- Ingrediente intacto.
- Captura no letal.
- Entrega urgente.

### Patrulla de Campo Norte
Variantes:
- Conejos.
- Espantapájaros.
- Huellas de topo.
- Bandido perdido.

### Rumores de taberna
Pequeñas investigaciones generadas por pool:
- objeto perdido.
- visitante raro.
- canción nueva del pozo.
- mapa sospechoso.

### Archivo de Monstruos
Recompensas por:
- Observar habilidad nueva.
- Encontrar debilidad.
- Capturar muestra.
- Derrotar variante rara.

## 18. Eventos y calendario narrativo

### 18.1 Tiempo del mundo
Quests pueden depender de:
- Hora del día.
- Día de feria.
- Fase de arco.
- Progreso comunitario.

Ejemplos:
- El Pozo Cantante solo canta de noche.
- Las Tías se reúnen al mediodía en el lavadero.
- Pex roba cucharas al amanecer.
- Varo trabaja en archivos de noche.

### 18.2 Eventos por progreso
Al completar quests, se desbloquean eventos:
- Tras Pex: Panadería en crisis.
- Tras Otilia: Repique de nombres.
- Tras Varo: Contratos falsos aumentan.
- Tras Guardián: Feria de agradecimiento.

### 18.3 Eventos fallidos o ignorados
Si el jugador ignora una quest crítica, puede cambiar el estado pero no bloquear campaña.

Ejemplo:
Si no ayuda a Otilia:
- Otilia no pierde existencia permanente, pero su casa queda Contested.
- La quest se convierte en recuperación posterior con más dificultad.

## 19. Interfaz textual y comandos

### 19.1 Comandos principales
cronica:
Muestra arcos y quests activos.

quest:
Lista quests activas.

quest [nombre]:
Detalle de una quest.

arcos:
Lista arcos descubiertos.

arco [nombre]:
Detalle de arco.

pistas:
Lista pistas activas.

siguiente:
Sugerencia de próximo paso.

tablon:
Contratos disponibles en zona.

aceptar [quest/contrato]:
Acepta quest.

abandonar [quest]:
Abandona si permitido.

recordar [evento/npc]:
Muestra recuerdo desbloqueado.

reputacion:
Muestra reputaciones relevantes.

### 19.2 Notificaciones de progreso
Al avanzar:
[Crónica actualizada] Otilia no existe: has descubierto que la tinta blanca no proyecta sombra.

Al completar objetivo:
[Objetivo cumplido] Testimonios reunidos: 3/3.

Al desbloquear ruta:
[Nueva posibilidad] Fennel cree que una canción puede anclar el nombre de Otilia.

Al cambiar consecuencia:
[Villaclara recuerda] Las Tías del Mantel Blanco confían más en ti.

### 19.3 Resúmenes al reconectar
Cuando el jugador entra tras tiempo:
Tu Crónica te recuerda:
- El pozo canta de noche.
- Otilia espera en el Ayuntamiento.
- Doña Marga sigue sin perdonar el incidente del saco quemado.

## 20. Implementación técnica en Ranvier

### 20.1 Bundle recomendado
Crear bundle:
- inheron-quests

Subcarpetas:
- commands/quest/
- data/arcs/
- data/quests/
- data/clues/
- data/scenes/
- data/dialogues/
- scripts/objectives/
- scripts/consequences/
- lib/QuestManager.js
- lib/ArcManager.js
- lib/ClueManager.js
- lib/ChronicleRenderer.js
- lib/QuestEvents.js

### 20.2 Managers principales
QuestManager:
Carga quests, actualiza estados, evalúa objetivos, entrega recompensas.

ArcManager:
Controla progreso de arcos, capítulos, desbloqueos, escenas mayores.

ClueManager:
Registra pistas y desbloquea diálogos/objetivos.

ChronicleRenderer:
Genera salidas textuales de Crónica Viva.

ConsequenceManager:
Aplica flags persistentes, cambios de sala, NPC, tienda, reputación.

DialogueGate:
Permite diálogos según quest, pista, reputación o clase.

QuestEventBus:
Recibe eventos del mundo:
- npcKilled
- itemPicked
- roomEntered
- enemyDefeated
- dialogueSelected
- clueFound
- reputationChanged
- timeChanged
- combatEnded

### 20.3 Datos declarativos
Usar YAML o JSON para definir quests y arcos.

Ejemplo de arco:
```yaml
id: arco_pozo_tarareaba
name: El Pozo que Tarareaba Demasiado
campaign: canon_del_mediodia
region: villaclara
levelRange: [1, 20]
state: locked
quests:
  required:
    - villaclara_registro_cobre
    - villaclara_pex_cucharas
    - villaclara_conejos_casco
    - villaclara_pozo_do_menor
    - villaclara_otilia_no_existe
    - villaclara_inspeccion_sotano
    - villaclara_escriba_amable
    - villaclara_mapa_mediodia
  optional:
    - villaclara_slime_dorado
    - villaclara_cancion_fennel
turningPointQuest: villaclara_otilia_no_existe
finaleQuest: villaclara_mapa_mediodia
consequences:
  onComplete:
    - setFlag: villaclara_name_anchor_strength
      value: 2
    - unlockRoute: solazur
    - unlockRoute: candaluz
```

Ejemplo de quest:
```yaml
id: villaclara_otilia_no_existe
title: Otilia no existe
subtitle: Una anciana, un archivo imposible y un bastón muy convincente
arc: arco_pozo_tarareaba
levelRange: [7, 10]
start:
  npc: otilia_cuerda
  dialogue: start_otilia_no_existe
states:
  initial: locked
requirements:
  any:
    - questCompleted: villaclara_pozo_do_menor
    - clueFound: clue_tinta_blanca
steps:
  - id: talk_otilia
    text: Escucha la denuncia de Otilia en el Ayuntamiento.
    objectives:
      - type: dialogue
        npc: otilia_cuerda
        topic: denuncia
  - id: gather_testimonies
    text: Reúne tres testimonios de vecinos que recuerden a Otilia.
    objectives:
      - type: counter
        event: testimony_otilia
        required: 3
  - id: examine_record
    text: Examina el registro municipal en busca de tinta blanca.
    objectives:
      - type: clue
        clue: clue_tinta_blanca_no_sombra
  - id: anchor_name
    text: Ancla el nombre de Otilia mediante ley, luz, canción o memoria.
    objectives:
      - type: any
        objectives:
          - type: useSkill
            skillTag: name_anchor
          - type: dialogue
            npc: fennel_liriochico
            topic: copla_otilia
          - type: combatDefeat
            enemy: tinta_blanca_animada
rewards:
  xp: 450
  currency: 30
  reputation:
    villaclara: 8
    tias_mantel_blanco: 10
  flags:
    otilia_name_restored: true
```

### 20.4 Objetivos como scripts reutilizables
Implementar tipos genéricos:
- DialogueObjective.
- KillObjective.
- CollectObjective.
- VisitRoomObjective.
- UseSkillObjective.
- DiscoverClueObjective.
- ReputationObjective.
- CounterObjective.
- ChoiceObjective.
- TimedObjective.
- ProtectObjective.
- CraftObjective.
- InteractObjective.

Cada objetivo debe escuchar eventos y actualizar progreso.

### 20.5 Flags persistentes
Guardar en PlayerState:
- quest states.
- quest step progress.
- arc states.
- clues found.
- decisions.
- reputations.
- personal flags.

Guardar en WorldState o AreaState:
- consecuencias comunitarias.
- estado de NPCs.
- estado de rutas.
- eventos globales.

Para fase 1, si no hay persistencia global robusta, se puede simular consecuencias por jugador/party. Más adelante, eventos globales.

## 21. Diálogos integrados con quests

### 21.1 Diálogo contextual
NPCs deben cambiar opciones según:
- Quest activa.
- Paso actual.
- Pistas.
- Reputación.
- Clase.
- Decisiones.

Ejemplo:
Hermana Lúa:
Si clue_tinta_blanca_no_sombra:
“Eso no es tinta común. La luz no la reconoce, y eso me preocupa más de lo que voy a admitir delante del alcalde”.

Si jugador es Clérigo:
“Puedes ayudarme con un Sello de Verdad, si tu Devoción aguanta el tirón”.

Si jugador es Bardo:
“Quizá Fennel no esté tan loco. Una canción bien atada puede sujetar un nombre mejor que un acta”.

### 21.2 Temas de diálogo
Comando:
hablar lúa
preguntar lúa tinta blanca
preguntar lúa otilia

O menú numerado opcional.

### 21.3 Diálogo como objetivo
Hablar no debe ser relleno. Un diálogo puede:
- Dar pista.
- Activar escena.
- Cambiar reputación.
- Desbloquear ruta.
- Iniciar combate.
- Ofrecer elección.

## 22. Quests y combate

### 22.1 Combate dentro de quest
El sistema debe saber si un combate pertenece a quest.

Ejemplo:
Al derrotar Masa Madre Menor:
- Actualiza quest de panadería.
- Marca clue: masa_reacciona_caliz.
- Cambia descripción del sótano.

### 22.2 Objetivos de combate no letales
Tipos:
- Sobrevivir 5 rondas.
- Proteger NPC.
- Interrumpir ritual.
- Capturar criatura.
- Derrotar sin fuego.
- Hacer que enemigo huya.
- Bajar vida a 30% y negociar.

### 22.3 Logs de quest durante combate
Ejemplo:
[Quest] El Guardián del Pozo escucha tu nombre. La Crónica vibra.

[Quest] Si alguien toca la campana antes de la próxima ronda, quizá rompa la Nota Vinculante.

## 23. Quests y entorno

### 23.1 Descripciones por estado
Una sala puede tener variantes según quest.

Plaza antes de Otilia:
“La plaza bulle con feria y olor a pan”.

Durante Otilia:
“Otilia golpea el suelo con el bastón junto al tablón, rodeada de vecinos incómodos”.

Después de resolver:
“Alguien ha colgado una pequeña cinta con el nombre de Otilia en el tablón. Nadie sabe quién fue, pero todos sonríen al verla”.

### 23.2 Objetos interactivos persistentes
- Tablón.
- Pozo.
- Registro.
- Campana.
- Trampilla.
- Mapa prohibido.

Cada uno puede cambiar acciones disponibles según quest.

## 24. Quests y objetos

### 24.1 Objetos de quest
Deben marcarse como:
- No vendible.
- No destruible accidentalmente.
- Compartible o individual.
- Se elimina al completar o queda como recuerdo.

Ejemplos:
- Cuchara mordida por Pex.
- Vela de Lúa.
- Acta falsa.
- Folio sellado.
- Mapa de Verdanza.

### 24.2 Objetos recuerdo
Algunas recompensas no son poder puro, sino memoria.

Ejemplo:
Cinta de Otilia:
Trinket cosmético. Mientras la lleves, +1 resistencia menor a Borrón de Nombre en Villaclara.

### 24.3 Objetos con pistas
Examinar objetos puede revelar clue.

Comando:
examinar acta

Resultado:
“La tinta blanca parece seca, pero se mueve cuando no la miras. No proyecta sombra sobre el margen”.

## 25. Party y quests compartidas

### 25.1 Progreso individual vs compartido
Progreso individual:
- Decisiones personales.
- Pistas vistas.
- Recompensas únicas.

Progreso compartido:
- Derrotar boss.
- Completar dungeon.
- Proteger NPC.
- Evento de mundo.

Recomendación fase 1:
Las quests son individuales, pero los eventos de combate/exploración pueden contar para todos los miembros elegibles de la party.

### 25.2 Sincronización de pasos
Si un jugador está en paso 3 y otro en paso 1, ambos pueden ayudar, pero solo progresa quien cumpla requisitos.

Comando:
party quests
Muestra compatibilidad.

### 25.3 Repetición de escenas
Para no obligar a repetir demasiado, permitir:
- Compartir escena si todos están en paso compatible.
- Saltar escena ya vista.
- Resumen para jugadores rezagados.

## 26. Fallos, abandono y recuperación

### 26.1 Fallar debe abrir historia, no cerrarla siempre
Fallos interesantes:
- NPC herido, no muerto.
- Villano escapa.
- Prueba perdida, se necesita otra ruta.
- Reputación dañada.
- Más enemigos en finale.

### 26.2 Abandonar quest
No todas se pueden abandonar. Las de campaña pueden pausarse, no borrarse.

### 26.3 Recuperación
Si el jugador vende/pierde objeto necesario, ofrecer ruta:
- Recomprar.
- Pedir copia.
- Buscar alternativa.
- Usar skill.

### 26.4 Quests con tiempo límite
Usar con cuidado. Deben avisar mucho.

Ejemplo:
“Varo trabajará en el archivo esta noche. Si no actúas antes del amanecer, puede alterar otro registro”.

Si se pierde:
- No bloquear campaña.
- Aumentar dificultad.

## 27. Integración con el tono isekai

### 27.1 Gremio y rangos como estructura visible
El jugador entiende qué es un contrato, un rango Cobre, una recompensa y un tablón. Eso da claridad.

### 27.2 Skills resonantes como rutas narrativas
Una skill puede abrir una solución rara.

Ejemplo:
Invocado usa “Comparar con Otro Mundo” para explicar a Silo que el acta falsa funciona como una suplantación de identidad burocrática. Silo no entiende el término, pero entiende el miedo.

### 27.3 Comida como quest design
Cocina no es solo buff. Puede ser pista, memoria, reputación, ritual.

Ejemplo:
Bollo de Memoria Tibia permite que un NPC recuerde un detalle olvidado durante una escena.

### 27.4 Humor de sistema
Mensajes de progreso con sabor:
[Objetivo cumplido] Has recuperado 6 cucharas. Pex parece ofendido por la solidez de las pruebas.

[Crónica actualizada] La panadería tiene sótano. El sótano tiene opiniones.

[Reputación] Doña Marga te considera útil. Todavía no prudente.

## 28. Diseño de recompensas

### 28.1 Tipos de recompensa
XP.
Moneda.
Reputación.
Items.
Consumibles.
Recetas.
Skills generales.
Desbloqueo de rutas.
Desbloqueo de diálogos.
Aliados.
Cambios de mundo.
Títulos locales.
Recuerdos en Crónica.

### 28.2 Recompensas narrativas
Ejemplos:
- Nombre de Villaclara: título local tras salvar el pozo.
- Amistad de Pex: Pex aparece en eventos.
- Favor de Doña Marga: comida gratis diaria menor.
- Copla de Otilia: resistencia a Borrón en la villa.

### 28.3 Recompensas por resolución alternativa
No penalizar no combatir.

Ejemplo:
Capturar slime dorado sin dañarlo da más reputación de bestiario que matarlo.

### 28.4 Recompensas de arco
Al terminar arco, entregar recompensa mayor:
- Título.
- Reputación local importante.
- Skill general.
- Ruta desbloqueada.
- Cambio persistente de hub.
- Escena de epílogo.

## 29. Contenido inicial recomendado para implementar

### Fase 1: Sistema mínimo
- QuestManager básico.
- Quest states.
- Steps lineales.
- Comando quest / cronica.
- Objetivos: hablar, matar, recoger, visitar.
- 3 quests: Registro Cobre, Conejos con casco, Pex y cucharas.

### Fase 2: Arcos y pistas
- ArcManager.
- ClueManager.
- Pistas desbloquean pasos.
- El Pozo que Tarareaba Demasiado como arco.

### Fase 3: Decisiones y consecuencias
- Flags.
- Reputación.
- Descripciones por estado.
- Otilia no existe.

### Fase 4: Escenas y rutas alternativas
- SceneManager simple.
- Objetivos alternativos.
- Skills como resoluciones.
- El escriba amable.

### Fase 5: Eventos dinámicos
- Tablón dinámico.
- Contratos falsos.
- Slime dorado.
- Repique de nombres.

### Fase 6: Pulido narrativo
- Recordar.
- Resúmenes al login.
- Epílogos.
- Consecuencias persistentes por zona.

## 30. Esquema técnico de eventos

Eventos que QuestManager debe escuchar:
- playerLogin.
- playerEnterRoom.
- playerTalkToNpc.
- playerSelectDialogue.
- playerAcceptQuest.
- playerCompleteQuest.
- playerFindClue.
- playerReceiveItem.
- playerUseItem.
- playerUseSkill.
- playerKillNpc.
- playerDefeatEnemy.
- combatEnd.
- playerCraftItem.
- reputationChanged.
- timeOfDayChanged.
- roomInteraction.
- choiceMade.

Cada objetivo define qué evento escucha y cómo evalúa.

Ejemplo:
DialogueObjective escucha playerSelectDialogue.
CollectObjective escucha playerReceiveItem.
ClueObjective escucha playerFindClue.
KillObjective escucha playerDefeatEnemy.
InteractObjective escucha roomInteraction.

## 31. Validación y herramientas para diseñadores

### 31.1 Comandos admin
questadmin start [quest] [player]
questadmin complete [quest] [player]
questadmin reset [quest] [player]
questadmin clue [clue] [player]
questadmin arc [arc] [state] [player]
questadmin flags [player]
questadmin reputation [player] [faction] [value]

### 31.2 Validación automática
Al cargar quests:
- IDs únicos.
- Todas las quests de arco existen.
- NPCs referenciados existen.
- Items referenciados existen.
- Steps tienen objetivos válidos.
- No hay pasos imposibles.
- Pistas críticas tienen fuente.

### 31.3 Modo debug de Crónica
Mostrar IDs y flags para desarrollo.

## 32. Riesgos y soluciones

Riesgo: demasiada guía mata exploración.
Solución: comandos “siguiente” y “pistas” opcionales; objetivos claros pero no flechas intrusivas.

Riesgo: demasiada narrativa cansa.
Solución: escenas breves, saltables si repetidas, resúmenes claros.

Riesgo: rutas alternativas complican implementación.
Solución: empezar con alternativa simple por tags de solución: combat, social, divine, bardic, technical.

Riesgo: quests se rompen por multiplayer.
Solución: progreso individual + eventos compartidos elegibles.

Riesgo: consecuencias globales difíciles.
Solución: fase 1 por jugador, fase 2 por área/instancia, fase 3 global controlada.

Riesgo: jugadores se pierden.
Solución: Crónica Viva, siguiente, pistas, NPCs con recordatorios.

Riesgo: contratos repetibles se vuelven farmeo plano.
Solución: variantes, humor, bestiario, reputación y objetivos opcionales.

## 33. Mini-glosario del sistema

Campaña: gran temporada narrativa.
Arco: conjunto de quests conectadas.
Quest: misión individual.
Paso: fase concreta de una quest.
Objetivo: condición medible.
Pista: información persistente que desbloquea avance.
Crónica Viva: diario narrativo del jugador.
Consecuencia: cambio de mundo o estado tras decisión.
Contrato: quest formal del Gremio.
Rumor accionable: pista ambiental que puede iniciar quest.
Nombre anclado: protección narrativa/mecánica contra olvido.
Contested: estado donde una facción intenta revertir una resolución.

## 34. Cierre de diseño

El sistema de quests de InheronMUD debe hacer que el jugador sienta que cada misión forma parte de una crónica mayor. No queremos una lista de recados con recompensas; queremos pequeños capítulos jugables. La primera cuchara robada por Pex, el primer conejo con casco, la primera vez que el pozo canta y el primer nombre borrado deben sentirse conectados.

Ranvier nos da una base sólida de MUD. Nuestra ampliación debe añadir capas: arcos, pistas, escenas, consecuencias, reputación, Crónica Viva y guía inmersiva. Con eso, Villaclara no será solo un hub inicial. Será el lugar donde el jugador aprenda el lenguaje de Inheron: ayudar, investigar, recordar, elegir y, cuando haga falta, golpear una masa madre con una sartén histórica.

FIN DEL DOCUMENTO DE SISTEMA DE QUESTS
