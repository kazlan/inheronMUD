---
title: "INHERONMUD — SISTEMA DE MAZMORRAS, INSTANCIAS Y ENCUENTROS ESPECIALES"
---

# INHERONMUD — SISTEMA DE MAZMORRAS, INSTANCIAS Y ENCUENTROS ESPECIALES
## Diseño detallado para dungeons vivas, instancias, puzzles, trampas, bosses y recompensas en Ranvier

Documento de diseño sistémico. Objetivo: definir cómo funcionarán las mazmorras de InheronMUD: espacios peligrosos, explorables, memorables, reactivos y narrativamente integrados. Las mazmorras deben ser más que habitaciones con enemigos. Deben tener identidad, reglas internas, estados, secretos, objetivos, encuentros especiales, loot contextual, rutas alternativas, interacción con clases y consecuencias en el mundo.

Stack previsto: Ranvier / Node.js.
Mazmorra inicial de referencia: Sótano de Masa Viva, bajo la Panadería Panbendito de Villaclara.
Sistemas relacionados: exploración textual, combate por turnos, quests/arcos, inventario/loot/reliquias, NPCs, reputación, tiempo/calendario, bestiario, crafting, WorldState y Crónica Viva.

## 1. Principios de diseño

### 1.1 Una mazmorra debe tener personalidad

Cada dungeon debe responder a una pregunta de identidad: ¿qué es este lugar y por qué importa?

No basta con “cueva nivel 6”. En Inheron queremos:
- Sótano de Masa Viva: panadería antigua que respira y fermenta recuerdos.
- Archivo que muerde: documentos vivos, tinta blanca y actas falsas.
- Cripta solar: juramentos enterrados y luz que juzga demasiado recta.
- Verdanza Caída: ciudad espejo donde las rutas no quieren coincidir.

La personalidad debe afectar:
- Descripciones.
- Enemigos.
- Trampas.
- Puzzles.
- Loot.
- Rasgos de combate.
- Música/sonido textual.
- Reloj de dungeon.
- Consecuencias.

### 1.2 La mazmorra debe enseñar, no solo castigar

El primer nivel de una dungeon debe enseñar su lenguaje:
- Qué peligros existen.
- Cómo se detectan.
- Qué herramientas ayudan.
- Qué clases brillan.
- Qué errores duelen.

Ejemplo:
Antes de que el Sótano de Masa Viva tenga una sala que cambia de forma, debe mostrar pequeñas señales: paredes blandas, olor a levadura, pasillos que parecen más largos al volver.

### 1.3 Objetivos más allá de matar

Las mazmorras deben tener objetivos variados:
- Explorar.
- Sellar.
- Rescatar.
- Recuperar objeto.
- Proteger NPC.
- Cartografiar.
- Sobrevivir rondas.
- Resolver puzzle.
- Capturar criatura.
- Purificar foco.
- Negociar con entidad.
- Despertar o contener reliquia.

Esto permite que clases como Cartógrafo, Inspector, Bardo, Arcanista, Clérigo y Cocinero tengan protagonismo real.

### 1.4 Riesgo controlado, no frustración

Las mazmorras deben ser peligrosas, pero legibles. Los peligros fuertes deben tener señales. Las trampas críticas deben poder detectarse, evitarse, resistirse o resolverse después.

Regla:
Nunca ocultar una muerte casi segura detrás de una única tirada fallida sin pista previa.

### 1.5 La exploración debe importar

Buscar, examinar, escuchar, oler, tocar, usar herramientas y leer el entorno deben dar ventajas reales:
- Evitar trampa.
- Empezar combate con ventaja.
- Encontrar atajo.
- Mejorar loot.
- Desbloquear ruta no violenta.
- Reducir reloj de peligro.
- Hallar pista de quest.

### 1.6 Las dungeons conectan con la Crónica

Una dungeon importante debe dejar recuerdos:
- Primer descenso.
- Boss derrotado.
- NPC rescatado.
- Reliquia despertada.
- Sala recordada.
- Error memorable, como “la vez que la harina explotó”.

La Crónica Viva debe registrar logros, secretos, rutas y consecuencias.

## 2. Tipos de mazmorras

### 2.1 Mazmorra estática

Estructura fija. Ideal para ruinas, criptas, fortalezas, túneles antiguos.

Ventajas:
- Fácil de diseñar.
- Buena para puzzles persistentes.
- Mapeo claro.

Ejemplo:
Cripta de San Orencio.

### 2.2 Mazmorra viva

Tiene comportamiento orgánico o voluntad parcial. Cambia por reloj, estados o acciones.

Ejemplo:
Sótano de Masa Viva.

Rasgos:
- Salas que respiran.
- Rutas que cambian.
- Peligros por fermentación.
- Respuesta a comida, calor, agua o magia.

### 2.3 Mazmorra móvil

Puede desplazarse, aparecer/desaparecer o cambiar entrada.

Ejemplo:
Panadería cuya bodega tiene más escalones de los permitidos por arquitectura sensata.

Uso:
Ideal para eventos, rotaciones y quests.

### 2.4 Mazmorra de memoria

Sus salas dependen de recuerdos, nombres, Crónica o interferencia de la Cámara.

Rasgos:
- Descripciones alteradas.
- NPCs recordados.
- Salas antiguas.
- Objetos que existen solo si alguien los recuerda.

Ejemplo:
Cámara del Pozo Cantante, fases del Guardián.

### 2.5 Mazmorra espejo

Asociada a Verdanza, reflejos o rutas invertidas.

Rasgos:
- Salidas que cambian vistas en agua/espejos.
- Dobles.
- Puzzles de simetría.
- Riesgo de identidad.

### 2.6 Mazmorra administrativa

Peligro documental, legal o de Cámara.

Rasgos:
- Actas vivas.
- Contratos trampa.
- Puertas que exigen nombre.
- Enemigos escribas.
- Trampas de firma.

Ejemplo:
Archivo municipal alterado.

### 2.7 Instancia de evento

Dungeon breve, creada para evento o quest puntual.

Ejemplo:
Incidente de Feria: Carpa de Confeti Hostil.

### 2.8 Raid o mazmorra mayor futura

Contenido de party grande o multi-grupo. No fase 1, pero conviene reservar diseño.

Ejemplo:
Cámara del Mediodía Inmóvil, Cripta del Trono de Nadie.

## 3. Anatomía de una dungeon

### 3.1 Campos principales

ID:
dungeon_sotano_masa_viva.

Nombre visible:
Sótano de Masa Viva.

Tipo:
viva, tutorial, rural, dungeon menor.

Zona:
Villaclara.

Nivel recomendado:
4-8 inicial, escalable en niveles inferiores.

Rango recomendado:
Cobre.

Tamaño:
Mini, pequeña, media, grande, épica.

Modo:
abierta, instanciada, híbrida.

Objetivo principal:
Recuperar cucharas, colocar sellos, descubrir grieta, derrotar Masa Madre Menor.

Objetivos secundarios:
No quemar bodega, recuperar ingredientes, cartografiar ruta, capturar slime.

Boss:
Masa Madre Menor.

Reloj de dungeon:
Fermentación.

Facciones/NPCs:
Doña Marga, Pex, Mazmorras Cívicas.

Conexiones de quest:
Pex y las cucharas desaparecidas, Inspección pedagógicamente contundente, El Pozo que Tarareaba Demasiado.

Loot destacado:
Levadura viva, gel frutal, harina lunar, Cuchara de Pex, posible reliquia menor.

### 3.2 Estados de dungeon

Bloqueada:
No accesible.

Descubierta:
Entrada encontrada.

Activa:
Puede explorarse.

En progreso:
Jugador/party tiene instancia o estado activo.

Limpia parcialmente:
Boss o amenaza menor derrotada.

Sellada:
Temporalmente segura.

Alterada:
Cambió por quest, reloj o facción.

Corrompida:
Afectada por Cámara/Sombra/Verdanza.

Recordada:
Registrada y estabilizada por Crónica.

### 3.3 Estados de sala dentro de dungeon

Inexplorada.
Explorada.
Limpiada.
Sellada.
Alterada.
Colapsada.
Respirando.
Corrompida.
Recordada.

Cada estado puede modificar descripción, enemigos, salidas y loot.

## 4. Instanciación

### 4.1 Por qué instanciar

En un MUD multijugador, las mazmorras pueden generar conflictos:
- Un jugador mata boss antes que otro.
- Objetos de quest desaparecen.
- Puzzles quedan resueltos para todos.
- Consecuencias globales se pisan.

Instancias permiten experiencia narrativa controlada.

### 4.2 Tipos de instancia

Personal:
Solo jugador. Útil para escenas de historia.

Party:
Grupo comparte progreso temporal. Recomendado para dungeons normales.

Pública:
Zona común con respawn. Útil para campos, caminos y eventos sociales.

Híbrida:
Entrada pública, interiores instanciados por party.

### 4.3 Recomendación fase 1

Sótano de Masa Viva:
Híbrido.
- Entrada visible en panadería.
- Interior instanciado por jugador/party.
- Consecuencias principales por jugador/party.
- Estado comunitario de “descubierto” puede mostrarse según progreso.

Campo Norte:
Público.

Cámara del Pozo:
Personal/party por quest.

### 4.4 Creación de instancia

Se crea cuando:
- Jugador entra en dungeon instanciada.
- Party leader entra y miembros aceptan.
- Quest inicia evento de dungeon.

Datos de instancia:
- instanceId.
- dungeonId.
- owner player/party.
- createdAt.
- level scaling.
- seed.
- room states.
- enemies alive/dead.
- boss state.
- dungeon clock.
- loot claimed.
- quest flags.

### 4.5 Persistencia de instancia

Mini dungeon:
Persistir 30-60 minutos tras salida.

Dungeon de quest:
Persistir hasta completar quest o reset manual.

Boss encounter:
Persistir durante sesión/party, con recuperación si desconexión breve.

### 4.6 Reset

Tipos:
- Reset voluntario.
- Reset por tiempo.
- Reset por derrota.
- Reset por completar.

Regla:
Objetos de quest no deben perderse por reset injusto.

## 5. Escalado de dificultad

### 5.1 Escalado por nivel

Dungeons tienen rango recomendado. Pueden escalar dentro de límites.

Ejemplo:
Sótano nivel 1:
Rango 4-8.
Si jugador nivel 12 entra tarde, enemigos pueden subir algo, pero no debe convertirse en contenido nivel 12 completo si es tutorial.

### 5.2 Escalado por party

Variables:
- Número de jugadores.
- Roles presentes.
- Nivel medio.
- Rango de Gremio.

Escalado:
- Más vida en enemigos elite/boss.
- Adds adicionales.
- Mecánicas de cooperación.
- Loot adicional.

Evitar:
Solo inflar vida hasta convertir boss en pan duro con barras.

### 5.3 Modos de dificultad futuros

Normal:
Experiencia narrativa.

Veterano:
Más mecánicas, mejor loot.

Heroico:
Bosses con fases completas, recompensas de título.

Leyenda:
Contenido endgame, no fase 1.

## 6. Reloj de dungeon

### 6.1 Concepto

El reloj mide presión interna. Avanza con acciones lentas, descanso, ruido, fallos o decisiones. No debe presionar siempre, pero sí dar sensación de lugar vivo.

### 6.2 Tipos de reloj

Fermentación:
Sótano de Masa Viva. La masa crece, rutas cambian, aparecen slimes.

Alarma:
Fortalezas, campamentos, archivos vigilados.

Corrupción:
Cámara/Sombra/Verdanza alteran salas.

Inundación:
Marea, alcantarillas, pozos.

Derrumbe:
Ruinas inestables.

Atención:
Antagonista observa al jugador.

### 6.3 Niveles de reloj

0: estable.
1: señales menores.
2: peligro leve.
3: cambios de sala.
4: encuentro o trampa.
5: evento fuerte.
6: boss potenciado o consecuencia.

### 6.4 Cómo avanza

Acciones que pueden avanzar:
- Buscar exhaustivamente.
- Fallar trampa.
- Hacer mucho ruido.
- Usar Brasa en lugar sensible.
- Descansar dentro.
- Activar ritual.
- Llevar objeto inestable.
- Repetir ruta en mazmorra viva.

Acciones que pueden reducir o estabilizar:
- Sellos de Inspector.
- Tiza de Mazmorra Cívica.
- Arcanista usa Matriz de Contención.
- Cartógrafo fija ruta.
- Bardo canta Crónica de Lugar.
- Clérigo bendice sala.
- Cocinero alimenta/neutraliza masa.

### 6.5 Ejemplo Sótano de Masa Viva

Reloj: Fermentación.

Nivel 0:
La masa duerme.

Nivel 1:
Paredes tibias, olor a levadura.

Nivel 2:
Aparece suelo pegajoso en una sala.

Nivel 3:
Una salida cambia o se cierra con masa.

Nivel 4:
Encuentro: Slime de Mermelada o Hada de Harina irascible.

Nivel 5:
La Masa Madre Menor gana regeneración.

Nivel 6:
Evento: la bodega intenta subir hasta la panadería. Doña Marga se enfada con la realidad.

## 7. Estructura de salas en dungeon

### 7.1 Tipos de sala

Entrada:
Presenta reglas y tono.

Conector:
Sala de navegación, puede tener pistas o peligros leves.

Encuentro:
Combate o conflicto.

Puzzle:
Mecanismo, receta, campanas, símbolos, memoria.

Tesoro:
Loot, cofre, ingrediente, reliquia.

Descanso seguro:
Zona de respiro, limitada.

Atajo:
Conecta rutas tras desbloqueo.

Sala de historia:
Revela lore o pista.

Evento:
Secuencia especial.

Boss:
Clímax mecánico.

Salida:
Retorno o conexión a nueva zona.

### 7.2 Densidad

Mini dungeon:
3-5 salas.

Pequeña:
6-10 salas.

Media:
11-20 salas.

Grande:
20-40 salas.

Épica:
40+, dividida en alas/instancias.

Fase 1:
Sótano de Masa Viva nivel 1 debe tener 7-9 salas.

### 7.3 Rutas

Lineal con ramas:
Ideal tutorial.

Red compacta:
Buena para exploración.

Ala múltiple:
Dungeons grandes.

Cambiante:
Mazmorras vivas/espejo.

### 7.4 Salas significativas

Evitar pasillos sin función. Si hay pasillo, que tenga:
- Sonido.
- Pista.
- Trampa.
- Bifurcación.
- Línea ambiental.
- Rasgo de reloj.

## 8. Trampas y peligros

### 8.1 Principios

Las trampas deben ser legibles, detectables y justas. No son castigo arbitrario: son diálogo entre jugador y entorno.

### 8.2 Tipos de trampa

Mecánica:
Pinchos, losas, puertas, poleas.

Arcana:
Sellos, runas, Corrientes.

Orgánica:
Esporas, masa, raíces, slimes.

Social/documental:
Firmas, contratos, actas.

Memoria:
Borrón, nombre falso, recuerdo hostil.

Espejo:
Reflejos, inversión de salidas.

### 8.3 Estados de trampa

Oculta.
Sospechosa.
Detectada.
Desactivada.
Activada.
Rearmada.
Convertida.

### 8.4 Resoluciones

Detectar:
Percepción, Inspector, Cartógrafo, Arcanista, examinar, buscar.

Desactivar:
Ingenio, herramientas, sellos, magia.

Evitar:
Destreza, ruta alternativa, vuelo/teleporte futuro.

Resistir:
Constitución, Sabiduría, defensa.

Convertir:
Inspector o Arcanista la usa contra enemigos.

### 8.5 Ejemplos fase 1

Saco de Harina Suspicioso:
Trampa orgánica. Si se toca mal, nube de harina, Cegado o Hada de Harina.

Losa Fermentada:
Suelo pegajoso que aplica Pegajoso y avanza reloj.

Contrato Clavado en la Pared:
Trampa documental menor. Si se firma, Juramento Falso leve.

Horno Antiguo:
Peligro de Brasa. Puede cocinar, explotar harina o purificar masa.

## 9. Puzzles

### 9.1 Principios

Un puzzle debe tener:
- Objetivo claro.
- Pistas cercanas.
- Feedback por intento.
- Alternativas por clase/herramienta.
- No bloquear indefinidamente contenido crítico.

### 9.2 Tipos de puzzle

Secuencia:
Campanas, símbolos, hornos, palancas.

Interpretación:
Leer mapa, acta, poema, receta.

Entorno:
Mover objetos, usar agua/fuego/luz.

Social:
Convencer, testificar, recordar nombres.

Clase:
Especial para Cartógrafo, Inspector, Arcanista, Bardo, Cocinero.

Receta:
Ingredientes y pasos correctos.

Memoria:
Recordar orden de eventos o nombres.

### 9.3 Fallos

Un fallo debe producir:
- Pista adicional.
- Avance de reloj.
- Daño leve.
- Encuentro menor.
- Cambio de sala.

No debe ser simplemente “incorrecto”.

### 9.4 Ejemplo: Horno de Tres Temperaturas

Objetivo:
Estabilizar puerta de masa.

Pistas:
- Olor a levadura agria.
- Marca de Brasa en pared.
- Nota de Doña Marga: “No todo lo caliente cocina. Algunas cosas solo presumen”.

Soluciones:
- Cocinero ajusta temperatura.
- Arcanista usa Marea/Alba para templar.
- Inspector coloca sello de seguridad.
- Buscar revela válvula.

Fallo:
Harina en suspensión + calor = pequeña explosión y reloj +1.

## 10. Encuentros especiales

### 10.1 Definición

Encuentro especial es una escena jugable con reglas propias. Puede incluir combate, puzzle, protección, negociación o escape.

### 10.2 Tipos

Protección:
Defender NPC, objeto o ritual.

Persecución:
Atrapar Pex, slime dorado, ladrón de actas.

Escape:
Salir antes de derrumbe, fermentación o alarma.

Ritual:
Mantener sellos, cantar, canalizar Corrientes.

Juicio/documental:
Argumentar, presentar pruebas, resistir actas falsas.

Boss no letal:
Convencer o contener entidad.

### 10.3 Ejemplo: Pex en fuga

Inicio:
Pex roba una cuchara y se desliza hacia la trampilla.

Objetivo:
Seguirlo sin asustarlo.

Opciones:
- Hablar suavemente.
- Usar pan.
- Cortarle paso.
- Dejar que Bimba traduzca.
- Gritar. Mala idea.

Resultados:
- Amable: Pex ayuda en boss.
- Brusco: Pex se esconde, dungeon más difícil.
- Muy brusco: Doña Marga juzga en silencio. Peor que daño psíquico.

## 11. Bosses de dungeon

### 11.1 Principios

Un boss debe tener:
- Identidad clara.
- Mecánica central.
- Telegrafías.
- Fases.
- Interacción con entorno.
- Contra-juego por clases.
- Recompensas narrativas.
- Posible resolución alternativa si encaja.

### 11.2 Fases

Fase 1:
Presenta mecánica.

Fase 2:
Complica o añade presión.

Fase 3:
Clímax, decisión, remate o prueba.

No todos los bosses necesitan 3 fases. Mini-boss puede tener 1-2.

### 11.3 Telegrafía

Ejemplo:
“La Masa Madre Menor se hincha y las grietas del suelo exhalan levadura caliente. Parece que absorberá migas al final de la ronda”.

### 11.4 Contra-juego

Debe haber opciones:
- Defender.
- Interrumpir.
- Usar entorno.
- Cambiar posición.
- Sellar sala.
- Consumir objeto.
- Usar clase.

### 11.5 Boss inicial: Masa Madre Menor

Nivel recomendado: 6-8.
Tipo: masa viva/orgánica/dungeon.
Rol: tutorial de boss vivo.

Fase 1: La Masa Aprende
Habilidades:
- Golpe de Masa: daño contundente.
- Pegote Fermentado: aplica Pegajoso.
- Absorber Migas: se cura si hay restos activos.

Mecánica:
Limpiar migas, usar sal/agua clara, distraer con pan duro o sellar grietas.

Fase 2: División Dulce
Al 40%, se divide en dos masas menores.
Si no se derrotan o separan, se recombinan.

Opciones por clase:
- Cocinero: estabiliza fermento.
- Arcanista: descarga Marea/Alba.
- Inspector: sella grieta.
- Bardo: calma patrón rítmico.
- Caballero: protege a NPC/retaguardia.
- Monje: interrumpe Absorber Migas.
- Cartógrafo: marca grietas activas.
- Clérigo: purifica masa corrupta.
- Duelista: remata masa menor.
- Invocado: improvisa herramienta absurda pero válida.

Recompensas:
- Levadura viva.
- Receta de Bollo de Memoria Tibia, si condición.
- Cuchara de Pex, recuerdo.
- Reputación con Doña Marga/Mazmorras Cívicas.

## 12. Respawn y persistencia

### 12.1 Respawn por tipo

Enemigos menores:
Pueden respawnear tras reset o reloj.

Elites:
Respawn limitado por instancia.

Bosses:
No respawn en instancia completada, salvo modo repetible.

Recursos:
Respawn por tiempo o instancia.

Cofres:
Una vez por instancia/player.

### 12.2 Respawn narrativo

No decir simplemente “ha respawneado”.

Ejemplo:
“Una nueva burbuja de mermelada se desprende de la pared. La mazmorra parece producir problemas en lotes pequeños”.

### 12.3 Limpieza permanente

Al completar una dungeon de quest, algunas salas pueden quedar seguras o alteradas.

Ejemplo:
Tras sellar primer nivel del Sótano, la entrada queda segura para Doña Marga, pero niveles inferiores siguen respirando.

## 13. Loot y recompensas de dungeon

### 13.1 Tipos

Loot de enemigos.
Cofres.
Ingredientes.
Materiales.
Objetos de quest.
Reliquias.
Recuerdos.
Títulos.
Reputación.
Bestiario.
Acceso a ruta.
Desbloqueo de servicio.

### 13.2 Cofres y contenedores

Tipos:
- Cofre normal.
- Cofre sellado.
- Saco de ingredientes.
- Estantería antigua.
- Altar.
- Masa con cosas dentro. Técnicamente no cofre. Jurídicamente debatible.

### 13.3 Recompensa por exploración

Premiar:
- Encontrar secretos.
- No activar trampas.
- Cartografiar.
- Capturar criaturas.
- Resolver puzzle limpio.
- Completar objetivo opcional.

### 13.4 Recompensa por limpieza de dungeon

Ejemplo Sótano fase 1:
- XP.
- Reputación Villaclara.
- Reputación Mazmorras Cívicas.
- Descuento o comida de Doña Marga.
- Acceso a nivel inferior futuro.
- Entrada de Crónica.

## 14. Mazmorras y clases

### 14.1 Caballero

Función:
Proteger, mantener línea, soportar trampas físicas, defender NPCs.

Interacciones:
- sostener puerta.
- cubrir retirada.
- jurar guardia.
- activar reliquia defensiva.

### 14.2 Monje

Función:
Movilidad, equilibrio, interrupciones, calma.

Interacciones:
- cruzar zonas frágiles.
- escuchar vibraciones.
- meditar para reducir reloj.

### 14.3 Cocinero

Función:
Ingredientes, masas, slimes, buffs, lectura culinaria.

Interacciones:
- estabilizar fermento.
- cocinar señuelos.
- extraer ingredientes de calidad.

### 14.4 Cartógrafo

Función:
Mapeo, rutas, atajos, salas móviles.

Interacciones:
- fijar ruta.
- detectar sala falsa.
- crear mapa parcial.

### 14.5 Invocado

Función:
Improvisación, lógica externa, rarezas.

Interacciones:
- resolver puzzles por analogía.
- usar herramientas extrañas.
- resistir anomalías.

### 14.6 Clérigo

Función:
Purificación, protección, nombres, no-muertos/sombra.

Interacciones:
- bendecir sala.
- limpiar corrupción.
- anclar nombre.

### 14.7 Duelista

Función:
Elites, duelos, counters, precisión.

Interacciones:
- desafiar guardián.
- leer postura de enemigo.
- rematar adds clave.

### 14.8 Inspector

Función:
Trampas, sellos, normas, clasificación.

Interacciones:
- sellar peligro.
- reducir reloj.
- convertir trampa.
- emitir informe útil.

### 14.9 Bardo

Función:
Moral, memoria, ecos, control social.

Interacciones:
- cantar a sala.
- recordar nombres.
- calmar entidad.
- registrar Crónica.

### 14.10 Arcanista

Función:
Corrientes, sellos, análisis mágico, contraritual.

Interacciones:
- detectar resonancia.
- estabilizar Corrientes.
- revelar magia oculta.
- descargar Sobrecarga ambiental.

## 15. Mazmorras y NPCs

### 15.1 NPCs acompañantes

Algunos NPCs pueden entrar en dungeon como parte de quest:
- Gilda Mapachispa para inspección.
- Pex para Sótano.
- Hermana Lúa para Pozo.
- Bimba en recados peligrosos, con cuidado.

### 15.2 Estados de acompañante

- siguiendo.
- esperando.
- asustado.
- ayudando.
- herido.
- capturado.
- protegido.

### 15.3 No convertir acompañantes en carga molesta

Los acompañantes deben ser útiles o narrativos. Si requieren protección, que sea el objetivo explícito y limitado.

## 16. Mazmorras y reputación

### 16.1 Reputación por desempeño

Ejemplos:
- Completar sin quemar panadería: +Doña Marga.
- Entregar informe completo: +Mazmorras Cívicas.
- Purificar sala: +Capilla.
- Capturar no letal: +Archivo de Monstruos.

### 16.2 Reputación negativa

- Destrozar tienda.
- Robar reliquia.
- Firmar contrato falso.
- Abandonar NPC.
- Usar Sombra en lugar público sin justificación.

### 16.3 Títulos de dungeon

Ejemplos:
- No Quemó la Panadería.
- Inspector Honorario de Sótanos Improbables.
- Amigo de Pex.
- Sellador de Migas.

## 17. Diseño concreto: Sótano de Masa Viva nivel 1

### 17.1 Concepto

Mazmorra tutorial bajo la Panadería Panbendito. Es una bodega que se convirtió en dungeon viva por resonancia entre el horno antiguo, la gota del Cáliz en el Pozo Cantante y restos de magia aureana bajo Villaclara.

Tono:
Cómico, inquietante, cálido, pegajoso y táctico.

Nivel:
4-8.

Rango:
Cobre.

Tamaño:
Pequeña, 8 salas.

Modo:
Instancia party/personal.

Reloj:
Fermentación.

### 17.2 Salas propuestas

1. Trampilla del Horno Viejo.
Entrada. Enseña olor, gel y escalones tibios.

2. Despensa que Respira.
Sala con sacos, pistas, primer slime.

3. Pasillo de Levadura Lenta.
Conector cambiante, introduce reloj.

4. Cámara de las Cucharas.
Pex y objetos robados. Puzzle/encuentro social.

5. Horno Hundido.
Puzzle de Brasa/Marea, riesgo de explosión de harina.

6. Bodega de Mermelada.
Encuentro con slimes, loot culinario.

7. Nudo de Masa.
Mini-puzzle de sellos/rutas, trampa orgánica.

8. Cuenco de la Masa Madre.
Boss: Masa Madre Menor.

### 17.3 Rutas

Lineal con ramas pequeñas:
Entrada -> Despensa -> Pasillo -> Cámara Cucharas.
Desde Pasillo también se puede ir a Horno Hundido.
Cámara Cucharas y Horno permiten abrir Bodega.
Bodega -> Nudo -> Boss.
Atajo de salida tras boss.

### 17.4 Objetivos

Principal:
Recuperar cucharas y detener la grieta de masa.

Secundarios:
- No quemar bodega.
- Mantener a Pex calmado.
- Recuperar Levadura Viva intacta.
- Colocar sello de Mazmorras Cívicas.
- Cartografiar pasillo cambiante.

### 17.5 Enemigos

- Slime de Mermelada.
- Hada de Harina.
- Rata Sacristana.
- Mímico de Saco de Harina.
- Masa Madre Menor.

### 17.6 Puzzles

Cámara de las Cucharas:
Ordenar cucharas por marcas para abrir puerta sin combate.
Bardo/Cocinero/Pex ayudan.

Horno Hundido:
Regular calor para endurecer o ablandar masa.
Arcanista/Cocinero/Inspector tienen rutas.

Nudo de Masa:
Sellar tres grietas antes de que reloj suba.
Cartógrafo/Inspector/Clérigo ayudan.

### 17.7 Consecuencias

Éxito limpio:
Doña Marga confía más, descuento, título opcional.

Éxito con daños:
Quest completada, pero pan más caro temporalmente.

Fracaso parcial:
Bodega sellada por Gilda, se requiere reparación/segunda entrada.

Pex tratado bien:
Pex ayuda en futuras quests.

Pex asustado:
Pex se esconde, líneas tristes y menos ayuda.

## 18. Diseño concreto: Cámara del Pozo Cantante

### 18.1 Concepto

Instancia narrativa bajo el Pozo Cantante. No es dungeon normal, sino prueba de memoria. Se desbloquea al avanzar el arco principal.

Nivel:
16-20.

Tipo:
Mazmorra de memoria / boss narrativo.

Objetivo:
Comprender la gota del Cáliz y defender Villaclara del primer toque del Canon.

### 18.2 Estructura

1. Escalera de Agua Quieta.
2. Sala de Nombres Mojados.
3. Galería de Ecos de Villaclara.
4. Cámara de la Gota.
5. Arena del Guardián del Pozo.

### 18.3 Mecánica

El jugador debe haber construido vínculos:
- Otilia restaurada.
- Pex ayudado.
- Lúa informada.
- Silo convencido.
- Crónica con pistas suficientes.

Cada vínculo puede facilitar una fase.

### 18.4 Boss: Guardián del Pozo Cantante

No es malvado. Prueba intención.

Fases:
1. Prueba de Nombre.
2. Prueba de Memoria.
3. Prueba de Elección.

Resoluciones:
- Combate completo.
- Ritual de Crónica.
- Canción/Clérigo/Arcanista/Inspector.
- Reputación con Villaclara.
- Combinación.

Recompensa:
Título Nombre de Villaclara.
Protección de Nombre Propio.
Mapa de Mediodía.

## 19. Formatos de salida textual

### 19.1 Entrada de dungeon

```
Sótano de Masa Viva — Entrada
Los escalones bajan desde la trampilla del horno viejo hacia una oscuridad tibia. La piedra parece piedra solo por cortesía. En las paredes, vetas de masa antigua laten con paciencia de pan que ha leído demasiados mapas.

Rasgos: calor leve, olor a levadura, suelo irregular.
Reloj de dungeon: Fermentación 0/6.
Salidas: arriba, este.
Ves: marcas de cucharas, saco roto, gota de gel.
```

### 19.2 Reloj avanza

```
[Dungeon] La masa respira.
El aire se vuelve más dulce y pesado. Algo se mueve detrás de las paredes.
Fermentación: 2/6.
```

### 19.3 Trampa detectada

```
Notas que el saco de harina está demasiado tenso. Nadie llena un saco así salvo que quiera alimentar una catástrofe pequeña.
[Trampa detectada] Saco de Harina Suspicioso.
```

### 19.4 Boss telegrafía

```
La Masa Madre Menor se hincha. Las migas del suelo tiemblan y empiezan a deslizarse hacia ella.
[Pista] Parece que absorberá restos al final de la ronda. Limpiar, quemar, sellar o apartar las migas podría impedirlo.
```

### 19.5 Dungeon completada

```
[Crónica actualizada] Has sellado el primer nivel del Sótano de Masa Viva.
Doña Marga no sonríe exactamente, pero te da pan sin cobrar. En Villaclara eso cuenta como medalla.
```

## 20. Datos técnicos YAML

### 20.1 Dungeon

```yaml
id: dungeon_sotano_masa_viva
name: Sótano de Masa Viva
type: [living, tutorial, rural]
zone: villaclara
levelRange: [4, 8]
rank: copper
size: small
instanceMode: party
entryRoom: villaclara_panaderia_trampilla
clock:
  id: fermentacion
  max: 6
  startsAt: 0
  advanceOn:
    - exhaustive_search
    - fire_in_flour_room
    - failed_trap
    - rest_inside
  reduceBy:
    - inspector_seal
    - cartographer_route_mark
    - cleric_blessing
    - arcanist_containment
    - cook_stabilize_ferment
rooms:
  - smv_entrada
  - smv_despensa_respira
  - smv_pasillo_levadura
  - smv_camara_cucharas
  - smv_horno_hundido
  - smv_bodega_mermelada
  - smv_nudo_masa
  - smv_cuenco_madre
boss: boss_masa_madre_menor
quests:
  - villaclara_pex_cucharas
  - villaclara_inspeccion_sotano
```

### 20.2 Sala de dungeon

```yaml
id: smv_despensa_respira
name: Despensa que Respira
dungeon: dungeon_sotano_masa_viva
description: >
  Sacos de harina se apilan contra paredes tibias. Algunos se mueven con respiración lenta,
  como si soñaran con ser pan o amenaza.
exits:
  west: smv_entrada
  east: smv_pasillo_levadura
objects:
  - saco_harina_sospechoso
  - estante_mermeladas
  - marcas_cucharas
traits:
  - harina_en_suspension
  - cobertura_sacos
encounters:
  firstVisit:
    - enemy_slime_mermelada
secrets:
  - secreto_harina_lunar
clockEffects:
  fermentacion_3:
    appendDescription: La pared norte se abomba con una burbuja de masa inquieta.
```

### 20.3 Trampa

```yaml
id: trap_saco_harina_sospechoso
name: Saco de Harina Suspicioso
type: organic
detect:
  attribute: perception
  difficulty: 10
  classBonus:
    inspector: 3
    cook: 3
    arcanist: 2
effectsOnTrigger:
  - applyState: cegado
    duration: 1
  - spawn: enemy_hada_harina
  - advanceClock: fermentacion:1
disarm:
  options:
    - skillTag: trap_disarm
    - item: tiza_mazmorra_civica
    - classAction: cook_tie_sack
```

### 20.4 Boss

```yaml
id: boss_masa_madre_menor
name: Masa Madre Menor
level: 7
tags: [boss, living_dungeon, organic, fermento]
phases:
  - id: phase_1
    untilHealthPct: 40
    skills:
      - golpe_de_masa
      - pegote_fermentado
      - absorber_migas
  - id: phase_2
    trigger: health_below_40
    onStart:
      message: La Masa Madre se divide con un sonido húmedo y ofendido.
      spawn:
        - masa_menor_a
        - masa_menor_b
mechanics:
  absorbCrumbs:
    telegraph: true
    preventBy:
      - clean_floor
      - seal_cracks
      - burn_crumbs_safe
      - use_salt
rewards:
  - levadura_viva
  - cuchara_pex_recuerdo
  - reputation:villaclara:5
  - reputation:mazmorras_civicas:5
```

## 21. Implementación técnica en Ranvier

### 21.1 Bundle recomendado

inheron-dungeons

Subcarpetas:
- commands/dungeon/
- data/dungeons/
- data/dungeon_rooms/
- data/traps/
- data/puzzles/
- data/bosses/
- data/dungeon_clocks.yml
- data/instance_rules.yml
- lib/DungeonManager.js
- lib/InstanceManager.js
- lib/DungeonClockManager.js
- lib/TrapManager.js
- lib/PuzzleManager.js
- lib/DungeonRewardManager.js
- lib/DungeonStateManager.js
- scripts/dungeons/

### 21.2 Managers principales

DungeonManager:
Carga dungeons, controla entrada, salida, estado general.

InstanceManager:
Crea, guarda, resetea y recupera instancias.

DungeonClockManager:
Gestiona relojes de presión.

TrapManager:
Detección, activación, desactivación y conversión de trampas.

PuzzleManager:
Estados de puzzle, intentos, pistas y resolución.

DungeonRewardManager:
Loot, cofres, objetivos opcionales, recompensas finales.

DungeonStateManager:
Estados de sala y dungeon.

### 21.3 Eventos

- dungeonEntered.
- dungeonExited.
- dungeonInstanceCreated.
- dungeonClockAdvanced.
- dungeonClockReduced.
- dungeonRoomEntered.
- dungeonRoomCleared.
- trapDetected.
- trapTriggered.
- trapDisarmed.
- puzzleStarted.
- puzzleSolved.
- bossPhaseChanged.
- dungeonObjectiveCompleted.
- dungeonCompleted.
- dungeonReset.

### 21.4 Integración con otros sistemas

Exploration:
Salas, objetos, buscar, escuchar, oler, tocar.

Combat:
Encuentros, boss, rasgos de entorno.

Quest:
Objetivos y estado de dungeon.

Items:
Loot, herramientas, objetos de quest.

NPC:
Acompañantes, rescates, rutinas especiales.

Reputation:
Consecuencias.

Chronicle:
Recuerdos, mapas, logros.

WorldState:
Persistencia de sellado, descubrimiento y consecuencias.

## 22. Comandos propuestos

Jugador:
- entrar mazmorra.
- salir mazmorra.
- estado mazmorra.
- mapa mazmorra.
- reloj mazmorra.
- examinar sala.
- buscar trampas.
- desactivar trampa.
- usar [herramienta] en [trampa/puzzle].
- resolver [puzzle].
- sellar sala.
- marcar ruta.
- abandonar instancia.
- reiniciar mazmorra, con confirmación.

Party:
- invitar a instancia.
- entrar con party.
- ready / listo.
- abandonar party dungeon.

Admin/debug:
- dungeoninfo [id].
- instanceinfo [id].
- setdungeonclock [value].
- spawnboss [id].
- solvedungeon [id].
- resetinstance [id].
- showtraps [room].
- validateDungeons.

## 23. QA y validación

Validaciones automáticas:
- Todas las salas existen.
- Todas las salidas apuntan a sala válida.
- Boss existe.
- Loot existe.
- Trampas referencian estados válidos.
- Puzzles tienen solución.
- Reloj tiene máximo y efectos.
- Objetos de quest no pueden perderse.
- Recompensas no duplicables infinitamente.

Casos de prueba:
- Completar dungeon en ruta normal.
- Completar con party.
- Salir y volver.
- Morir/derrota en boss.
- Activar reloj máximo.
- Resolver puzzle por cada clase relevante.
- Intentar vender objeto de quest.
- Desconexión durante instancia.

## 24. Roadmap de implementación

### Fase A: Núcleo de dungeon
- DungeonManager.
- Entrada/salida.
- Instancia personal/party básica.
- 3 salas iniciales.
- Estado de sala.

### Fase B: Sótano de Masa Viva nivel 1
- 8 salas.
- Enemigos básicos.
- Reloj de Fermentación.
- Pex y cucharas.
- Primer boss.

### Fase C: Trampas y puzzles
- TrapManager.
- PuzzleManager.
- Horno Hundido.
- Saco Suspicioso.
- Nudo de Masa.

### Fase D: Recompensas y consecuencias
- Loot contextual.
- Objetivos opcionales.
- Reputación.
- Crónica.
- Estado sellado.

### Fase E: Cámara del Pozo
- Dungeon de memoria.
- Guardián del Pozo.
- Resoluciones alternativas.
- Finale del arco Villaclara.

### Fase F: Reutilización
- Plantillas de dungeon.
- Dungeons repetibles menores.
- Variantes de contratos.

## 25. Riesgos y soluciones

Riesgo: dungeons demasiado largas para MUD textual.
Solución: empezar con mini/pequeñas, 5-9 salas densas.

Riesgo: instancias complicadas.
Solución: fase 1 personal/party simple; persistencia limitada.

Riesgo: puzzles bloqueantes.
Solución: pistas redundantes, alternativas por clase/herramienta, fallos con feedback.

Riesgo: reloj de dungeon estresa demasiado.
Solución: reloj visible, eventos graduales, formas de reducirlo.

Riesgo: bosses injustos.
Solución: telegrafía clara, contra-juego, logs tácticos.

Riesgo: contenido se vuelve repetitivo.
Solución: identidad fuerte, rasgos de entorno, objetivos secundarios, loot contextual.

Riesgo: party rompe narrativa.
Solución: instancias por party, elegibilidad de quest, escenas compartibles.

## 26. Recomendación fase 1

Implementar primero:
- Sótano de Masa Viva nivel 1.
- 8 salas.
- Instancia personal/party.
- Reloj Fermentación 0-6.
- 3 trampas.
- 2 puzzles.
- 4 enemigos.
- 1 boss.
- 4 objetivos opcionales.
- Recompensas con Doña Marga, Pex y Mazmorras Cívicas.

Objetivo jugable:
Que el jugador entre por una quest aparentemente absurda de cucharas, aprenda exploración, trampas, entorno, combate táctico, reloj de dungeon, boss con fases y consecuencias narrativas, y salga sintiendo que una panadería puede ser más memorable que una fortaleza genérica.

## 27. Cierre

Las mazmorras de InheronMUD deben ser lugares con carácter. El jugador debe recordar no solo qué mató, sino qué olió, qué tocó por error, qué puerta respiraba, qué trampa convirtió en ventaja y qué NPC le regañó al salir.

El Sótano de Masa Viva será nuestra primera declaración de intenciones: una dungeon pequeña, sí, pero llena de identidad. Pan, gel, harina, cucharas, Pex, Doña Marga, sellos cívicos, una Masa Madre Menor y la sensación de que bajo Villaclara todo lo cotidiano tiene raíces épicas.

Una buena mazmorra no solo se limpia. Se recuerda.

FIN DEL DOCUMENTO DE MAZMORRAS, INSTANCIAS Y ENCUENTROS ESPECIALES
