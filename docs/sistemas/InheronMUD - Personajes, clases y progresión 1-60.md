# INHERONMUD — PERSONAJES, CLASES Y PROGRESIÓN 1-60
## Diseño detallado para creación de personaje, progresión, clases, especializaciones y rangos de gremio

Documento de diseño sistémico. Objetivo: definir cómo se crea, progresa y diferencia un personaje de InheronMUD desde nivel 1 hasta nivel 60, integrando combate por turnos, quests/arcos de historia, reputación, rangos del Gremio, tono isekai diegético y el eje narrativo de nombres, memoria y Crónica Viva.

Stack previsto: Ranvier / Node.js.
Región inicial: Villaclara, Altherion.
Nivel máximo inicial previsto: 60.
Primer tramo implementable: niveles 1-20.

## 1. Principios de diseño

### 1.1 Identidad antes que hoja de cálculo
El jugador debe entender rápido quién es su personaje: de dónde viene, qué sabe hacer, qué papel cumple en combate y qué tipo de soluciones narrativas puede abrir. Las cifras importan, pero el corazón debe ser claro.

Un personaje de Inheron no es solo “guerrero nivel 12”. Es algo como:
- Bardo de Crónica Viva, forastero planar, protegido por Villaclara.
- Caballero del Alba, exmiliciano rural, juramentado con la Capilla del Sol Quieto.
- Cocinera de Mazmorra, aprendiz del Caldero Feliz, con Pex como cómplice viscoso.
- Cartógrafo Vivo, estudiante fallido de Solazur, obsesionado con mapas que cambian.

### 1.2 Clase fuerte, trasfondo relevante
La clase define el kit jugable. El origen y el trasfondo definen contexto, diálogos, pequeñas bonificaciones y rutas alternativas en quests.

Clase: qué haces.
Origen: de dónde vienes.
Trasfondo: qué eras antes del primer contrato.
Reputación: qué recuerda el mundo de ti.
Crónica: qué has hecho.

### 1.3 Progresión híbrida: vertical y horizontal
Subir de nivel debe dar poder, pero también herramientas nuevas.

Vertical:
- Más vida.
- Mejores atributos.
- Habilidades más fuertes.
- Acceso a mejores equipos.

Horizontal:
- Nuevas opciones sociales.
- Skills generales.
- Profesiones.
- Títulos.
- Relación con facciones.
- Soluciones alternativas a quests.

### 1.4 Sin builds trampa
Debe haber personalización, pero no laberintos donde el jugador se arruine el personaje por no leer una enciclopedia. Las elecciones importantes deben ser claras, reversibles parcialmente y temáticas.

Reentrenamiento recomendado:
- Habilidades activas: reentrenables con coste moderado.
- Talentos: reentrenables en ciudades/hubs con coste más alto.
- Especialización: reentrenable solo mediante quest o servicio raro.
- Origen/trasfondo: no reentrenable, salvo eventos narrativos muy concretos.

### 1.5 Cada clase debe jugar distinto
Desde nivel 1:
- Caballero protege.
- Monje encadena disciplina.
- Cocinero prepara y convierte loot en ventaja.
- Cartógrafo revela y controla mapa.
- Invocado improvisa.
- Clérigo sostiene y revela falsedad.
- Duelista responde con estilo.
- Inspector controla peligro con sellos.
- Bardo crea memoria y moral.

### 1.6 El nivel 60 debe sentirse mítico, no administrativo
Nivel 60 no significa “más daño y ya”. Significa que el personaje puede influir en arcos regionales, resistir fuerzas de memoria, liderar facciones, portar reliquias despiertas y participar en conflictos continentales como el Trono de Nadie.

## 2. Flujo de creación de personaje

### 2.1 Pasos de creación
1. Elegir nombre.
2. Elegir pueblo/raza.
3. Elegir origen.
4. Elegir trasfondo.
5. Elegir clase inicial.
6. Distribuir atributos iniciales o elegir arquetipo recomendado.
7. Elegir una habilidad general inicial.
8. Elegir vínculo inicial con Villaclara o Altherion.
9. Confirmar aspecto textual breve.
10. Escena de llegada.

### 2.2 Nombre del personaje
En Inheron, el nombre importa. Debe registrarse en el Gremio, en la Crónica y, narrativamente, funciona como ancla contra el Canon.

Reglas sugeridas:
- Nombre visible único.
- Apellido opcional.
- Apodo desbloqueable.
- Título mostrable por separado.

Ejemplo de presentación:
Jorge, Cobre de Villaclara.
Jorge Panjurado, Amigo de Pex.
Jorge, Nombre de Villaclara.

### 2.3 Aspecto textual
El jugador puede escoger o escribir una descripción breve.

Campos:
- Complexión.
- Rasgo distintivo.
- Prenda o símbolo.
- Expresión habitual.

Ejemplo:
“Un humano bajo y ancho de hombros, con capa azul gastada, ojos atentos y una libreta llena de mapas torcidos”.

## 3. Pueblos y razas jugables iniciales

Recomendación de fase 1: empezar con selección limitada pero rica. Más razas pueden añadirse como expansiones.

### 3.1 Humanos de Altherion
Descripción:
Habitantes del reino solar. Acostumbrados a gremios, capillas, academias y burocracia luminosa.

Bonificaciones:
- +1 Presencia o +1 Sabiduría.
- +5 reputación inicial con Altherion o Villaclara.
- Habilidad general inicial adicional entre Etiqueta de Palacio para Gente con Botas, Cultura Solar de Altherion o Saludar sin Parecer Bandido.

Rasgo racial:
Adaptabilidad Solar: una vez por descanso largo, reduce duración de un estado mental o social leve.

Ideal para:
Caballero, Clérigo, Bardo, Duelista, Inspector.

### 3.2 Humanos de Arvell
Descripción:
Gentes de llanura, granero, milicias y caminos. Prácticos, resistentes, buenos para detectar problemas antes de que tengan blasón.

Bonificaciones:
- +1 Constitución o +1 Percepción.
- +5 reputación inicial con pueblos rurales.
- Mejor recolección agrícola y supervivencia básica.

Rasgo racial:
Terquedad de Campana: al caer por debajo del 30% de vida, gana +1 Energía y resistencia menor a miedo durante 1 ronda. Cooldown largo.

Ideal para:
Caballero, Cocinero, Cartógrafo, Monje, Inspector.

### 3.3 Eldáryn de Hojaluna
Descripción:
Eldáryn de frontera entre Elenwyn y Altherion. Menos cerrados que los bosques profundos, pero igual de sensibles a pactos, nombres y promesas rotas.

Bonificaciones:
- +1 Destreza o +1 Sabiduría.
- Afinidad con Raíz y memoria natural.
- Mejor percepción en bosques y lugares feéricos.

Rasgo racial:
Oído de Hoja: detecta pistas naturales o feéricas con más facilidad; una vez por descanso, puede resistir Olvido Menor.

Ideal para:
Bardo, Cartógrafo, Monje, Clérigo, Duelista.

### 3.4 Duergrin de paso
Descripción:
Enanos de Hieloeterno o descendientes de comerciantes de Skarn. Duros, runistas, artesanos y capaces de guardar rencor con precisión archivística.

Bonificaciones:
- +1 Constitución o +1 Ingenio.
- Resistencia menor a frío y derribo.
- Mejor reparación y evaluación de metal.

Rasgo racial:
Hueso de Yunque: una vez por combate, reduce un golpe físico fuerte si está defendiendo o en vanguardia.

Ideal para:
Caballero, Inspector, Cocinero, Cartógrafo.

### 3.5 Drakonita joven
Descripción:
Descendientes de sangre dracónica menor, llegados de Drakonar o criados en enclaves altherianos. Orgullo de brasa, voz firme y tendencia a resolver problemas mirando fijamente hasta que se incendian socialmente.

Bonificaciones:
- +1 Fuerza o +1 Presencia.
- Resistencia menor a fuego.
- Intimidación mejorada.

Rasgo racial:
Chispa de Brasa: una vez por descanso corto, añade daño de Brasa menor a un ataque o aumenta Presencia en una escena de desafío.

Ideal para:
Caballero, Duelista, Bardo, Monje.

### 3.6 Saurio de Korash
Descripción:
Linajes reptilianos del desierto, astrónomos, supervivientes y guardianes de pozos. En Altherion suelen ser raros, respetados por unos y mirados demasiado por otros.

Bonificaciones:
- +1 Percepción o +1 Ingenio.
- Resistencia menor a calor y veneno.
- Mejor orientación nocturna.

Rasgo racial:
Lectura de Arena: puede detectar rastros, cambios de suelo o señales enterradas con ventaja menor una vez por escena.

Ideal para:
Cartógrafo, Inspector, Invocado, Cocinero.

### 3.7 Sombrío errante
Descripción:
Persona alterada por exposición a Sombral o descendiente de quienes sobrevivieron a las Grietas. No son malvados, pero cargan prejuicio y ecos extraños.

Bonificaciones:
- +1 Sabiduría o +1 Presencia.
- Resistencia menor a Sombra.
- Penalización social leve inicial con Purificadores y sectores rígidos.
- Bonificación con Umbraclaros y Hermandad de la Segunda Página.

Rasgo racial:
Eco de la Grieta: una vez por descanso largo, convierte un efecto de miedo/confusión en Recuerdo Despierto menor. Riesgo: pequeño Borrón si se abusa en zonas de Cámara.

Ideal para:
Bardo, Clérigo, Invocado, Cartógrafo.

### 3.8 Forastero planar
Descripción:
No es una raza biológica, sino una procedencia. Puede combinarse con apariencia humana u otra, según lore, pero en fase 1 conviene tratarlo como pueblo/origen especial. Llegó desde otro mundo, sueño o línea de posibilidad.

Bonificaciones:
- +1 Ingenio o +1 Presencia.
- Acceso inicial a una Skill Resonante Latente.
- Reputación inicial con Hermandad de la Segunda Página.
- Pequeña desventaja social con facciones puristas.

Rasgo racial/origen:
Lógica de Otro Mundo: una vez por descanso largo, puede repetir una tirada de improvisación, investigación o resistencia a memoria impuesta.

Ideal para:
Invocado Desubicado, Bardo, Cocinero, Cartógrafo, Inspector.

## 4. Orígenes iniciales

El origen define cómo llega el personaje a Villaclara y qué primeras conexiones tiene.

### 4.1 Local de Villaclara
Conoces calles, vecinos y pequeñas vergüenzas locales. Doña Marga quizá te vio crecer, lo cual da ventajas y munición emocional.

Bonificaciones:
- +10 reputación Villaclara.
- Conoces un rumor adicional.
- Descuento pequeño en Panbendito o Cesta Serena.

Inicio narrativo:
La Feria de Cosecha Clara no es novedad para ti, pero este año el pozo canta distinto.

### 4.2 Aprendiz del Gremio
Llegas con carta de recomendación, equipo básico y ganas de que el tablón no te humille.

Bonificaciones:
- Registro Cobre más rápido.
- +5 reputación Gremio de Aventureros.
- Conoces reglas básicas de contratos.

Inicio:
Tu primera tarea es presentarte en la oficina del Gremio.

### 4.3 Forastero de Procedencia Extravagante
Apareces cerca de Villaclara, quizá en la Pradera de los Cascabeles, con recuerdos incompletos y una lógica que no encaja del todo.

Bonificaciones:
- Skill Resonante Latente.
- Contacto con Sera Mimbrel.
- Ruta especial en quests de Hermandad.

Inicio:
Bimba te encuentra preguntando por cosas que no existen en Altherion.

### 4.4 Estudiante de Solazur
Vienes de la Academia Radiante por prácticas, castigo académico o exceso de entusiasmo.

Bonificaciones:
- +5 reputación Academia Radiante.
- Una habilidad general de conocimiento o etiqueta.
- Acceso temprano a quest de Torneo de Novatos.

Inicio:
Te enviaron a Villaclara para aprender “problemas reales”. La academia no avisó de la panadería.

### 4.5 Peregrino de Candaluz
Llegas por motivos espirituales, disciplina, sanación o penitencia. Conoces algo de la Capilla y del Camino de Candaluz.

Bonificaciones:
- +5 reputación Capilla del Sol Quieto.
- Resistencia menor a miedo durante la primera escena de pozo.
- Desbloquea diálogos con Hermana Lúa y Prior Oren.

Inicio:
La campana de San Orencio pronuncia un nombre que no conoces, pero reconoces.

### 4.6 Exmiliciano rural
Has defendido caminos, graneros o caravanas. No eres noble, pero sabes qué hacer cuando algo con dientes mira demasiado un campo.

Bonificaciones:
- +1 a defensa inicial o habilidad general Cubrir Retirada.
- +5 reputación Milicia/Concejo.
- Mejor reacción en ataques a pueblo.

Inicio:
Silo te pide ayudar a reorganizar la Milicia de Campana.

### 4.7 Buscavidas de camino
Llegas por trabajo, hambre, deuda o curiosidad. Tienes contactos dudosos y olfato para problemas rentables.

Bonificaciones:
- Mejor regateo inicial.
- Acceso a rumores de taberna.
- Puede detectar contratos falsos con más facilidad.

Inicio:
El Segundo Gallo te fía una noche. Eso ya es una quest moral.

### 4.8 Sombrío protegido
Has llegado a Villaclara buscando refugio, quizá ayudado por la Hermandad de la Segunda Página o por Hermana Lúa.

Bonificaciones:
- +5 Hermandad de la Segunda Página.
- +5 Capilla si se elige vía Lúa.
- Resistencia menor a Sombra.
- Atención aumentada de puristas.

Inicio:
Villaclara parece amable, pero no todos miran igual tus sombras.

## 5. Trasfondos

El trasfondo es una capa ligera de historia y mecánica. Da una habilidad general, una pequeña bonificación y rutas de diálogo.

### 5.1 Cocinillas de emergencia
Habilidad inicial: Cocinar Algo que No Mate.
Bonificación: mejora comida básica.
Ruta: Caldero Feliz, Doña Marga, Nana.

### 5.2 Aprendiz de escriba
Habilidad inicial: Leer Pergamino sin Invocar Hacienda.
Bonificación: detecta irregularidades documentales.
Ruta: Archivo, Cámara, Otilia.

### 5.3 Niño de campana
Habilidad inicial: Escuchar Música de Boss.
Bonificación: detecta señales sonoras, campanas, alarmas.
Ruta: Capilla, Pozo Cantante.

### 5.4 Mozo de cuadra
Habilidad inicial: Cuidar Mascota Heroica.
Bonificación: trato con bestias y monturas.
Ruta: conejos, ovejas cumulonimbo, mascotas.

### 5.5 Aficionado a mapas
Habilidad inicial: Dibujar Mapa Feo pero Útil.
Bonificación: menos probabilidad de perderse.
Ruta: Cartógrafo, mapas prohibidos.

### 5.6 Antiguo monaguillo
Habilidad inicial: Cultura Solar de Altherion.
Bonificación: diálogos con clérigos y capillas.
Ruta: Iglesia, reliquias.

### 5.7 Deudor simpático
Habilidad inicial: Regatear con Cara de Quest Secundaria.
Bonificación: mejores precios una vez por día.
Ruta: economía, taberna, favores.

### 5.8 Superviviente de rareza mágica
Habilidad inicial: Protección de Nombre Propio menor o Adaptación Rápida.
Bonificación: resistencia leve a estados extraños.
Ruta: forasteros, Cámara, Sombral.

## 6. Atributos iniciales

### 6.1 Atributos base
Fuerza:
Daño físico, empujones, armas pesadas.

Destreza:
Evasión, precisión ligera, iniciativa.

Constitución:
Vida, resistencia física, venenos.

Ingenio:
Técnica, trampas, crafting, improvisación.

Sabiduría:
Magia, sanación, percepción espiritual, resistencia mental.

Presencia:
Liderazgo, bardos, juramentos, amenaza social.

Percepción:
Detección, iniciativa, puntería, pistas.

### 6.2 Rango numérico recomendado
Nivel 1:
Atributos entre 3 y 10.
Valor medio: 5.
Valor alto inicial: 8-10.

Creación recomendada:
- Base 5 en todos.
- Pueblo/origen da +1.
- Clase da +2 repartidos en atributos clave.
- Jugador reparte 6 puntos.
- Ningún atributo por encima de 10 al nivel 1.
- Ningún atributo por debajo de 3 salvo modo avanzado.

### 6.3 Arquetipos rápidos
Para jugadores que no quieran repartir:
- Protector radiante.
- Ágil de academia.
- Sanador compasivo.
- Explorador de mapas.
- Cocinero resistente.
- Bardo brillante.
- Invocado improvisador.
- Inspector táctico.

## 7. Clases base

Clases iniciales recomendadas:
1. Caballero del Alba.
2. Monje de Candaluz.
3. Cocinero de Mazmorra.
4. Cartógrafo Vivo.
5. Invocado Desubicado.
6. Clérigo del Sol Quieto.
7. Duelista de Academia.
8. Inspector de Mazmorras.
9. Bardo de Crónica Viva.
10. Arcanista de las Cinco Corrientes.

Cada clase tiene:
- Rol.
- Atributos clave.
- Recurso de clase.
- Equipo recomendado.
- Habilidades 1-60.
- Especializaciones a nivel 20.
- Talentos de clase.
- Sinergias.
- Rutas de quest.

## 8. Ritmo de progresión 1-60

### 8.1 Tramos de nivel
Nivel 1-10: Aprendiz / Rango Cobre.
Tutorial extendido, Villaclara, primeras mazmorras, identidad básica.

Nivel 11-20: Aventurero competente / Cobre alto-Hierro.
Primer boss regional, Guardián del Pozo, primera confrontación con Cámara.

Nivel 21-30: Especialista / Hierro-Plata.
Elección de especialización. Solazur, Candaluz, Verdanza inicial, rutas regionales.

Nivel 31-40: Héroe regional / Plata-Oro.
Arcos grandes de Altherion, Cámara del Mediodía, reliquias solares, política.

Nivel 41-50: Campeón de reino / Oro-Alba.
Luminara, Criptas, Canon del Mediodía, decisiones de facción.

Nivel 51-60: Leyenda emergente / Alba-Leyenda.
Trono de Nadie, Corrientes Primarias, conflictos continentales, especialización final.

### 8.2 Desbloqueos por tramo
Cada 1 nivel:
- Vida y recursos aumentan.
- Pequeña mejora de precisión/defensa por nivel.

Cada 2 niveles:
- Punto de atributo menor o punto de entrenamiento alterno.

Cada 3 niveles:
- Nueva habilidad activa o mejora de habilidad.

Cada 5 niveles:
- Talento general o de clase.
- Posible rango de gremio si cumple requisitos.

Nivel 10:
- Primer rasgo de clase avanzado.

Nivel 20:
- Elección de especialización.

Nivel 30:
- Talento de especialización.

Nivel 40:
- Maestría de clase.

Nivel 50:
- Rasgo heroico.

Nivel 60:
- Habilidad legendaria.

## 9. Rangos del Gremio y relación con nivel

Los rangos no deben depender solo del nivel. Requieren historia, reputación y pruebas.

### 9.1 Rangos
Cobre:
Nivel recomendado 1-10.
Contratos rurales, plagas, recados, escoltas simples.

Hierro:
Nivel 10-20.
Mazmorras menores, bandidos, elites locales.

Plata:
Nivel 20-35.
Investigación regional, ruinas, amenazas de facción.

Oro:
Nivel 35-45.
Reliquias, política, bosses regionales.

Alba:
Nivel 45-55.
Campañas de reino, Cámara, Canon.

Leyenda:
Nivel 55-60.
Arcos continentales, Trono de Nadie, Corrientes Primarias.

### 9.2 Requisitos de ascenso
Ejemplo de ascenso a Hierro:
- Nivel 10 mínimo.
- Completar 5 contratos Cobre.
- Completar una quest de arco local.
- Reputación Gremio positiva.
- Prueba de rango: combate, investigación o escolta.

Ascenso a Plata:
- Nivel 20 mínimo.
- Completar arco de Villaclara o equivalente.
- Derrotar boss o resolver conflicto mayor.
- Recomendación de NPC.

### 9.3 Beneficios de rango
- Mejores contratos.
- Acceso a zonas.
- Mejores precios en Gremio.
- Títulos.
- Placas mejoradas.
- Acceso a entrenadores.
- Mayor credibilidad en diálogos.

## 10. Especializaciones

### 10.1 Nivel de elección
A nivel 20, cada clase elige una especialización. No debe cambiar completamente la clase, sino acentuar estilo.

### 10.2 Estructura de especialización
Cada especialización da:
- Rasgo pasivo inmediato.
- 1 habilidad activa en nivel 21.
- Nuevas habilidades o mejoras en 30, 40, 50 y 60.
- Modificadores de recurso.
- Rutas de quest y equipo recomendado.

### 10.3 Especializaciones por clase

Caballero del Alba:
- Guardián de Villaclara: protección, comunidad, vanguardia.
- Juramentado Solar: daño de Alba, falsos juramentos, Cámara.
- Portaestandarte: buffs grupales, moral, liderazgo.

Monje de Candaluz:
- Puño del Alba Serena: daño ágil y control.
- Sanador del Camino: autosanación y apoyo.
- Silencio de Campana: interrupciones, anti-casters.

Cocinero de Mazmorra:
- Chef de Combate: buffs y curas en combate.
- Alquimista de Sartén: estados, bombas culinarias.
- Maestro de Banquetes: preparación grupal y economía.

Cartógrafo Vivo:
- Trazador de Mazmorras: mapas, trampas, dungeons.
- Explorador de Frontera: movilidad, supervivencia.
- Cartógrafo de Memoria: nombres, pistas, Cámara.

Invocado Desubicado:
- Héroe Resonante: combate flexible.
- Artesano de Otro Mundo: técnica, crafting, herramientas.
- Errante Imposible: supervivencia, resistencia a memoria, rarezas planares.

Clérigo del Sol Quieto:
- Llama Compasiva: sanación fuerte.
- Custodio del Mediodía: protección contra Cámara y juramentos falsos.
- Exorcista del Alba: daño contra sombra/no-muertos/reflejos.

Duelista de Academia:
- León Solar: daño frontal y duelos nobles.
- Zorro de Alba: finta, control, social.
- Grulla Serena: defensa elegante y counters.

Inspector de Mazmorras:
- Auditor de Peligros: trampas, sellos, entorno.
- Regulador de Monstruos: bestiario, debuffs, control.
- Burócrata Arcano: anti-rituales, Cámara, documentos vivos.

Bardo de Crónica Viva:
- Cantor del Alba: sanación, moral.
- Bufón de Mazmorra: control, evasión, caos útil.
- Cronista de Nombres: memoria, anti-Canon, reputación.
Arcanista de las Cinco Corrientes:
- Evocador de Corrientes: daño mágico, áreas, Sobrecarga controlada.
- Teúrgo de Sellos: barreras, disipación, anti-Cámara.
- Hilador de Anomalías: magia experimental, rarezas planares, reflejos y memoria.

## 11. Habilidades 1-20 por clase

Las habilidades 1-20 ya están definidas en el documento de Altherion y el sistema de combate. Se consolidan como base oficial inicial. En este documento se mantienen por referencia y se expanden a 21-60.

Para evitar duplicidad excesiva, se recomienda que en implementación los niveles 1-20 vivan en data/skills/class_1_20.yml y los niveles 21-60 en archivos de especialización.

Resumen de identidad 1-20:
- Caballero: tanque protector y juramentos.
- Monje: agilidad, disciplina y control corporal.
- Cocinero: comida, ingredientes, buffs y curas.
- Cartógrafo: exploración, marcas y mapas.
- Invocado: improvisación y resonancia.
- Clérigo: sanación, luz y verdad.
- Duelista: daño preciso, counters y estilo.
- Inspector: sellos, análisis y control de peligro.
- Bardo: música, moral, memoria y soporte.
- Arcanista: Corrientes Primarias, daño mágico, control, análisis arcano y Sobrecarga.

## 12. Progresión 21-60: habilidades por clase y especialización

Nota de diseño:
A partir del nivel 21, cada clase obtiene una habilidad o mejora cada 3 niveles aproximadamente. Las especializaciones aportan identidad, pero todas las clases conservan su núcleo.

### 12.1 Caballero del Alba

Niveles comunes 21-60:
21: Habilidad de especialización I.
24: Juramento Reforzado. El voto elegido dura más y otorga un pequeño efecto secundario.
27: Marcha del Escudo. Permite mover a un aliado protegido sin provocar ataques.
30: Talento de especialización I.
33: Luz Contra la Mentira. Daño extra y dispel menor contra Juramento Falso.
36: Guardia de Dos Mundos. Reduce daño físico y de memoria durante una ronda.
39: Golpe de Estandarte. Ataque que aumenta moral si impacta.
40: Maestría de clase: Bastión Reconocido. Al defender un lugar con reputación positiva, gana Nombre Anclado menor.
42: Intercepción Heroica. Reacción para recibir un ataque mortal destinado a un aliado.
45: Habilidad de especialización II.
48: Voto Inquebrantable. Una vez por descanso largo, ignora miedo, burla o control mental leve.
50: Rasgo heroico: Muralla con Nombre. Mientras tenga Nombre Anclado, parte del grupo gana resistencia a Borrón.
54: Juicio de Alba. Ataque fuerte contra enemigo provocado o marcado por Cámara.
57: Guardia del Último Paso. Defiende una salida, NPC u objetivo durante evento.
60: Habilidad legendaria de especialización.

Guardián de Villaclara:
21: Círculo de Hogar. Zona defensiva que mejora a aliados en una localización protegida.
30: Talento: Vecinos tras el Escudo. NPCs aliados reciben menos daño en eventos.
45: Juramento del Umbral. Si defiende un hub o pueblo, recupera Juramento cada ronda.
60: La Muralla Recuerda. Durante una escena/boss, ancla el nombre de todos los aliados y reduce daño masivo.

Juramentado Solar:
21: Tajo de Juramento Verdadero. Daño de Alba que rompe un buff falso.
30: Talento: Luz que No Obedece al Canon. Resiste Canon Menor.
45: Desafío al Mediodía. Fuerza a agente de Cámara a revelar una acción preparada.
60: Veredicto del Alba. Ataque legendario que castiga juramentos falsos y restaura un nombre borrado en combate.

Portaestandarte:
21: Estandarte de Cobre a Leyenda. Coloca estandarte que aumenta moral y amenaza del caballero.
30: Talento: Bajo mi Bandera. Aliados ganan recurso al defender.
45: Marcha de los Nombres. Buff grupal de movimiento, moral y resistencia mental.
60: Estandarte de la Crónica Viva. Durante un clímax, convierte acciones heroicas de aliados en curación/moral.

### 12.2 Monje de Candaluz

Comunes:
21: Habilidad de especialización I.
24: Respiración Profunda. Mejora recuperación de Disciplina.
27: Paso Sin Huella. Reposicionamiento que ignora terreno difícil.
30: Talento de especialización I.
33: Palma que Escucha. Ataque que detecta debilidad física o espiritual.
36: Mantra Contra el Ruido. Resiste sónico, miedo y confusión.
39: Cadena de Cinco Gestos. Combo avanzado por variedad de técnicas.
40: Maestría: Serenidad en Tormenta. Gana Disciplina cuando falla una resistencia mental.
42: Patada al Ritmo del Mundo. Interrumpe habilidad preparada.
45: Habilidad de especialización II.
48: Cuerpo de Campana. Al recibir golpe fuerte, emite pulso que reduce daño próximo.
50: Rasgo heroico: El Sol Interior no Parpadea. Una vez por descanso, limpia control y actúa.
54: Paso Entre Recuerdos. Evita ataque de memoria o sombra.
57: Palma de Retorno. Cura a aliado y empuja enemigo cercano.
60: Habilidad legendaria de especialización.

Puño del Alba Serena:
21: Combo del Amanecer. Tres golpes; el tercero aplica Expuesto.
30: Talento: Técnica sin Presumir. Más daño si alterna habilidades.
45: Puño de Campana Blanca. Daño alto y aturdimiento breve si interrumpe.
60: Forma del Alba Perfecta. Durante varias rondas, cada técnica distinta potencia la siguiente.

Sanador del Camino:
21: Manos de Peregrino. Cura y reduce Cansado.
30: Talento: Paso que Acompaña. Moverse junto a aliado lo cura levemente.
45: Voto de Camino Seguro. Zona de calma que reduce daño y estados.
60: Mil Pasos de Regreso. Revive o restaura a un aliado caído si el grupo no huyó.

Silencio de Campana:
21: Golpe al Aliento. Bloquea conjuros verbales 1 ronda.
30: Talento: Oído del Monasterio. Detecta preparación mágica antes.
45: Cúpula de Silencio. Zona anti-cántico/anti-liturgia.
60: Silencio que Parte el Canon. Interrumpe una imposición de memoria mayor.

### 12.3 Cocinero de Mazmorra

Comunes:
21: Habilidad de especialización I.
24: Despensa Preparada. Lleva más ingredientes sin penalización.
27: Receta Adaptativa. Cambia un ingrediente por equivalente.
30: Talento de especialización I.
33: Fuego Justo. Controla Calor para evitar sobrecalentamiento.
36: Marinada de Monstruo. Debuff contra criatura previamente cocinada/estudiada.
39: Olla de Campaña. Buff grupal durante viaje o dungeon.
40: Maestría: Nada se Tira. Más loot culinario y mejores restos.
42: Antídoto de Cuchara. Limpia veneno/enfermedad moderada.
45: Habilidad de especialización II.
48: Menú de Emergencia. Prepara consumible en combate con coste alto.
50: Rasgo heroico: Cocina que Recuerda. Comida puede activar Recuerdo Despierto positivo.
54: Sabor de Victoria. Al vencer boss, crea receta única si recolectó ingredientes.
57: Banquete Imposible. Buff fuerte antes de clímax.
60: Habilidad legendaria de especialización.

Chef de Combate:
21: Pincho de Apertura. Ataque + marca culinaria.
30: Talento: Servicio Rápido. Primer consumible de combate cuesta acción menor.
45: Menú de Tres Tiempos. Tres buffs encadenados.
60: Banquete en Plena Batalla. Gran habilidad grupal que cura, inspira y restaura recursos.

Alquimista de Sartén:
21: Salsa Corrosiva. Daño ácido/veneno y reduce armadura.
30: Talento: Explosión Controlada. Reduce daño aliado de bombas culinarias.
45: Frasco Flambeado. Área de fuego con estado Quemado.
60: Receta Prohibida pero Deliciosa. Efecto masivo con riesgo controlado según Ingenio.

Maestro de Banquetes:
21: Mesa de Moral. Zona que regenera moral y recurso.
30: Talento: Sobras Benditas. Parte del buff persiste tras combate.
45: Invitación al Banquete. NPCs aliados combaten mejor.
60: El Festín que Salvó el Pueblo. Ritual culinario de arco: protege hub, aumenta reputación y buffs de zona.

### 12.4 Cartógrafo Vivo

Comunes:
21: Habilidad de especialización I.
24: Tinta Persistente. Marcas duran más.
27: Leer Sala Viva. Detecta mecánica de entorno.
30: Talento de especialización I.
33: Ruta de Flanco. Mueve aliado a flanco con ventaja.
36: Mapa de Calor Emocional. Detecta miedo, culpa, Cámara o memoria fuerte.
39: Señal de Tesoro Dudoso. Aumenta hallazgo de secretos.
40: Maestría: El Mapa también Mira. Advierte de emboscadas raras.
42: Pliegue de Ruta. Atajo temporal en zona explorada.
45: Habilidad de especialización II.
48: Coordenada de Retorno. Permite retirada segura hacia sala marcada.
50: Rasgo heroico: Cartografía de Nombres. Registra nombres vinculados a lugares y resiste borrado.
54: Tinta Contra el Canon. Marca actas, enemigos o zonas alteradas por Cámara.
57: Atlas de Crisis. Durante boss, revela fases aproximadas.
60: Habilidad legendaria de especialización.

Trazador de Mazmorras:
21: Plano de Peligro. Revela trampas y rutas seguras.
30: Talento: Tiza Maestra. Sellos de mapa reducen daño de trampas.
45: Mapa de Mazmorra Viva. Anticipa cambios de sala.
60: Atlas del Laberinto Obediente. Durante una dungeon, fija rutas y reduce caos ambiental.

Explorador de Frontera:
21: Sendero sin Camino. Mejora viaje y exploración exterior.
30: Talento: Campamento Oculto. Descanso seguro en zonas salvajes.
45: Emboscada Cartografiada. Prepara ventaja inicial en combate.
60: Ruta Imposible. Abre atajo regional temporal o acceso secreto.

Cartógrafo de Memoria:
21: Mapa de Recuerdos. Vincula pista a ubicación y desbloquea deducciones.
30: Talento: Margen Anclado. Pistas críticas no pueden borrarse fácilmente.
45: Trazar Nombre. Protege NPC o aliado contra Borrón.
60: Atlas de lo que Fue. Revela una versión antigua de una zona y permite interactuar con su memoria.

### 12.5 Invocado Desubicado

Comunes:
21: Habilidad de especialización I.
24: Glosario Imposible. Mejora comunicación con culturas raras.
27: Herramienta de Bolsillo II. Objeto improvisado mejor.
30: Talento de especialización I.
33: Patrón Detectado. Tras ver habilidad enemiga, gana defensa contra ella.
36: Resonancia Cruzada. Usa atributo alternativo para una tirada justificada.
39: Idea Peligrosamente Buena. Improvisación con alto riesgo/beneficio.
40: Maestría: No Soy de Aquí, pero Aprendo Rápido. Reduce penalización en zonas nuevas.
42: Paradoja Menor. Ignora una regla impuesta de combate una vez por descanso.
45: Habilidad de especialización II.
48: Recuerdo que No Cabe. Obtiene pista rara en escenas de memoria.
50: Rasgo heroico: Anomalía Amistosa. Aliados cercanos ganan resistencia a rarezas planares.
54: Solución de Otro Género. Cambia resolución de quest si hay lógica creativa.
57: Resonancia de Party. Comparte pequeño efecto resonante con aliados.
60: Habilidad legendaria de especialización.

Héroe Resonante:
21: Ataque Fuera de Patrón. Daño que cambia tipo según situación.
30: Talento: Segunda Barra Imaginaria. Recupera recurso en peligro.
45: Combo Imposible. Combina dos habilidades menores.
60: Despertar de Protagonista Inesperado. Durante clímax, reduce cooldowns y resiste Canon.

Artesano de Otro Mundo:
21: Herramienta Inexplicable. Crea dispositivo temporal.
30: Talento: Manual sin Dibujos. Mejora crafting y reparación.
45: Trampa de Lógica Externa. Controla enemigo que no entiende el mecanismo.
60: Taller de Procedencia Extravagante. Crea artefacto único ligado al arco.

Errante Imposible:
21: Paso Desubicado. Evita golpe o cambia posición.
30: Talento: No Debería Estar Aquí. Mejor huida y acceso a rutas raras.
45: Memoria Anticanon. Resiste Borrón fuerte.
60: Donde Termina el Mapa. Abre camino narrativo a zona imposible o salva al grupo de borrado.

### 12.6 Clérigo del Sol Quieto

Comunes:
21: Habilidad de especialización I.
24: Devoción Serena. Mejora regeneración de Devoción.
27: Bendición Persistente. Buffs duran más.
30: Talento de especialización I.
33: Luz Sobre la Herida. Cura y revela estado oculto.
36: Campana del Alma. Detecta posesión, juramento falso o memoria dañada.
39: Sello Compartido. Protección a dos aliados.
40: Maestría: La Luz que Calienta. Curaciones aplican moral leve.
42: Romper Sombra. Dispel contra Sombra o miedo.
45: Habilidad de especialización II.
48: Custodia del Nombre. Protege aliado contra Borrón acumulado.
50: Rasgo heroico: Testigo del Alba. Si presencia una injusticia de memoria, gana Devoción extra.
54: Aurora de Juicio. Daño y revelación en área.
57: Rezo de Última Lumbre. Evita caída de grupo una vez en boss.
60: Habilidad legendaria de especialización.

Llama Compasiva:
21: Curación de Manos Abiertas. Cura fuerte con pequeño HoT.
30: Talento: Compasión Eficiente. Sobresanación se convierte en escudo menor.
45: Círculo Hospitalario. Zona de curación sostenida.
60: Milagro del Alba Serena. Gran restauración de grupo y limpieza de estados críticos.

Custodio del Mediodía:
21: Sello contra Falso Juramento. Protege contra Cámara.
30: Talento: Mediodía Templado. Convierte luz rígida en protección cálida.
45: Liturgia de Nombre Verdadero. Restaura Borrón grave.
60: Custodia del Canon Roto. Niega una imposición mayor de memoria en escena clave.

Exorcista del Alba:
21: Lanza de Luz Clara. Daño a Sombra/no-muerto/reflejo.
30: Talento: Mancha Revelada. Crit extra contra ocultos revelados.
45: Exorcismo de Reflejo. Expulsa doble o entidad vinculada.
60: Sol sin Sombra. Área masiva que revela y daña entidades ocultas.

### 12.7 Duelista de Academia

Comunes:
21: Habilidad de especialización I.
24: Estilo Afinado. Recupera Estilo al ejecutar finta exitosa.
27: Paso de Galería. Reposiciona con bonificación social si hay testigos.
30: Talento de especialización I.
33: Corte de Argumento. Ataque que interrumpe habilidad verbal o social.
36: Finta de Dos Capas. Aplica Expuesto o Burlado.
39: Guardia de Rival. Defensa contra objetivo marcado.
40: Maestría: Duelo como Lenguaje. Gana opciones sociales en conflictos formales.
42: Aplauso Robado. Al critar, reduce moral enemiga.
45: Habilidad de especialización II.
48: Segunda Estocada. Ataque menor tras esquivar.
50: Rasgo heroico: Nombre en la Arena. En duelo, resiste miedo y Borrón.
54: Técnica de Salón Prohibida. Gran ataque con desventaja social si se usa indebidamente.
57: Final con Reverencia. Remate que puede forzar rendición.
60: Habilidad legendaria de especialización.

León Solar:
21: Embestida de Honor. Ataque frontal fuerte.
30: Talento: Nobleza de Acero. Más daño si no ataca por la espalda.
45: Rugido del Torneo. Provoca y aumenta daño propio.
60: Final del León Radiante. Remate legendario de duelo frontal.

Zorro de Alba:
21: Finta Imposible. Hace fallar reacción enemiga.
30: Talento: Sonrisa con Plan. Bonificación social tras victoria táctica.
45: Cambio de Máscara. Cambia posición y objetivo marcado.
60: La Estocada que Nadie Firmó. Ataque que ignora defensa preparada.

Grulla Serena:
21: Parada de Seda. Reduce daño y prepara counter.
30: Talento: Belleza Defensiva. Defender genera Estilo extra.
45: Danza de Tres Desvíos. Evita varios ataques menores.
60: Corte de la Grulla Quietísima. Counter legendario contra ataque anunciado.

### 12.8 Inspector de Mazmorras

Comunes:
21: Habilidad de especialización I.
24: Sellos Reutilizables. Recupera parte de Sellos tras combate.
27: Lectura de Incumplimiento. Detecta punto débil técnico.
30: Talento de especialización I.
33: Protocolo de Evacuación Mejorado. Retirada grupal eficiente.
36: Sello de Contención Media. Controla criatura o trampa moderada.
39: Informe Vinculante. Debuff que aumenta daño aliado contra amenaza analizada.
40: Maestría: Autoridad en Zona Insegura. En mazmorras, el primer sello cuesta menos.
42: Clausura de Emergencia. Bloquea acción preparada de entorno/enemigo.
45: Habilidad de especialización II.
48: Auditoría de Realidad. Detecta alteración de memoria o sala falsa.
50: Rasgo heroico: Esto no Cumple Normativa. Gana ventaja contra entidades imposibles tras analizarlas.
54: Sello de Peligro Crítico. Gran defensa grupal contra ataque anunciado.
57: Reapertura Controlada. Convierte trampa en herramienta aliada.
60: Habilidad legendaria de especialización.

Auditor de Peligros:
21: Sello de Señalización Avanzada. Reduce trampas y emboscadas.
30: Talento: Casco de Leyenda. Reduce críticos en dungeons.
45: Perímetro Homologado. Zona segura temporal.
60: Declaración de Mazmorra Bajo Custodia. Durante una dungeon, reduce caos, respawns y trampas.

Regulador de Monstruos:
21: Clasificación Forzosa. Marca tipo de criatura y debilidad.
30: Talento: Bestiario Vivo. Más recompensas por observación.
45: Orden de Captura. Facilita captura no letal.
60: Decreto de Especie Controlada. Debuff masivo contra familias de monstruos conocidas.

Burócrata Arcano:
21: Formulario 13-B Mejorado. Interrumpe legalismos, rituales y Cámara menor.
30: Talento: Sello con Letra Pequeña. Resiste contratos falsos.
45: Auditoría del Canon. Revela una regla impuesta por Cámara.
60: Revocación del Mediodía. Anula una imposición documental/memoria en clímax.

### 12.9 Bardo de Crónica Viva

Comunes:
21: Habilidad de especialización I.
24: Voz Entrenada. Aumenta reserva de Voz.
27: Estrofa Sostenida. Mantiene combo una ronda extra.
30: Talento de especialización I.
33: Copla de Retorno. Aliado recupera moral y acción menor si estaba afectado mentalmente.
36: Canción de Sala. Usa entorno como instrumento.
39: Crónica Compartida. Aliados ganan beneficio al repetir hazaña.
40: Maestría: El Mundo Escucha. Canciones afectan escenas sociales y memoria local.
42: Contraestrofa Mayor. Interrumpe conjuros, liturgias o discursos.
45: Habilidad de especialización II.
48: Balada de lo Improbable. Aumenta éxito de improvisaciones aliadas.
50: Rasgo heroico: Nombre en Boca de Todos. Reputación positiva mejora resistencia mental del grupo en zona.
54: Canción contra el Olvido. Limpia Borrón acumulado.
57: Leyenda antes del Golpe. Prepara remate de aliado con gran buff.
60: Habilidad legendaria de especialización.

Cantor del Alba:
21: Himno del Primer Pan. Cura y aumenta moral.
30: Talento: Calor en la Voz. Curaciones bardas dejan escudo menor.
45: Coro de la Plaza. Buff grupal fuerte si hay NPCs aliados o reputación local.
60: Canción que Levantó Villaclara. Gran restauración y anclaje de nombres en área.

Bufón de Mazmorra:
21: Chiste Táctico. Provoca fallo o desventaja en enemigo.
30: Talento: Caos con Compás. Efectos aleatorios favorables más controlados.
45: Solo de Tropezones. Control en área.
60: La Broma que Engañó al Laberinto. Cambia reglas menores de dungeon durante una escena.

Cronista de Nombres:
21: Verso de Nombre Verdadero. Ancla nombre de aliado/NPC.
30: Talento: Tinta de Voz. Pistas cantadas no se borran fácilmente.
45: Balada contra el Canon. Reduce Borrón y Juramento Falso en grupo.
60: Gran Crónica de los que No Serán Borrados. Niega una gran alteración de memoria y convierte la Crónica en arma.



### 12.10 Arcanista de las Cinco Corrientes

El Arcanista de las Cinco Corrientes es la clase de magia arcana pura de InheronMUD. Estudia, canaliza y combina las Corrientes Primarias: Alba, Raíz, Brasa, Marea y Sombra. No pertenece necesariamente a la Iglesia, aunque en Altherion muchos arcanistas se forman en Solazur, en la Biblioteca del Sol Quieto o como aprendices itinerantes de la Universidad de las Cinco Corrientes de Valdor.

Rol: daño mágico, control, utilidad arcana, análisis de reliquias, rituales, contramagia y manipulación de entorno.
Atributos clave: Ingenio, Sabiduría, Percepción.
Recurso principal: Concentración.
Recurso secundario: Carga Arcana.
Equipo recomendado: bastones, varitas, grimorios, focos cristalinos, túnicas, talismanes, anillos de canalización.
Armadura: ligera.
Armas: bastón, daga ritual, vara corta, foco arcano.
Dificultad: media-alta.
Estilo de juego: potente y flexible, pero debe gestionar Sobrecarga.

#### Fantasía de clase
Un Arcanista no “lanza hechizos genéricos”. Lee las Corrientes del mundo y tira de ellas con fórmulas, gestos, nombres técnicos y una confianza que a veces merece supervisión adulta. En Villaclara puede detectar por qué el pozo canta, por qué el sótano de Doña Marga tiene geometría de mazmorra y por qué algunas tintas parecen demasiado educadas para ser honestas.

Frase de clase:
“La magia no es romper la realidad. Es pedirle que se aparte un poco. Con educación. Y un foco ignífugo”.

#### Mecánica única: Concentración, Carga Arcana y Sobrecarga

Concentración:
Recurso estable. Se gasta para lanzar hechizos. Se recupera lentamente cada ronda, más rápido al usar acciones de estudio, defenderse con foco o no repetir la misma Corriente.

Carga Arcana:
Se acumula al lanzar hechizos de Corrientes, canalizar magia o usar rituales rápidos. Aumenta potencia de hechizos, pero también riesgo.

Sobrecarga:
Si la Carga Arcana supera un umbral, el Arcanista puede sufrir efectos secundarios. La Sobrecarga no debe ser castigo ciego, sino riesgo táctico visible.

Umbrales sugeridos:
- Carga 0-3: estable.
- Carga 4-6: potenciada, +daño/+efecto menor.
- Carga 7-8: inestable, posibilidad de Chisporroteo Arcano.
- Carga 9+: Sobrecarga, se dispara un efecto y la Carga baja.

Efectos de Sobrecarga posibles:
- Chispa Errante: daño menor aleatorio a enemigo o entorno.
- Fatiga Arcana: reduce recuperación de Concentración 1 ronda.
- Pelo Estático: penalización social menor, pero bonus contra ovejas cumulonimbo. Muy específico, como todo buen desastre.
- Eco de Corriente: repite un efecto reducido sobre objetivo cercano.
- Foco Humeante: no puede canalizar durante 1 ronda si falla resistencia técnica.

Contra-juego:
- Acción menor: Respirar Fórmula, reduce Carga en 1.
- Acción principal: Descargar Corriente, convierte Carga en efecto controlado.
- Talentos reducen Sobrecarga.
- Algunas especializaciones la aprovechan.

#### Afinidades de Corriente

Alba:
Luz, revelación, barreras, daño contra Sombra, juramentos falsos y Cámara.

Raíz:
Ataduras, venenos, regeneración menor, control de plantas, memoria natural.

Brasa:
Daño alto, quemaduras, explosiones, forja, voluntad. Peligrosa en panaderías y archivos. Advertencia muy seria.

Marea:
Movimiento, empuje, reflejo, limpieza, niebla, control de posición.

Sombra:
Ocultación, miedo, memoria, sueño, daño mental. No es maldad pura, pero exige cuidado y reputación social delicada.

#### Habilidades niveles 1-20

Nivel 1: Chispa de Corriente.
Ataque mágico básico. El Arcanista elige Alba, Brasa o Marea al usarlo. Daño bajo-moderado, coste bajo de Concentración. Genera 1 Carga Arcana.

Nivel 2: Escudo de Concentración.
Barrera menor sobre sí mismo o aliado. Reduce daño del siguiente golpe. Si se lanza con Carga 4+, también reduce daño mágico.

Nivel 3: Detectar Resonancia.
Revela magia activa, reliquias dormidas, trampas arcanas, Corrientes alteradas o rastros de memoria impuesta. En combate puede identificar tipo de daño o resistencia dominante.

Nivel 4: Nudo de Raíz.
Ralentiza a un enemigo mediante raíces de luz verde, hilos vegetales o símbolos de crecimiento. Aplica Ralentizado; con buena tirada, también Pegajoso leve.

Nivel 5: Canalizar Corriente.
Acción menor. El siguiente hechizo gana potencia, pero genera +1 Carga adicional. Si el Arcanista ya está inestable, la Crónica recomienda prudencia. La Crónica no siempre es escuchada.

Nivel 6: Brasa Menor.
Daño de fuego a un objetivo. Aplica Quemado 1 si falla resistencia. En entornos con harina, gas o aceite puede interactuar con la sala.

Nivel 7: Fórmula de Limpieza.
Disipa un estado mágico menor o reduce Pegajoso, Cegado, Niebla, Tinta Viva hostil o residuos de slime. Muy apreciado por panaderos.

Nivel 8: Paso de Marea.
Reposiciona al Arcanista o empuja a un enemigo de vanguardia a flanco/retaguardia según tirada. Útil para salir de Enzarzado.

Nivel 9: Lente de Alba.
Revela enemigos ocultos, ilusiones menores o documentos falsos. Contra agentes de Cámara puede mostrar “luz vertical” o ausencia de sombra.

Nivel 10: Afinidad Inicial.
Elige una Corriente preferida entre Alba, Raíz, Brasa, Marea o Sombra. Los hechizos de esa Corriente cuestan ligeramente menos o generan Carga más estable.

Nivel 11: Dardo de Corriente Doble.
Ataque que combina dos Corrientes compatibles. Ejemplos: Alba+Marea revela y empuja; Brasa+Raíz aplica Quemado a plantas; Sombra+Marea crea niebla de duda.

Nivel 12: Círculo de Tiza Arcana.
Coloca un pequeño círculo en el suelo. Aliados dentro ganan resistencia mágica menor. En dungeons puede estabilizar una sala inquieta.

Nivel 13: Lectura de Patrón Mágico.
Analiza un enemigo o fenómeno. La próxima acción mágica del grupo contra ese objetivo gana ventaja menor.

Nivel 14: Descarga Controlada.
Reduce Carga Arcana y causa efecto según Corriente acumulada más reciente. Herramienta básica para evitar Sobrecarga.

Nivel 15: Sombra con Guantes.
Hechizo de Sombra seguro. Aplica Desventaja menor o Asustado leve sin aumentar atención social si se usa justificadamente. Si se abusa en zonas puristas, puede generar sospecha.

Nivel 16: Contrafórmula Rápida.
Reacción. Intenta reducir, desviar o debilitar un conjuro enemigo anunciado. Consume Concentración y genera Carga.

Nivel 17: Jaula de Raíz y Luz.
Control moderado sobre un objetivo. Combina Raíz y Alba para inmovilizar parcialmente sin dañar demasiado. Buena opción no letal.

Nivel 18: Marea Especular.
Crea un reflejo defensivo que puede absorber un ataque o confundir al enemigo. Riesgo aumentado cerca de Verdanza.

Nivel 19: Estudio Bajo Presión.
Si el Arcanista no lanza hechizo ofensivo durante una ronda, recupera Concentración y gana una pista táctica sobre enemigo o entorno.

Nivel 20: Armonía de Corrientes.
Durante varias rondas, alternar Corrientes distintas reduce coste y disminuye riesgo de Sobrecarga. Marca el cierre del tramo Cobre/Hierro y prepara la especialización.

#### Niveles comunes 21-60

21: Habilidad de especialización I.
24: Memoria de Fórmula. Recupera Concentración al repetir una solución arcana ya registrada en la Crónica.
27: Matriz de Contención. Reduce efectos de Sobrecarga y protege el foco.
30: Talento de especialización I.
33: Trenza de Tres Corrientes. Hechizo que combina tres Corrientes con efecto según combinación.
36: Ojo de la Quinta Tinta. Detecta alteraciones de Cámara, grietas menores, pactos falsos o reliquias con voluntad.
39: Descarga Elegante. Convierte Carga alta en daño/control sin riesgo si supera tirada de Ingenio.
40: Maestría: Teoría con Botas. En dungeons o escenas de investigación, sus hechizos de análisis pueden abrir rutas alternativas.
42: Sello de Equilibrio. Zona que reduce daño mágico enemigo y estabiliza Corrientes.
45: Habilidad de especialización II.
48: Fórmula Antirritual. Interrumpe rituales, invocaciones o imposiciones menores si están telegrafiadas.
50: Rasgo heroico: Nombre en la Fórmula. Al lanzar magia para proteger un NPC, lugar o nombre registrado en la Crónica, gana resistencia a Borrón.
54: Canal Mayor. Potencia el siguiente hechizo de especialización, pero entra en zona de Sobrecarga inestable.
57: Teorema de Emergencia. Una vez por descanso largo, convierte un fallo de hechizo en resultado mixto en lugar de desastre.
60: Habilidad legendaria de especialización.

#### Especializaciones

Evocador de Corrientes:
Especialización ofensiva. Canaliza Corrientes como daño, áreas y explosiones controladas. Alto poder, mayor riesgo de Sobrecarga.

21: Lanza Prismática.
Ataque fuerte que elige tipo de Corriente al lanzarse. Si se lanza con Carga 5+, salta a un segundo objetivo con daño reducido.

30: Talento: Hambre de Corriente.
Al derrotar a un enemigo con daño mágico, recupera Concentración menor. Si fue con Sobrecarga controlada, gana Carga estable.

45: Tormenta de Cinco Colores.
Área que aplica efectos menores según Corrientes usadas en las rondas anteriores. Premia rotación variada.

60: Cataclismo Afinado.
Hechizo legendario de área. Desata varias Corrientes sin romper el entorno si el Arcanista ha mantenido Armonía o Matriz de Contención. Si no, el entorno participa con opiniones.

Teúrgo de Sellos:
Especialización defensiva y ritualista. Usa fórmulas, sellos y geometría arcana para proteger, disipar y negar magia enemiga. Muy fuerte contra Cámara del Mediodía.

21: Sello de Fórmula Clara.
Protege a un aliado contra daño mágico y estados de memoria leves.

30: Talento: Geometría Paciente.
Los círculos, sellos y barreras duran más si el Arcanista no se mueve de forma imprudente.

45: Muralla de Cinco Trazos.
Gran barrera grupal. Cada Corriente usada recientemente añade una resistencia distinta.

60: Teorema del Mediodía Roto.
Niega una imposición mágica o de memoria mayor durante una escena clave. Contra la Cámara, puede romper Canon Menor o debilitar Canon Mayor.

Hilador de Anomalías:
Especialización experimental. Trabaja con magia inestable, rarezas planares, reflejos, memoria y efectos inesperados. Alto techo táctico, resultados sabrosamente raros.

21: Hilo Improbable.
Altera una condición de combate: cambia posición, transfiere un estado menor o convierte una desventaja en efecto lateral.

30: Talento: Accidente Aprovechable.
Cuando ocurre Sobrecarga, el Arcanista puede elegir entre dos efectos en vez de aceptar uno aleatorio.

45: Reflejo de Posibilidad.
Crea una copia arcana breve de una acción aliada o enemiga, con potencia reducida. Cerca de Verdanza, puede tener consecuencias narrativas.

60: Anomalía Obediente.
Durante un clímax, convierte una rareza planar, grieta menor o fenómeno inestable en herramienta temporal del grupo. No elimina el peligro, lo convence de apuntar en otra dirección.

#### Talentos de clase sugeridos

Foco Bien Atado:
Reduce probabilidad de perder acción por Sobrecarga.

Caligrafía Arcana:
Mejora sellos, círculos y análisis de documentos mágicos.

Rotación de Corrientes:
Gana bonificación si no repite la misma Corriente dos turnos seguidos.

Sombrero Conductivo:
Aumenta Carga máxima segura en 1. Implica usar sombrero arcano homologado. No protege del ridículo; lo institucionaliza.

Lectura de Reliquia:
Permite identificar estado dormido/despierto de objetos mágicos.

#### Quests de identidad del Arcanista en Villaclara

Quest menor: La Vela que No Parpadea.
Hermana Lúa pide ayuda para examinar una vela que arde sin consumir cera. Enseña Detectar Resonancia y Lente de Alba.

Quest menor: El Horno y el Pozo.
Doña Marga permite, con supervisión severa, analizar la línea mágica entre el horno de la panadería y el Pozo Cantante. Enseña que Brasa en interiores requiere prudencia.

Quest menor: Tinta con Demasiada Educación.
El Arcanista estudia tinta blanca del archivo. Puede descubrir que no absorbe luz, la ordena.

Quest de clase 1-20: Fórmula del Primer Umbral.
Durante el arco del Pozo, el Arcanista puede crear una fórmula de contención que estabiliza la gota del Cáliz durante el finale. Recompensa: Sello de Resonancia de Pozo.

#### Recompensa de arco sugerida

Sello de Resonancia de Pozo:
Habilidad pasiva/ritual menor. Permite al Arcanista detectar Corrientes alteradas en pozos, fuentes, espejos de agua y hornos antiguos. En combate contra Cámara, otorga una vez por descanso ventaja para resistir Canon Menor.

#### Equipo inicial sugerido
- Bastón de aprendiz con nudo de tiza.
- Foco cristalino agrietado pero legal.
- Libreta de fórmulas resistentes a salpicaduras leves.
- Túnica práctica con bolsillo para vela, cuerda y decisiones de última hora.

#### Balance
Fortalezas:
- Daño mágico flexible.
- Control de área y estados.
- Identificación de magia y reliquias.
- Contrajuego contra Cámara.
- Buenas rutas de investigación.

Debilidades:
- Armadura ligera.
- Vulnerable si se queda sin Concentración.
- Riesgo de Sobrecarga si abusa de hechizos potentes.
- Requiere leer entorno y alternar Corrientes.

Solo play:
Viable, pero más táctico que Caballero o Duelista. Debe usar Escudo, control y entorno.

Party play:
Excelente como controlador/daño mágico. Brilla con Inspector, Cartógrafo, Bardo y Caballero.
## 13. Talentos generales

Los talentos se obtienen cada 5 niveles aproximadamente, por quests, entrenadores o reputación. No deben ser demasiados al inicio.

### 13.1 Talentos de combate
Golpe Preciso:
+precisión con ataques básicos.

Defensa Práctica:
Defender reduce más daño.

Reacción Rápida:
+iniciativa y una reacción menor por descanso.

Aguante de Campo:
Más vida y resistencia a Cansado.

Especialista en Arma:
Bonificación con un tipo de arma.

### 13.2 Talentos sociales
Cara de No Haber Roto Nada:
Reduce penalizaciones sociales tras accidentes menores.

Amigo de Taberna:
Mejores rumores y precios en posadas.

Etiqueta con Botas:
Mejor interacción con nobleza sin parecer mueble armado.

Testigo Fiable:
Tus testimonios pesan más en quests legales.

### 13.3 Talentos de exploración
Ojo para Baldosas Sospechosas:
Mejor detección de trampas.

Nariz de Quest:
Más pistas ambientales.

Paso Ligero:
Menos emboscadas.

Campista Decente:
Mejores descansos fuera de posada.

### 13.4 Talentos de memoria
Nombre Bien Escrito:
Mayor resistencia a Borrón.

Diario Minucioso:
La Crónica conserva pistas aunque la Cámara actúe.

Promesa Atada:
Bonificación al cumplir juramentos o proteger NPCs.

Memoria de Pan Caliente:
Comida de lugares queridos da buffs mejores.

## 14. Skills generales

Las habilidades generales ya definidas para MUD con toque isekai deben convertirse en un sistema progresivo.

Categorías:
- Movimiento y exploración.
- Social y rol.
- Supervivencia y utilidad.
- Combate general.
- Conocimiento y oficio.
- Isekai y rarezas planares.

Progresión:
- Rango básico: disponible por trasfondo o entrenamiento.
- Rango experto: desbloqueado por uso/quest/reputación.
- Rango maestro: raro, ligado a arcos.

Ejemplo:
Escuchar Música de Boss
Básico: detecta peligro cercano.
Experto: identifica tipo de amenaza.
Maestro: permite actuar antes de una mecánica anunciada una vez por descanso.

## 15. Progresión de atributos

Cada 2 niveles, el jugador gana 1 punto de atributo menor.
Cada 10 niveles, gana 1 punto adicional de atributo mayor.

Límites sugeridos:
Nivel 1-20: máximo natural 14.
Nivel 21-40: máximo 18.
Nivel 41-60: máximo 22.

Evitar escalado infinito. El poder debe venir también de habilidades, equipo, reputación y especialización.

## 16. XP y avance

### 16.1 Fuentes de XP
- Combate.
- Quests.
- Arcos completados.
- Descubrir pistas importantes.
- Resolver sin violencia.
- Bestiario.
- Profesiones.
- Eventos dinámicos.

### 16.2 Reparto recomendado
Quest/arco debe pesar más que farmeo.

Propuesta:
- Combate normal: bajo-moderado.
- Elite/boss: moderado-alto.
- Quest: alto.
- Arco: muy alto.
- Descubrimientos: moderado.

Objetivo:
Un jugador que siga arcos principales y secundarias razonables llega al nivel apropiado sin grind.

### 16.3 Curva de XP
Fase 1 puede usar curva simple:
XP requerida nivel N = base * N^2 * factor.

Recomendación inicial:
- Nivel 1-10: rápido.
- Nivel 11-20: moderado.
- Nivel 21-40: más pausado.
- Nivel 41-60: ligado a arcos.

No fijar números definitivos hasta probar combate y quests.

## 17. Progresión horizontal

Además de nivel, el jugador progresa por:
- Rangos de gremio.
- Reputaciones.
- Títulos.
- Profesiones.
- Bestiario.
- Crónica Viva.
- Relaciones NPC.
- Reliquias despiertas.
- Mapas descubiertos.
- Mascotas/familiares.

Esto evita que todo dependa del XP.

## 18. Títulos y apodos

### 18.1 Tipos
Títulos de Gremio:
Cobre, Hierro, Plata, Oro, Alba, Leyenda.

Títulos locales:
Nombre de Villaclara, Amigo de Pex, Quien Devolvió a Otilia.

Títulos de clase:
Portaestandarte, Cantor del Alba, Auditor de Peligros.

Títulos de hazaña:
No Quemó la Panadería, Vencedor del Conejo Coronel.

Títulos infames:
Quemador de Bodegas, Firmante Imprudente, Sospechoso con Pluma.

### 18.2 Efectos
La mayoría cosméticos/sociales.
Algunos dan pequeñas bonificaciones contextuales.

Ejemplo:
Nombre de Villaclara:
+resistencia a Borrón dentro de Villaclara.
NPCs locales saludan distinto.

No Quemó la Panadería:
Descuento pequeño con Doña Marga. Título de prestigio espiritual.

## 19. Equipo y progresión de poder

El equipo debe complementar, no sustituir la clase.

Rangos de equipo:
Común.
Bueno.
Artesanal.
Raro.
Reliquia dormida.
Reliquia despierta.
Legendario.

Nivel mínimo de equipo:
Evitar restricciones duras excesivas. Mejor usar competencia/rango.

Reliquias:
- Pueden despertar por quests.
- Tienen personalidad o memoria.
- Pueden reaccionar al Nombre del jugador.
- No deben ser solo mejores stats.

Ejemplo:
Escudo de Aldea:
Común al inicio, puede despertar si se usa para proteger Villaclara.

## 20. Integración con quests

### 20.1 Quests de progresión
Cada clase debe tener pequeñas quests de identidad en nivel 1-20 y cadenas mayores tras especialización.

Ejemplos:
Bardo:
- Ayudar a Fennel.
- Cantar nombre de Otilia.
- Aprender Contraestrofa.

Inspector:
- Clasificar Sótano de Masa Viva.
- Detectar contrato falso.
- Usar Formulario 13-B contra Varo.
Arcanista:
- Analizar la gota del Cáliz sin provocar Sobrecarga.
- Identificar la línea solar entre el horno y el Pozo Cantante.
- Aprender a disipar tinta blanca mediante una fórmula de Alba templada.

Cocinero:
- Resolver incidente de gelatina.
- Preparar receta de memoria.
- Ganarse una mención de Nana.

### 20.2 Recompensas de clase por arco
Al completar El Pozo que Tarareaba Demasiado:
- Bardo: mejora de Canción de Nombre Propio.
- Clérigo: Sello de Verdad mejorado.
- Caballero: Juramento de Villaclara.
- Cartógrafo: Mapa del Primer Umbral.
- Invocado: Resonancia de Campana.
- Cocinero: Receta Bollo de Memoria Tibia.
- Inspector: Sello de Peligro Memético.
- Monje: Mantra contra el Borrón.
- Duelista: Técnica de Corte de Acta.
- Arcanista: Fórmula del Primer Umbral o Sello de Resonancia de Pozo.

## 21. Integración con reputación

Reputación puede desbloquear:
- Entrenadores.
- Talentos.
- Títulos.
- Descuentos.
- Rutas de especialización.
- Habilidades generales.

Ejemplo:
Capilla del Sol Quieto alta:
Clérigo aprende Liturgia de Nombre Verdadero antes.
Caballero obtiene Juramento del Umbral.

Caldero Feliz alta:
Cocinero desbloquea recetas avanzadas.
Cualquier clase aprende consumibles de buff.

Hermandad alta:
Invocado estabiliza Resonancia.
Sombrío obtiene protección social.

## 22. Integración con combate

Los progresos de clase deben alimentar recursos de combate:
- Caballero gana Juramento al defender NPCs con reputación positiva.
- Bardo gana Aplauso si usa título reconocido en zona.
- Cocinero obtiene ingredientes extra por bestiario.
- Arcanista gana Carga Arcana al alternar Corrientes y Concentración al estudiar fenómenos mágicos.
- Inspector gana Sellos si conoce criatura.
- Cartógrafo gana Tinta al descubrir sala.
- Invocado gana Resonancia ante anomalías.

Esto une mundo y combate.

## 23. Integración con Crónica Viva

La Crónica debe mostrar:
- Clase y especialización.
- Origen.
- Títulos.
- Rangos.
- Habilidades clave desbloqueadas por historia.
- Nombres protegidos.
- Reputaciones relevantes.

Ejemplo:
Jorge
Clase: Bardo de Crónica Viva, nivel 23.
Especialización: Cronista de Nombres.
Rango: Hierro.
Origen: Forastero de Procedencia Extravagante.
Títulos: Nombre de Villaclara, Amigo de Pex.
Crónicas ancladas: Otilia Cuerda, Pozo Cantante.

## 24. Multiclase

Recomendación: no implementar multiclase completa en fase 1. Es compleja y rompe balance.

Alternativa:
- Talentos cruzados.
- Habilidades generales.
- Profesiones.
- Especializaciones híbridas futuras.
- Entrenamiento menor con facciones.

Ejemplo:
Un Caballero puede aprender una canción menor por reputación con Fennel, pero no se convierte en Bardo.

Futuro:
Sistema de disciplinas secundarias a partir de nivel 40, con coste alto y límite estricto.

## 25. Reentrenamiento

### 25.1 Qué se puede cambiar
Habilidades activas seleccionables:
Sí, con instructor.

Talentos:
Sí, coste medio-alto.

Especialización:
Sí, solo mediante quest o ritual de gremio.

Atributos:
Reasignación parcial muy limitada.

Origen/trasfondo:
No, salvo evento excepcional.

### 25.2 Coste
Coste en soles, favor de gremio, tiempo o quest breve.

Tono:
El instructor no dice “respec”. Dice:
“Podemos desatar un hábito de tu Crónica, pero tendrás que escribir otro encima”.

## 26. Balance de roles

### 26.1 Roles principales
Tanque/protector:
Caballero, Inspector parcialmente, Monje evasivo.

Daño físico:
Duelista, Monje, Caballero ofensivo, Drakonita builds.

Daño mágico/luz:
Clérigo Exorcista, Invocado Resonante, Bardo ofensivo menor.

Soporte/curación:
Clérigo, Bardo, Cocinero, Monje Sanador.

Control:
Inspector, Bardo, Cartógrafo, Monje.

Exploración:
Cartógrafo, Inspector, Invocado.

Social:
Bardo, Duelista, Clérigo, Invocado.
Daño mágico/control arcano:
Arcanista de las Cinco Corrientes, Clérigo Exorcista, Invocado Resonante.

Crafting/preparación:
Cocinero, Inspector, Cartógrafo, Invocado Artesano.

### 26.2 Solo play
Todas las clases deben poder jugar solas.

Clases más fáciles solo:
Caballero, Monje, Clérigo, Duelista.

Intermedias:
Cocinero, Invocado, Inspector.

Más tácticas:
Bardo, Cartógrafo.

Para Bardo/Cartógrafo, asegurar daño básico viable y mascotas/aliados temporales opcionales.

## 27. Nivel 1: kit inicial por clase

Cada clase empieza con:
- 1 ataque básico temático.
- 1 habilidad defensiva/utilidad.
- 1 recurso de clase simple.
- 1 gancho de quest.

Caballero:
Golpe del Alba, Guardia Solar, Juramento.

Monje:
Puño Sereno, Respiración del Alba, Disciplina.

Cocinero:
Cucharazo, Snack Rápido, Ingredientes/Calor.

Cartógrafo:
Daga de Compás, Marcar Ruta, Tinta Viva.

Invocado:
Recuerdo Imposible, Apaño Urgente, Resonancia.

Clérigo:
Chispa Sanadora, Luz de Bolsillo, Devoción.

Duelista:
Estocada Limpia, Guardia de Salón, Estilo.

Inspector:
Inspeccionar Amenaza, Porra Reglamentaria, Sellos.

Bardo:
Copla Valiente, Nota Discordante, Voz/Aplauso.
Arcanista:
Chispa de Corriente, Escudo de Concentración, Concentración/Carga Arcana.

## 28. Comandos de personaje

Propuestos:
- ficha
- atributos
- habilidades
- habilidad [nombre]
- talentos
- aprender [habilidad/talento]
- entrenar
- clase
- especializacion
- origen
- titulos
- usar titulo [titulo]
- nivel
- progreso
- rango
- cronica personaje

Salida ejemplo de ficha:
Jorge
Nivel 12 — Rango Cobre alto
Clase: Inspector de Mazmorras
Origen: Aprendiz del Gremio
Trasfondo: Aprendiz de escriba
Pueblo: Humano de Altherion
Título activo: Cobre con Demasiada Iniciativa

Atributos:
FUE 5, DES 6, CON 8, ING 11, SAB 6, PRE 7, PER 9

Recursos:
Vida 120/120, Energía 14/14, Sellos 5/5

Reputaciones destacadas:
Villaclara +18, Gremio +22, Mazmorras Cívicas +14, Cámara atención 2 oculta.

## 29. Implementación técnica en Ranvier

### 29.1 Bundle recomendado
inheron-character

Subcarpetas:
- commands/character/
- data/races.yml
- data/origins.yml
- data/backgrounds.yml
- data/classes.yml
- data/specializations.yml
- data/skills/
- data/talents.yml
- data/titles.yml
- lib/CharacterBuilder.js
- lib/ProgressionManager.js
- lib/ClassManager.js
- lib/TitleManager.js
- lib/XPManager.js
- lib/TrainingManager.js

### 29.2 Datos de clase
Ejemplo:
```yaml
id: bardo_cronica_viva
name: Bardo de Crónica Viva
primaryAttributes: [presence, ingenuity, dexterity]
resource:
  primary: voice
  secondary: applause
  combo: stanza
roles: [support, control, memory]
startingSkills:
  - copla_valiente
  - nota_discordante
  - presentacion_impecable
specializations:
  - cantor_del_alba
  - bufon_de_mazmorra
  - cronista_de_nombres
```

### 29.3 Datos de origen
```yaml
id: local_villaclara
name: Local de Villaclara
reputation:
  villaclara: 10
startingClues:
  - rumor_pozo_canta_distinto
startingLocation: villaclara_plaza_alba_chica
introScene: intro_local_villaclara
```

### 29.4 Datos de título
```yaml
id: nombre_de_villaclara
name: Nombre de Villaclara
type: local
effects:
  zoneResistance:
    zone: villaclara
    state: borron_de_nombre
    value: 1
display: "$name, Nombre de Villaclara"
```

### 29.5 Guardado persistente
PlayerState debe incluir:
- race/pueblo.
- origin.
- background.
- class.
- specialization.
- level.
- xp.
- attributes.
- learned skills.
- talents.
- titles.
- active title.
- class resource modifiers.
- respec history.

## 30. Roadmap de implementación

### Fase A: Creación mínima
- Nombre.
- Pueblo/raza.
- Origen.
- Clase.
- Atributos por arquetipo.
- Nivel 1.
- Comando ficha.

### Fase B: Progresión 1-20
- XP.
- Subida de nivel.
- Habilidades 1-20.
- Talentos básicos.
- Rangos Cobre/Hierro.

### Fase C: Integración con Villaclara
- Orígenes locales.
- Títulos locales.
- Reputación inicial.
- Recompensas de arco.

### Fase D: Especializaciones 20+
- Elección de especialización.
- Habilidades 21-30.
- Primeras quests de especialización.

### Fase E: 31-60
- Completar habilidades.
- Rasgos heroicos.
- Habilidades legendarias.
- Integración con campañas grandes.

### Fase F: Pulido
- Reentrenamiento.
- Balance.
- UI textual.
- Herramientas admin.

## 31. Riesgos y soluciones

Riesgo: demasiadas clases al inicio.
Solución: implementar primero 4-5 clases piloto: Caballero, Clérigo, Duelista, Bardo, Cocinero. Luego Cartógrafo, Inspector, Monje, Invocado.

Riesgo: progresión 1-60 demasiado ambiciosa.
Solución: diseñar todo, implementar 1-20 primero.

Riesgo: especializaciones desequilibradas.
Solución: cada especialización debe mantener rol base y no duplicar completamente otra clase.

Riesgo: forastero planar rompe tono.
Solución: tratarlo siempre como fenómeno interno del lore, no como gag moderno. La lógica externa existe, pero Eryndor la interpreta con magia, memoria y burocracia.

Riesgo: talentos irrelevantes.
Solución: cada talento debe afectar combate, quests, exploración o reputación de forma visible.

Riesgo: exceso de números.
Solución: ofrecer arquetipos recomendados y builds iniciales.

## 32. Recomendación de fase 1 para Villaclara

Para fase 1 jugable, implementar:

Pueblos:
- Humano de Altherion.
- Humano de Arvell.
- Forastero planar.
- Sombrío errante.

Orígenes:
- Local de Villaclara.
- Aprendiz del Gremio.
- Forastero de Procedencia Extravagante.
- Peregrino de Candaluz.

Trasfondos:
- Cocinillas de emergencia.
- Aprendiz de escriba.
- Niño de campana.
- Mozo de cuadra.
- Aficionado a mapas.

Clases piloto:
- Caballero del Alba.
- Clérigo del Sol Quieto.
- Duelista de Academia.
- Bardo de Crónica Viva.
- Cocinero de Mazmorra.
- Arcanista de las Cinco Corrientes.

Rango máximo fase 1:
Nivel 20 / Hierro inicial.

Arco principal:
El Pozo que Tarareaba Demasiado.

## 33. Cierre

El sistema de personajes de InheronMUD debe hacer que cada jugador se sienta parte del mundo desde el primer comando. No queremos avatares intercambiables con números pegados encima. Queremos aventureros con nombre, origen, oficio, rarezas, reputación, títulos y memoria.

Cuando el jugador llegue a Villaclara, debe poder decir: “Soy alguien aquí”. Puede ser un forastero perdido, una barda con demasiada confianza, un clérigo que oye campanas raras, una cocinera capaz de freír un demonio menor o un caballero que aún no sabe a quién protegerá. Pero en todos los casos, su Crónica empieza antes del primer combate.

Y cuando el Canon del Mediodía intente borrar nombres, el sistema debe permitir que el jugador responda no solo con daño, sino con todo lo que ha construido: clase, historia, reputación, títulos, amigos, canciones, juramentos y una placa Cobre que quizá empezó siendo ridícula, pero ahora pesa como una promesa.

FIN DEL DOCUMENTO DE PERSONAJES, CLASES Y PROGRESIÓN
