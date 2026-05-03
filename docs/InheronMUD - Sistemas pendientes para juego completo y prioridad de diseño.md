# INHERONMUD — SISTEMAS PENDIENTES PARA UN JUEGO COMPLETO
## Hoja de ruta de diseño sistémico tras combate y quests

Documento de planificación. Objetivo: recoger los sistemas principales que debemos diseñar con el mismo nivel de detalle que el sistema de combate por turnos y el sistema de quests/arcos de historia, para convertir InheronMUD en un juego completo, coherente, inmersivo y disfrutable sobre Ranvier.

Estado actual de documentación avanzada:
- Sistema de combate por turnos: definido.
- Sistema de quests, arcos de historia y Crónica Viva: definido.
- Lore general de Eryndor: definido.
- Altherion: definido.
- Villaclara como hub inicial: definido.

Falta diseñar el resto de sistemas que sostendrán personaje, mundo, economía, exploración, NPCs, progresión y operación técnica.

## 1. Principio rector

InheronMUD no debe ser solo un MUD clásico con buen texto. Debe sentirse como un mundo vivo de fantasía isekai integrado en lore: gremios, rangos, skills, crónicas, cocina de mazmorra, reputación social, nombres que importan, NPCs que recuerdan, mazmorras con personalidad y sistemas suficientemente claros para jugar, pero suficientemente ricos para contar historias.

Cada sistema debe cumplir tres reglas:
1. Ser divertido de usar.
2. Tener sentido mecánico y estar balanceado.
3. Expresar el tono de Inheron: aventura luminosa, humor diegético, misterio de memoria y fantasía épica jugable.

## 2. Sistemas principales a diseñar

### 2.1 Sistema de personajes, clases y progresión 1-60

Prioridad: máxima.

Motivo:
Define quién es el jugador, cómo crece y qué espera desbloquear. Es el tercer pilar tras combate y quests.

Debe incluir:
- Creación de personaje.
- Razas y pueblos jugables.
- Orígenes: local de Villaclara, forastero planar, aprendiz de gremio, sombrío, exmiliciano, estudiante de Solazur, etc.
- Atributos iniciales.
- Clases base.
- Habilidades 1-60.
- Especializaciones o subclases.
- Talentos pasivos.
- Progresión vertical y horizontal.
- Reentrenamiento.
- Títulos.
- Relación entre nivel, rango de gremio y reputación.
- Desbloqueos por arcos de historia.

Preguntas clave:
- ¿Qué puede elegir el jugador al crear personaje?
- ¿Qué habilidades recibe cada clase entre nivel 21 y 60?
- ¿Cuándo se elige especialización?
- ¿Cómo evitamos builds inútiles?
- ¿Qué significa ser nivel 60 dentro del mundo?

Documento sugerido:
InheronMUD - Personajes, clases y progresión 1-60.

### 2.2 Sistema de exploración textual y salas interactivas

Prioridad: máxima.

Motivo:
El MUD vive o muere por sus habitaciones, descripciones, objetos examinables y secretos. Si el combate y las quests son el motor, la exploración es el suelo bajo las botas.

Debe incluir:
- Estructura de habitaciones.
- Descripciones variables por hora, clima, quest, reputación y estado del mundo.
- Objetos examinables.
- Comandos: mirar, examinar, buscar, escuchar, oler, tocar, empujar, abrir, cerrar, leer.
- Secretos y detección.
- Pistas ambientales.
- Interacciones con entorno.
- Puertas, llaves y mecanismos.
- Atajos.
- Salas vivas o cambiantes.
- Integración con combate y quests.

Ejemplos:
- El Pozo Cantante cambia de descripción de día y de noche.
- La panadería huele distinto si el sótano está activo.
- El archivo municipal muestra detalles solo si se usa una vela de Lúa o alta Percepción.

Documento sugerido:
InheronMUD - Sistema de exploración textual y salas interactivas.

### 2.3 Sistema de NPCs vivos, diálogos y rutinas

Prioridad: máxima.

Motivo:
Doña Marga, Hermana Lúa, Pex, Otilia y Silo deben sentirse como habitantes, no como postes con menú.

Debe incluir:
- Rutinas diarias.
- Disponibilidad por hora y estado de quest.
- Diálogos contextuales.
- Memoria del jugador.
- Afinidad personal.
- Secretos.
- Servicios.
- Relación con facciones.
- Diálogos ramificados.
- Rumores dinámicos.
- NPCs acompañantes temporales.
- Cambios emocionales según eventos.

Preguntas clave:
- ¿Qué recuerda cada NPC del jugador?
- ¿Qué diálogos cambian tras cada quest importante?
- ¿Cómo gestionamos NPCs fuera de horario?
- ¿Cómo evitamos que las rutinas molesten al jugador?

Documento sugerido:
InheronMUD - Sistema de NPCs vivos, diálogos y rutinas.

### 2.4 Sistema de reputación, facciones y memoria social

Prioridad: muy alta.

Motivo:
La reputación en Inheron no es solo una barra. Es lo que el mundo recuerda de ti. Encaja directamente con el tema de nombres, memoria y Canon del Mediodía.

Debe incluir:
- Reputación por zona.
- Reputación por facción.
- Afinidad personal con NPCs.
- Reputación oculta con enemigos.
- Atención de la Cámara del Mediodía.
- Estados sociales: confiable, sospechoso, héroe local, deudor, quemador de bodegas.
- Efectos en precios, diálogos, quests, ayuda y rumores.
- Memoria comunitaria.
- Títulos locales.
- Consecuencias reversibles e irreversibles.

Ejemplos:
- Villaclara alta: vecinos avisan de peligros y ofrecen descuentos.
- Doña Marga baja: pan más caro, sermones más largos.
- Cámara alta oculta: más contratos falsos, agentes vigilando.

Documento sugerido:
InheronMUD - Sistema de reputación, facciones y memoria social.

### 2.5 Sistema de inventario, equipo, loot y reliquias

Prioridad: alta.

Motivo:
El jugador necesita objetos interesantes, equipo claro y loot con identidad.

Debe incluir:
- Inventario.
- Peso o slots.
- Bolsas y contenedores.
- Equipo por ranuras.
- Armas, armaduras, instrumentos, herramientas, focos, reliquias.
- Rareza de objetos.
- Durabilidad.
- Reparación.
- Objetos de quest.
- Objetos recuerdo.
- Loot contextual.
- Botín grupal.
- Objetos con personalidad.
- Reliquias que despiertan.

Preguntas clave:
- ¿Usamos peso, slots o híbrido?
- ¿Cuánto castiga la durabilidad?
- ¿Cómo diferenciamos un objeto común de una reliquia narrativa?
- ¿Qué objetos no se pueden vender/destruir?

Documento sugerido:
InheronMUD - Sistema de inventario, equipo, loot y reliquias.

### 2.6 Sistema de crafting, cocina, alquimia y profesiones

Prioridad: alta.

Motivo:
El tono isekai de Inheron pide profesiones con sabor: cocina de mazmorra, cartografía, alquimia rural, inspección de mazmorras, crónicas, herboristería.

Debe incluir:
- Profesiones disponibles.
- Progresión de profesiones.
- Recetas.
- Ingredientes.
- Calidad.
- Experimentación.
- Fallos útiles o divertidos.
- Buffs.
- Encargos de NPCs.
- Integración con economía y quests.

Profesiones iniciales sugeridas:
- Cocina de mazmorra.
- Alquimia solar rural.
- Herrería ligera.
- Cartografía viva.
- Herboristería.
- Escritura de crónicas.
- Inspección de mazmorras.
- Cuidado de mascotas.

Documento sugerido:
InheronMUD - Sistema de crafting, cocina y profesiones.

### 2.7 Sistema de economía, tiendas y servicios

Prioridad: alta.

Motivo:
Los hubs necesitan vida económica. Villaclara debe tener tiendas útiles, precios con sentido y servicios que reaccionen al jugador.

Debe incluir:
- Moneda.
- Precios base.
- Stock por tienda.
- Descuentos por reputación.
- Servicios: curación, reparación, identificación, descanso, transporte, entrenamiento.
- Compra/venta de loot.
- Contratos de gremio.
- Mercado ambulante.
- Economía local afectada por quests.
- Objetos raros de aparición limitada.

Ejemplos:
- Pan más barato si ayudas a Doña Marga.
- Herrería con descuento si reparas el puente.
- La Cesta Serena vende mapas sospechosos solo con confianza alta.

Documento sugerido:
InheronMUD - Sistema de economía, tiendas y servicios.

### 2.8 Sistema de descanso, viaje, tiempo y calendario

Prioridad: alta.

Motivo:
El tiempo estructura el mundo. Algunas quests deben ocurrir de noche, ciertos NPCs deben moverse y los viajes deben tener peso sin ser tediosos.

Debe incluir:
- Hora del día.
- Días y calendario local.
- Eventos de mañana/tarde/noche.
- Descanso corto y largo.
- Posadas.
- Campamentos.
- Fatiga.
- Viajes entre zonas.
- Rutas desbloqueables.
- Encuentros de viaje controlados.
- Clima regional.
- Eventos de feria, mercado y festividades.

Ejemplos:
- El Pozo Cantante solo canta de noche.
- Las Tías del Mantel Blanco se reúnen al mediodía.
- Varo trabaja en el archivo de noche.

Documento sugerido:
InheronMUD - Sistema de tiempo, descanso, viaje y calendario.

### 2.9 Sistema de mazmorras, instancias y encuentros especiales

Prioridad: alta.

Motivo:
El Sótano de Masa Viva, Verdanza, Criptas de Luminara y otras zonas necesitan reglas de dungeon claras.

Debe incluir:
- Mazmorras estáticas.
- Mazmorras vivas.
- Mazmorras móviles.
- Instancias por jugador o party.
- Respawn.
- Bosses.
- Puzzles.
- Trampas.
- Cofres.
- Secretos.
- Eventos internos.
- Guardado de progreso.
- Dificultad.
- Recompensas.
- Objetivos no letales.

Documento sugerido:
InheronMUD - Sistema de mazmorras, instancias y encuentros especiales.

### 2.10 Sistema de bestiario y conocimiento de monstruos

Prioridad: media-alta.

Motivo:
El Archivo de Monstruos puede convertir cada criatura en conocimiento, recompensas y progreso. Ideal para MUD textual.

Debe incluir:
- Registro de criaturas.
- Fichas de monstruos.
- Debilidades descubiertas.
- Loot conocido.
- Comportamientos observados.
- Recompensas por información.
- Captura no letal.
- Variantes raras.
- Comentarios de NPCs.
- Integración con Cartógrafo, Inspector y Cocinero.

Ejemplo:
Descubrir que el slime de mermelada puede distraerse con pan duro desbloquea táctica y receta.

Documento sugerido:
InheronMUD - Sistema de bestiario y conocimiento de monstruos.

### 2.11 Sistema de diálogo social y resolución no violenta

Prioridad: media-alta.

Motivo:
La Cámara, Otilia, nobleza, juicios y facciones necesitan herramientas sociales más allá de hablar y aceptar quest.

Debe incluir:
- Persuadir.
- Intimidar.
- Mentir.
- Negociar.
- Inspirar.
- Bromear.
- Etiqueta noble.
- Testimonios.
- Juicios.
- Duelos verbales.
- Canciones bardas como acciones sociales.
- Costes y riesgos.
- Tiradas o resolución por atributos.
- Modificadores por reputación.

Documento sugerido:
InheronMUD - Sistema social, diálogos avanzados y resolución no violenta.

### 2.12 Sistema de mascotas, familiares y acompañantes

Prioridad: media.

Motivo:
Muy adecuado para el tono isekai y el apego emocional. Pex puede ser el primer test.

Debe incluir:
- Mascotas cosméticas.
- Mascotas útiles.
- Familiares de clase.
- Slimes domesticables.
- Zorros solares.
- Mini-dracos.
- Ardillas dimensionales.
- Vínculo.
- Alimentación.
- Entrenamiento.
- Personalidad.
- Habilidades menores.
- Participación en quests.

Documento sugerido:
InheronMUD - Sistema de mascotas, familiares y acompañantes.

### 2.13 Sistema de mapas, navegación y cartografía

Prioridad: media.

Motivo:
Necesario para que el jugador no se pierda, especialmente en un MUD textual con zonas ricas.

Debe incluir:
- Mapa textual.
- Regiones.
- Rutas.
- Atajos.
- Zonas descubiertas.
- Lugares ocultos.
- Mapas que cambian.
- Mapas falsos.
- Cartografía de mazmorras.
- Marcadores diegéticos.
- Comandos: mapa, rutas, viajar, marcar.
- Sinergia con Cartógrafo Vivo.

Documento sugerido:
InheronMUD - Sistema de mapas, navegación y cartografía.

### 2.14 Sistema de correo, tablones, rumores y noticias

Prioridad: media.

Motivo:
Da vida persistente al mundo y alimenta quests, eventos, facciones y economía.

Debe incluir:
- Tablones por pueblo.
- Contratos de gremio.
- Rumores.
- Cartas de NPCs.
- Mensajes del gremio.
- Avisos de facción.
- Noticias regionales.
- Contratos falsos.
- Eventos dinámicos.
- Actualización por progreso.

Documento sugerido:
InheronMUD - Sistema de tablones, correo, rumores y noticias.

### 2.15 Sistema de logros, títulos y crónicas personales

Prioridad: media.

Motivo:
Refuerza identidad del jugador y memoria del mundo.

Debe incluir:
- Títulos locales.
- Hazañas.
- Recuerdos.
- Crónicas.
- Apodos de NPCs.
- Reconocimientos de gremio.
- Marcas de historia.
- Registro de decisiones.
- Cosméticos textuales.

Ejemplos:
- Nombre de Villaclara.
- Amigo de Pex.
- Quien Devolvió a Otilia.
- Cobre con Demasiada Iniciativa.
- No Quemó la Panadería.

Documento sugerido:
InheronMUD - Sistema de logros, títulos y crónicas personales.

### 2.16 Sistema de muerte, derrota y recuperación

Prioridad: alta.

Motivo:
Hay que definirlo pronto para equilibrar combate, quests, economía y frustración.

Debe incluir:
- Derrota sin muerte permanente.
- Rescate por aliados.
- Despertar en capilla o posada.
- Pérdida leve de durabilidad, monedas o tiempo.
- Heridas temporales.
- Consecuencias narrativas si fallas misión.
- Recuperación por Clérigo o Capilla.
- Protección especial en niveles bajos.

Regla sugerida:
La derrota debe abrir historia o enseñar táctica, no borrar horas de progreso.

Documento sugerido:
InheronMUD - Sistema de muerte, derrota y recuperación.

### 2.17 Sistema de party, cooperación y roles

Prioridad: media-alta.

Motivo:
Ranvier soporta multijugador y el combate ya prevé roles. Necesitamos soporte de grupo sólido.

Debe incluir:
- Crear party.
- Invitar/expulsar.
- Compartir quests.
- Compatibilidad de progreso.
- Loot compartido.
- Roles.
- Amenaza.
- Marcas de objetivo.
- Comandos de grupo.
- Escenas compartidas.
- Mentores de bajo nivel.
- Escalado de encuentros.

Documento sugerido:
InheronMUD - Sistema de party, cooperación y roles.

### 2.18 Sistema de administración, herramientas de diseño y debug

Prioridad: muy alta para desarrollo.

Motivo:
No es vistoso, pero evitará sufrimiento. Sin herramientas, cada bug será una mazmorra sin loot.

Debe incluir:
- Comandos admin.
- Crear/editar NPC.
- Ver flags.
- Reset quest.
- Dar item.
- Forzar evento.
- Spawn enemigo.
- Ver estado de arco.
- Debug de combate.
- Debug de diálogo.
- Debug de reputación.
- Validación de YAML/JSON.
- Herramientas para importar contenido.

Documento sugerido:
InheronMUD - Herramientas admin, debug y pipeline de contenido.

## 3. Prioridad recomendada para ponernos a ello

Orden recomendado de diseño e implementación:

1. Personajes, clases y progresión 1-60.
2. Exploración textual y salas interactivas.
3. NPCs vivos, diálogos y rutinas.
4. Reputación, facciones y memoria social.
5. Inventario, equipo, loot y reliquias.
6. Muerte, derrota y recuperación.
7. Crafting, cocina y profesiones.
8. Mazmorras, instancias y encuentros especiales.
9. Economía, tiendas y servicios.
10. Tiempo, descanso, viaje y calendario.
11. Bestiario y conocimiento de monstruos.
12. Party, cooperación y roles.
13. Sistema social avanzado y resolución no violenta.
14. Mapas, navegación y cartografía.
15. Tablones, correo, rumores y noticias.
16. Logros, títulos y crónicas personales.
17. Mascotas, familiares y acompañantes.
18. Herramientas admin, debug y pipeline de contenido.

Nota:
Aunque herramientas admin aparece al final como documento, conviene implementarlas en paralelo desde muy temprano. Nadie quiere depurar una quest de memoria sagrada a mano con una vela y tres comandos rotos.

## 4. Prioridad para el siguiente documento

Recomendación principal:
Crear ahora el documento de Personajes, clases y progresión 1-60.

Por qué:
- Combate ya necesita las clases completas.
- Quests pueden apoyarse en trasfondos y habilidades.
- Villaclara necesita saber qué opciones tendrá un jugador nuevo.
- Las recompensas de arcos deben poder desbloquear habilidades, títulos o talentos.
- El balance de nivel 1-20 debe encajar con una visión de nivel 60.

Contenido esperado del siguiente documento:
- Creación de personaje.
- Razas/pueblos jugables iniciales.
- Orígenes y trasfondos.
- Atributos iniciales.
- Clases base.
- Habilidades 1-60 por clase.
- Especializaciones por clase.
- Talentos generales.
- Relación con rangos de gremio.
- Curva de XP.
- Reentrenamiento.
- Títulos y progresión horizontal.
- Integración con quests, reputación y combate.

## 5. Cierre

Con combate y quests ya definidos, InheronMUD tiene dos pulmones. Lo siguiente es darle esqueleto, sangre y costumbres raras: personajes, exploración, NPCs, reputación, objetos, mazmorras, economía y tiempo.

El objetivo no es documentar por documentar. Es que cada sistema empuje la misma fantasía:
Un jugador llega a Villaclara como aventurero Cobre, forastero, aprendiz o buscavidas. Compra pan, conoce vecinos, persigue un slime ladrón, aprende a pelear, se gana un nombre, descubre que el pueblo recuerda más de lo que dice y termina defendiendo su lugar en una crónica que el Canon del Mediodía quiere borrar.

Cuando todos estos sistemas hablen entre sí, InheronMUD dejará de ser un proyecto y empezará a respirar.

FIN DEL DOCUMENTO DE SISTEMAS PENDIENTES
