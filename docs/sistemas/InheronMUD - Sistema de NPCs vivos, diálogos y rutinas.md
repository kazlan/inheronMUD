# INHERONMUD — SISTEMA DE NPCS VIVOS, DIÁLOGOS Y RUTINAS
## Diseño detallado para habitantes memorables, memoria social, servicios, conversación y vida diaria en Ranvier

Documento de diseño sistémico. Objetivo: definir cómo deben funcionar los NPCs de InheronMUD para que los pueblos, ciudades, mazmorras y facciones no parezcan máquinas de quests con sombrero. Queremos habitantes con rutina, voz, memoria, servicios, secretos, estados emocionales, diálogos contextuales, reacciones a reputación, vínculos con el jugador y presencia viva en el mundo.

Stack previsto: Ranvier / Node.js.
Zona inicial de referencia: Villaclara, Altherion.
Sistemas relacionados: quests/arcos, exploración textual, reputación, inventario, economía, combate, progresión, tiempo/calendario, Crónica Viva y WorldState.

## 1. Principios de diseño

### 1.1 Los NPCs son habitantes, no postes con menú

Cada NPC importante debe existir aunque el jugador no tenga una quest activa con él. Debe tener oficio, rutina, relaciones, humor, preocupaciones, preferencias, secretos y memoria de lo ocurrido.

Doña Marga no es “vendor_food_01”. Es la panadera que protege el corazón social de Villaclara, vende buffs de comida, custodia una mazmorra bajo su horno, sospecha de Pex y puede subirte el precio del pan si demuestras creatividad incendiaria.

### 1.2 Función jugable + voz propia

Todo NPC relevante debe tener dos capas:
- Función jugable: tienda, quest, entrenamiento, rumor, curación, reparación, acompañante, antagonista.
- Voz propia: cómo habla, qué teme, qué desea, cómo reacciona al jugador.

Un NPC útil pero sin voz se olvida. Un NPC con voz pero sin función se convierte en decoración parlante. Necesitamos ambos.

### 1.3 La memoria es mecánica

InheronMUD gira alrededor de nombres, memoria y Crónica. Los NPCs deben recordar:
- Si el jugador les ayudó.
- Si falló.
- Si quemó algo.
- Si protegió a alguien.
- Si eligió una facción.
- Si restauró un nombre.
- Si aceptó un contrato sospechoso.

Esta memoria debe afectar diálogos, precios, disponibilidad, quests, rumores y títulos.

### 1.4 Rutinas visibles, no molestas

Los NPCs pueden moverse por horario, pero el sistema no debe convertir cada conversación en una persecución burocrática. Si un NPC no está, debe haber pistas sobre dónde encontrarlo o cuándo vuelve.

Ejemplo:
“Doña Marga no está tras el mostrador. Un cartel dice: ‘Estoy en el horno. Si eres Pex, no sabes leer. Si eres aventurero, espera o baja la voz’”.

### 1.5 Diálogo como sistema de juego

Hablar no debe ser solo texto. Un diálogo puede:
- Iniciar quest.
- Avanzar objetivo.
- Dar pista.
- Cambiar reputación.
- Desbloquear tienda.
- Activar escena.
- Resolver conflicto.
- Abrir combate.
- Crear consecuencia.

### 1.6 Humor desde personaje y mundo

El humor debe venir de personalidad, contexto, contradicciones y vida diaria. No de romper la cuarta pared. Villaclara puede ser graciosa porque sus habitantes se toman muy en serio cosas absurdas: licenciar mazmorras rurales, discutir con slimes, legislar pan peligroso.

## 2. Tipos de NPC

### 2.1 NPC esencial

Personaje central de zona o arco. Tiene memoria amplia, quests, diálogos contextuales y posiblemente rutina.

Ejemplos:
- Doña Marga Panbendito.
- Hermana Lúa Candela.
- Silo Brincacepa.
- Otilia Cuerda.
- Varo Nomenclaro.

### 2.2 NPC funcional

Tiene servicio claro: tienda, reparación, posada, entrenamiento, banco, identificación, transporte.

Ejemplos:
- Taren Buenclavo.
- Mirta Cesta Serena.
- Joro del Segundo Gallo.

Debe tener personalidad, pero menos profundidad que esenciales.

### 2.3 NPC de rumor

Aporta vida, rumores, pistas y contexto. Puede ser parte de grupos sociales.

Ejemplos:
- Tías del Mantel Blanco.
- Vecinos de lavadero.
- Mercaderes ambulantes.
- Milicianos.

### 2.4 NPC de quest temporal

Aparece para una quest o evento concreto. Puede desaparecer, moverse o cambiar estado.

Ejemplos:
- Forastero recién aparecido.
- Mensajero de Solazur.
- Duende cobrador de peaje.

### 2.5 NPC antagonista

Puede actuar oculto, cambiar diálogos, manipular eventos o enfrentarse al jugador.

Ejemplos:
- Varo Nomenclaro.
- Purificador Risueño local.
- Agente de Cámara.

### 2.6 NPC ambiental

Da sensación de vida. Puede tener líneas cortas, rutinas simples o reacciones al estado del mundo.

Ejemplos:
- Niños que corren por plaza.
- Campesinos.
- Peregrinos.
- Clientes de posada.

### 2.7 Mascota o criatura social

No siempre habla, pero tiene conducta, vínculo y función.

Ejemplos:
- Pex.
- Slime doméstico.
- Gallo del Segundo Gallo.
- Oveja cumulonimbo futura.

## 3. Anatomía de una ficha de NPC

### 3.1 Campos narrativos

ID técnico:
npc_dona_marga_panbendito.

Nombre visible:
Doña Marga Panbendito.

Alias:
Marga, panadera, Doña Marga.

Tipo:
esencial, funcional, rumor, antagonista, mascota.

Pueblo/raza:
humana de Altherion, slime, eldáryn, etc.

Edad aparente:
No siempre exacta.

Ubicación base:
Panadería Panbendito.

Rol jugable:
Vendedora de comida, quest giver, cocina, acceso dungeon.

Personalidad:
3-5 rasgos.

Deseo:
Qué quiere.

Miedo:
Qué teme.

Secreto:
Información oculta.

Relaciones:
NPCs aliados, rivales, familia, facción.

Frase icónica:
Una línea que capture voz.

### 3.2 Campos mecánicos

Servicios:
Tienda, reparación, curación, entrenamiento, banco, posada.

Quests asociadas:
Lista de quests/arcos.

Facciones:
Reputaciones relacionadas.

Rutina:
Horarios y ubicaciones.

Estados:
Disponible, ocupado, herido, ausente, sospechoso, hostil, protegido, borrado, etc.

Memoria del jugador:
Flags que modifican diálogos y servicios.

Diálogos:
Árboles o topics.

Inventario/stock:
Si comerciante.

Combate:
Si puede luchar, huir, ayudar o ser protegido.

Persistencia:
PlayerState, AreaState o WorldState.

### 3.3 Ejemplo resumen de ficha

Doña Marga Panbendito
Tipo: esencial/funcional.
Rol: panadera, tienda de comida, quest giver, acceso al Sótano de Masa Viva.
Personalidad: cálida, autoritaria, sarcástica, protectora.
Deseo: que Villaclara esté alimentada y segura.
Miedo: que la mazmorra bajo su panadería ponga en peligro a niños y vecinos.
Secreto: vio la gota del Cáliz caer en el Pozo Cantante.
Frase: “Aquí se entra con hambre, no con tonterías. Aunque a veces traéis ambas”.

## 4. Sistema de rutinas

### 4.1 Rutina por bloques del día

Bloques iniciales:
- Madrugada.
- Mañana.
- Mediodía.
- Tarde.
- Noche.
- Medianoche.

Cada NPC puede tener ubicación y comportamiento por bloque.

Ejemplo Doña Marga:
Madrugada: Panadería, hornos.
Mañana: Panadería, mostrador.
Mediodía: Plaza si hay feria; si no, Panadería.
Tarde: Panadería, cocina.
Noche: Panadería cerrada o Posada en eventos.
Medianoche: no disponible, salvo quest del Sótano.

### 4.2 Rutinas por estado de quest

Las rutinas pueden cambiar si una quest está activa.

Ejemplo:
Durante “Pex y las cucharas desaparecidas”, Doña Marga permanece en panadería hasta que el jugador avanza. Pex se mueve entre mostrador, trampilla y sótano.

Durante “Otilia no existe”, Otilia se sitúa en el Ayuntamiento durante el día y en la Posada por la noche, discutiendo con cualquiera que insinúe que no existe.

### 4.3 Rutinas por eventos

Eventos pueden alterar ubicaciones:
- Feria de Cosecha Clara.
- Ataque a Campo Norte.
- Repique de nombres.
- Panadería en crisis.
- Contrato falso en tablón.

### 4.4 NPC no encontrado

Si el jugador busca a un NPC ausente, el sistema debe responder con ayuda.

Ejemplo:
“Mirta no está en La Cesta Serena. El cartel dice que vuelve después del mediodía. Bimba podría saber dónde fue, porque Bimba sabe cosas antes de que terminen de pasar”.

### 4.5 Rutinas simples para fase 1

No implementar pathfinding complejo al inicio. Usar teletransporte lógico por bloques de tiempo y eventos:
- NPC tiene location_by_time.
- Al cambiar bloque, se actualiza ubicación.
- Si está en escena/quest, la quest override manda.

## 5. Estados de NPC

### 5.1 Estados básicos

Disponible:
Puede hablar y ofrecer servicios.

Ocupado:
Puede responder, pero no iniciar ciertas acciones.

Ausente:
No está en ubicación base.

Herido:
Servicios limitados, diálogos especiales.

Asustado:
Tras eventos de peligro.

Enfadado:
Por baja reputación o decisión.

Agradecido:
Tras ayuda.

Sospechoso:
No confía o cree que algo va mal.

Hostil:
Puede negarse a hablar o combatir.

Protegido:
Tiene estado de seguridad por quest.

Borrado:
Afectado por memoria/Canon. Puede no aparecer en registros o ser ignorado por NPCs.

Contested:
Su situación está disputada por facción o quest.

### 5.2 Estados emocionales

Además del estado funcional, un NPC puede tener emoción dominante:
- calmado.
- alegre.
- preocupado.
- irritado.
- triste.
- eufórico.
- avergonzado.
- solemne.
- aterrorizado.
- conspirativo.

Esto modifica líneas ambientales y diálogos.

### 5.3 Estados por memoria

Importantes para Cámara:
- nombre_anclado.
- nombre_borrado_parcial.
- recuerda_jugador.
- duda_jugador.
- memoria_falsa_activa.
- protegido_por_cronica.

Ejemplo:
Otilia puede tener nombre_borrado_parcial hasta completar su quest. Los vecinos la recuerdan, pero el archivo no.

## 6. Memoria del jugador

### 6.1 Flags personales por NPC

Cada NPC importante puede tener flags hacia el jugador.

Ejemplos:
- marga_ayudo_pex.
- marga_quemo_bodega.
- otilia_nombre_restaurado.
- silo_confia_en_jugador.
- lua_compartio_vision_pozo.
- varo_jugador_sospecha.
- pex_tratado_con_amabilidad.

### 6.2 Afinidad personal

Valor opcional por NPC:
- -100 a +100.

No todos los NPCs necesitan afinidad numérica. Para fase 1, usar en NPCs principales.

Tramos:
- Hostil: -50 o menos.
- Desconfía: -20 a -49.
- Neutral: -19 a +19.
- Cordial: +20 a +49.
- Confía: +50 a +79.
- Vinculado: +80 o más.

### 6.3 Memoria cualitativa

Además del número, conservar eventos concretos.

Ejemplos:
- “No quemó la panadería”.
- “Defendió a Otilia”.
- “Firmó un acta falsa”.
- “Aceptó ayuda de Purificadores”.
- “Protegió a Bimba”.

Estas memorias son más útiles para diálogos que un número seco.

### 6.4 Memoria por reputación local

NPCs pueden reaccionar a reputación de zona aunque no tengan memoria directa.

Ejemplo:
Un vecino que nunca habló contigo puede decir:
“Eres quien devolvió el nombre a Otilia, ¿verdad? Mi madre dice que eso vale más que matar conejos. Aunque matar conejos también ayuda”.

## 7. Sistema de diálogo

### 7.1 Topics en lugar de árbol rígido único

Recomendación: usar sistema híbrido:
- Topics disponibles por NPC.
- Opciones de diálogo en escenas/quests.
- Líneas ambientales.
- Respuestas por flags.

Comandos:
- hablar [npc]
- preguntar [npc] [tema]
- decir [npc] [opción]
- rumores [npc]

Ejemplo:
hablar marga
Temas:
1. Comprar pan.
2. Pex.
3. Sótano.
4. Rumores de Villaclara.
5. Trabajo disponible.

### 7.2 Topics básicos

Todo NPC importante puede tener:
- saludo.
- quién eres.
- trabajo/servicio.
- rumores.
- quests activas.
- opinión sobre Villaclara.
- despedida.

NPCs especializados añaden topics:
- Doña Marga: pan, Pex, sótano, Nana.
- Hermana Lúa: capilla, pozo, nombres, luz.
- Silo: ayuntamiento, permisos, contratos, problemas.
- Otilia: actas, memoria, bastón, pasado.
- Varo: documentos, genealogía, orden, Canon disfrazado.

### 7.3 Diálogos por condición

Condiciones posibles:
- questActive.
- questCompleted.
- clueFound.
- reputationAtLeast.
- npcAffinity.
- class.
- origin.
- titleActive.
- timeOfDay.
- itemHeld.
- factionState.
- worldFlag.

Ejemplo:
Si jugador es Arcanista y tiene clue_tinta_blanca:
Hermana Lúa dice:
“También la has visto, ¿verdad? Esa tinta no oculta la luz. La ordena. Y eso me inquieta más”.

### 7.4 Opciones de diálogo como intención

Las opciones deben expresar intención, no frases literales eternas.

Ejemplo:
1. Defender a Otilia con calma.
2. Acusar a Varo directamente.
3. Pedir revisar las actas.
4. Cantar la copla de Fennel.
5. Guardar silencio y observar.

### 7.5 Diálogo y consecuencias

Un diálogo puede emitir eventos:
- dialogueTopicSelected.
- dialogueChoiceMade.
- npcAffinityChanged.
- clueDiscovered.
- questAdvanced.
- factionAttentionChanged.
- npcStateChanged.

## 8. Voz de NPC

### 8.1 Componentes de voz

Cada NPC importante debe tener guía de voz:
- Registro: formal, rural, académico, religioso, picaresco.
- Ritmo: frases cortas/largas, sentencioso, nervioso.
- Humor: seco, tierno, absurdo, ninguno.
- Muletillas o patrones.
- Qué nunca diría.

### 8.2 Ejemplos

Doña Marga:
Registro rural autoritario.
Ritmo directo.
Humor seco.
Nunca se muestra impresionada por tonterías heroicas.

Silo:
Registro administrativo nervioso.
Ritmo entrecortado, intenta sonar oficial.
Humor involuntario.
Usa palabras como “gestionable”, “sello”, “procedimiento”.

Hermana Lúa:
Registro espiritual cercano.
Ritmo suave.
Humor leve, empático.
Habla de luz como cuidado, no como castigo.

Otilia:
Registro afilado, anciana feroz.
Ritmo contundente.
Humor de bastón.
Nunca acepta ser tratada como frágil.

Pex:
Dice “blorp”, pero otros traducen. La comicidad está en acciones y traducciones interesadas.

Varo:
Registro educado, impecable, inquietante.
Ritmo preciso.
Nunca insulta directamente. Convierte violencia en trámite.

## 9. Servicios de NPC

### 9.1 Tipos de servicio

Tienda:
Compra/venta.

Entrenamiento:
Skills, talentos, clase, profesión.

Curación:
Estados, vida, bendiciones.

Reparación:
Equipo.

Identificación:
Objetos raros, reliquias, maldiciones.

Posada:
Descanso, baúl, rumores.

Gremio:
Contratos, rangos, recompensas.

Banco/almacén:
Baúl, envío.

Crafting:
Recetas, ingredientes, talleres.

Transporte:
Caravanas, rutas.

### 9.2 Servicios condicionados

Servicios pueden depender de:
- Hora.
- Reputación.
- Quest.
- Estado emocional.
- Stock.
- Rango de Gremio.
- Clase.

Ejemplo:
Doña Marga vende pan siempre que esté disponible, pero solo enseña recetas si confía en el jugador.

Hermana Lúa cura estados leves normalmente, pero para estados de Borrón necesita quest o pista.

Taren repara armas, pero no toca reliquias sin identificación.

### 9.3 Servicios con personalidad

Los mensajes de servicio deben tener voz.

Compra en Panbendito:
“Doña Marga envuelve el pan con gesto de sentencia favorable”.

Reparación en Buenclavo:
“Taren mira la hoja, mira tus botas, mira otra vez la hoja. ‘Ha visto estupideces’, dice. No aclara si habla del arma o de ti”.

Curación con Lúa:
“La hermana Lúa posa una mano sobre tu frente. La luz no arde: recuerda el camino de vuelta”.

## 10. NPCs y quests

### 10.1 Roles en quest

Quest giver:
Inicia quest.

Quest target:
Objetivo o persona a proteger.

Informante:
Da pistas.

Gatekeeper:
Permite acceso.

Antagonista:
Se opone.

Witness/testigo:
Aporta testimonio.

Resolution NPC:
Cierra quest.

### 10.2 NPCs con arco personal

Algunos NPCs deben tener pequeños arcos propios.

Doña Marga:
De panadera protectora que oculta el incidente del Cáliz a aliada clave del Pozo.

Hermana Lúa:
De clériga joven insegura a guardiana local de nombres.

Silo:
De alcalde desbordado a líder que aprende a confiar en el jugador.

Otilia:
De víctima de borrado a testigo viva contra la Cámara.

Pex:
De ladrón de cucharas a mascota/aliado menor.

Bimba:
De mensajera cotilla a informante esencial.

### 10.3 NPCs como rutas alternativas

Cada NPC puede abrir resolución según confianza.

Ejemplo Otilia no existe:
- Hermana Lúa: ruta religiosa.
- Fennel: ruta barda.
- Silo: ruta legal.
- Mirta: ruta de documentos alternativos.
- Bimba: pista visual de tinta dorada.
- Varo: ruta trampa/antagonista.

## 11. NPCs y combate

### 11.1 NPCs no combatientes

No todo NPC debe luchar. Algunos deben huir, esconderse o requerir protección.

Ejemplos:
- Bimba: huye, puede distraer si confía.
- Silo: se esconde tras procedimiento.
- Otilia: no huye, amenaza con bastón. No es lo mismo.

### 11.2 NPCs aliados temporales

Algunos NPCs pueden apoyar en encuentros:
- Tilo futuro como protector.
- Hermana Lúa con bendición.
- Pex con distracción viscosa.
- Gilda con sellos.
- Fennel con canción menor.

### 11.3 Protección de NPCs

Quests pueden requerir proteger NPCs. El sistema debe soportar:
- Vida de NPC.
- Estado herido.
- Retirada.
- Pánico.
- Cobertura.
- Reacción a jugador.

### 11.4 Derrota o daño a NPCs

Evitar muerte permanente temprana salvo diseño explícito. Usar estados:
- Herido.
- Evacuado.
- Capturado.
- Borrado parcialmente.
- Desaparecido.

Esto abre historia sin cerrar contenido de golpe.

## 12. NPCs y reputación

### 12.1 Afinidad personal vs reputación de facción

Doña Marga puede apreciarte aunque el Concejo esté molesto.
La Capilla puede confiar aunque el Gremio dude.
Los Purificadores pueden respetar tus resultados y odiar tus amistades. Qué gente tan agotadora.

### 12.2 Efectos de afinidad

Afinidad alta:
- Diálogos personales.
- Descuentos.
- Quests exclusivas.
- Ayuda en eventos.
- Acceso a secretos.

Afinidad baja:
- Precios peores.
- Menos información.
- Servicios limitados.
- Rumores negativos.

### 12.3 Atención negativa

Algunos antagonistas tienen tracking oculto:
- Varo sospecha.
- Cámara observa.
- Purificadores evalúan.

Esto no debe mostrarse como barra obvia al inicio. Puede manifestarse en eventos.

## 13. NPCs y exploración

### 13.1 NPCs como pistas vivas

Hablar con NPCs debe ser alternativa a buscar objetos.

Ejemplo:
Bimba puede decir dónde vio a Pex.
Tías pueden recordar a Otilia.
Taren puede identificar marcas de Verdanza.
Mirta puede reconocer mapa raro.

### 13.2 NPCs ambientales reactivos

Al entrar en una sala, NPCs pueden reaccionar:
- saludo si afinidad alta.
- silencio si baja.
- comentario si quest activa.
- aviso si evento próximo.

### 13.3 Seguimiento o escolta

Algunos NPCs pueden seguir temporalmente:
- escoltar a Otilia al archivo.
- llevar Bimba con mensaje.
- acompañar a Hermana Lúa al Pozo.

Debe ser temporal, con límites claros.

## 14. NPCs y economía

### 14.1 Stocks con personalidad

Cada tienda tiene stock base y stock variable.

Doña Marga:
Pan, comida, recetas.
Variable: ingredientes raros tras quests de Caldero Feliz.

Mirta:
Herramientas, mapas, objetos raros.
Variable: mercancía ambulante y mapas sospechosos.

Taren:
Armas simples, reparación.
Variable: piezas de metal aureano si se descubre calzada.

### 14.2 Precios por relación

Precio = base * modificador reputación * modificador afinidad * modificador evento.

Ejemplo:
Marga alta afinidad: pan -15%.
Marga baja por bodega quemada: pan +20% y comentario +200%.

### 14.3 Fiado y deudas

Algunos NPCs pueden fiar servicios con memoria:
- Joro puede fiar una noche.
- Doña Marga puede darte pan si estás en quest urgente.
- Mirta puede prestar herramienta a cambio de favor.

Esto genera flags de deuda, no solo economía.

## 15. NPCs y Crónica Viva

### 15.1 Entradas de NPC

La Crónica puede registrar NPCs importantes.

Ejemplo:
Otilia Cuerda
Estado: Nombre restaurado.
Relación: Confía en ti.
Notas: Su testimonio menciona un documento del Canon del Mediodía.
Recuerdo: “Que no salga en un papel no significa que no pueda darte con el bastón”.

### 15.2 Recuerdos personales

Algunos momentos desbloquean recuerdos:
- Primera bronca de Doña Marga.
- Pex devolviendo una cuchara.
- Otilia recuperando su nombre.
- Lúa escuchando la campana.

### 15.3 NPCs protegidos por nombre

Si el jugador ancla el nombre de un NPC, la Crónica lo refleja y puede afectar mecánicas anti-Canon.

## 16. NPCs de Villaclara: diseño fase 1

### 16.1 Doña Marga Panbendito

ID: npc_dona_marga_panbendito.
Tipo: esencial/funcional.
Ubicación base: Panadería Panbendito.
Servicios: tienda de comida, recetas, acceso quest, posible crafting culinario.
Afinidad: sí.
Facciones: Villaclara, Caldero Feliz informal.
Quests: Pex y las cucharas desaparecidas, Sótano de Masa Viva, Horno y Pozo.
Memorias clave:
- ayudo_pex.
- quemo_bodega.
- descubrio_sotano.
- conoce_gota_caliz.

Rutina:
Madrugada: hornos.
Mañana: mostrador.
Mediodía: plaza o tienda.
Tarde: tienda/cocina.
Noche: cerrada salvo quest.

Voz:
Directa, seca, cálida bajo una capa de autoridad.

### 16.2 Pex

ID: npc_pex_slime.
Tipo: mascota/social/quest.
Ubicación base: Panadería, pero se mueve.
Servicios: ninguno formal; pistas, humor, posible ayuda.
Afinidad: sí, simple.
Quests: cucharas, Sótano, futura mascota.
Estados: culpable, escondido, ayudante, asustado.

Rutina:
Mañana: cerca del mostrador.
Tarde: trampilla.
Noche: sótano si quest activa.

Voz:
“Blorp”. Traducciones por Bimba, Marga o sistema.

### 16.3 Hermana Lúa Candela

ID: npc_hermana_lua_candela.
Tipo: esencial/funcional.
Ubicación base: Capilla del Sol Quieto.
Servicios: curación, bendiciones, limpieza de estados leves, quests religiosas.
Afinidad: sí.
Facciones: Capilla, Villaclara.
Quests: Pozo, Otilia, Vela de Lúa.

Rutina:
Mañana: capilla.
Mediodía: visitas o plaza.
Tarde: capilla/archivo si quest.
Noche: Pozo si activado.

Voz:
Empática, espiritual, curiosa, valiente con miedo honesto.

### 16.4 Silo Brincacepa

ID: npc_silo_brincacepa.
Tipo: esencial/funcional.
Ubicación base: Ayuntamiento.
Servicios: permisos, reputación, contratos cívicos.
Afinidad: sí.
Facciones: Concejo de Villaclara.
Quests: Registro Cobre, Otilia, contratos falsos.

Rutina:
Mañana: ayuntamiento.
Mediodía: plaza.
Tarde: archivo/reuniones.
Noche: posada o casa.

Voz:
Administrativo nervioso. Quiere sonar firme. No siempre consigue sonar adulto.

### 16.5 Otilia Cuerda

ID: npc_otilia_cuerda.
Tipo: esencial/quest.
Ubicación base: casa/plaza/ayuntamiento según quest.
Servicios: testimonios, lore, memoria.
Afinidad: sí.
Quests: Otilia no existe, Canon del Mediodía.
Estados: nombre_borrado_parcial, restaurada, testigo_protegido.

Voz:
Anciana feroz. Humor afilado. Bastón argumental.

### 16.6 Bimba Cascabel

ID: npc_bimba_cascabel.
Tipo: rumor/quest/guía.
Ubicación base: plaza, rutas de recados.
Servicios: mensajes, rumores, tutoriales, pistas.
Afinidad: sí, simple.
Quests: tutorial, Pex, contratos falsos.

Voz:
Rápida, lista, cotilla con orgullo profesional.

### 16.7 Joro del Segundo Gallo

ID: npc_joro_segundo_gallo.
Tipo: funcional/social.
Ubicación base: Posada del Segundo Gallo.
Servicios: descanso, baúl, comida, rumores.
Afinidad: sí.
Quests: forasteros, habitación 3B.

Voz:
Alegre, exagerado, convierte rumores en baladas con dragones añadidos.

### 16.8 Mirta Cesta Serena

ID: npc_mirta_cesta_serena.
Tipo: funcional/informante.
Ubicación base: Tienda La Cesta Serena.
Servicios: tienda general, mapas, herramientas.
Afinidad: sí.
Quests: mapa de Verdanza, objetos raros.

Voz:
Amable, práctica, mirada de quien sabe cuánto cuesta todo y por qué.

### 16.9 Taren Buenclavo

ID: npc_taren_buenclavo.
Tipo: funcional/lore.
Ubicación base: Herrería Buenclavo.
Servicios: armas, reparación, identificación de metal.
Afinidad: sí.
Quests: calzada aureana, Verdanza, Guardia Albañil.

Voz:
Seco, veterano, frases cortas que pesan como yunques.

### 16.10 Varo Nomenclaro

ID: npc_varo_nomenclaro.
Tipo: antagonista/informante falso.
Ubicación base: archivo, ayuntamiento, plaza según fase.
Servicios: documentos, genealogía, contratos falsos.
Afinidad: no normal; usar sospecha/atención.
Facción: Cámara del Mediodía Inmóvil.
Quests: Otilia, Escriba amable, contratos falsos.

Voz:
Educado, impecable, frío. Nunca parece mentir: parece corregir la realidad.

## 17. Grupos sociales

### 17.1 Tías del Mantel Blanco

Grupo de rumor. Funcionan como NPC colectivo.

Ubicación:
Lavadero al mediodía, plaza en feria, posada en noches especiales.

Función:
Rumores, testimonios, reputación social, pistas.

Mecánica:
Afinidad grupal o reputación local.

Voz:
Coro de sabiduría rural, ironía y precisión quirúrgica.

### 17.2 Milicia de Campana

Grupo funcional.

Ubicación:
Campo Norte, Corral de Oficios, plaza en eventos.

Función:
Defensa local, tutorial de combate, eventos.

### 17.3 Aprendices del Caldero Feliz

Grupo de crafting/cocina.

Ubicación:
Puesto temporal, panadería, feria.

Función:
Recetas, ingredientes, quests repetibles.

### 17.4 Purificadores discretos

Grupo antagonista social.

Ubicación:
Plaza en eventos, callejones, donaciones a capilla.

Función:
Contratos turbios, propaganda, tensión social.

## 18. Líneas ambientales

### 18.1 Sistema de barks

Barks son líneas cortas de NPCs. Sirven para vida ambiental.

Tipos:
- saludo.
- despedida.
- idle.
- reacción a jugador.
- reacción a evento.
- reacción a hora.
- reacción a reputación.
- combate.
- tienda.

Ejemplo Doña Marga idle:
“Pex, como esa cuchara se mueva sola otra vez, voy a tener una conversación con tu gelatina interior”.

Ejemplo Bimba al ver jugador:
“¡Eh! Tengo tres rumores, dos son ciertos y uno cobra entrada”.

### 18.2 Frecuencia

Evitar spam. Barks deben tener cooldown por NPC y sala.

### 18.3 Barks por estado

Si Otilia restaurada:
Otilia: “Hoy existo en tres documentos. Estoy pensando en pedir cuarto por vicio”.

Si panadería quemada:
Marga: “Huele mejor que ayer. Eso no es elogio”.

## 19. Datos técnicos YAML

### 19.1 Ejemplo NPC

```yaml
id: npc_dona_marga_panbendito
name: Doña Marga Panbendito
aliases: [marga, panadera, dona marga]
type: essential
race: humana_altherion
age: 56
baseLocation: villaclara_panaderia_principal
factions:
  - villaclara
  - caldero_feliz_informal
services:
  - shop_food
  - cooking_training_basic
  - quest_giver
personality:
  traits: [calida, autoritaria, sarcastica, protectora]
  desire: Mantener Villaclara alimentada y segura.
  fear: Que la mazmorra bajo su panadería dañe a sus vecinos.
  secret: Vio una gota del Cáliz caer en el Pozo Cantante.
voice:
  register: rural_autoritario
  humor: seco
  catchphrase: Aquí se entra con hambre, no con tonterías.
routine:
  madrugada: villaclara_panaderia_hornos
  manana: villaclara_panaderia_principal
  mediodia: villaclara_panaderia_principal
  tarde: villaclara_panaderia_principal
  noche: villaclara_panaderia_cerrada
questOverrides:
  villaclara_pex_cucharas:
    activeLocation: villaclara_panaderia_principal
affinity: true
memoryFlags:
  - marga_ayudo_pex
  - marga_quemo_bodega
  - marga_descubrio_sotano
```

### 19.2 Ejemplo diálogo topic

```yaml
id: dialogue_marga_pex
author: npc_dona_marga_panbendito
topic: pex
conditions:
  default:
    text: >
      Pex es una criatura encantadora, siempre que no tengas cucharas, llaves, botones o expectativas.
  questActive:villaclara_pex_cucharas:
    text: >
      Ese charco con conciencia me ha robado doce cucharas. Doce. Eso ya no es travesura, es logística.
    options:
      - id: offer_help
        text: Me encargaré de seguirlo.
        effects:
          - questAdvance: villaclara_pex_cucharas:follow_pex
      - id: defend_pex
        text: Quizá tenga una razón.
        effects:
          - affinityChange: npc_pex_slime:+2
          - affinityChange: npc_dona_marga_panbendito:-1
```

### 19.3 Ejemplo rutina con condición

```yaml
id: npc_varo_nomenclaro
routine:
  manana: villaclara_ayuntamiento
  mediodia: villaclara_plaza_alba_chica
  tarde: villaclara_archivo_municipal
  noche: villaclara_archivo_municipal
conditionalRoutine:
  - condition: questCompleted:villaclara_otilia_no_existe && flag:varo_exposed
    location: hidden
  - condition: questActive:villaclara_escriba_amable
    noche: villaclara_archivo_municipal_sombra
```

## 20. Implementación técnica en Ranvier

### 20.1 Bundle recomendado

inheron-npcs

Subcarpetas:
- commands/dialogue/
- data/npcs/
- data/dialogues/
- data/routines/
- data/barks/
- data/services/
- data/npc_memory.yml
- lib/NPCManager.js
- lib/RoutineManager.js
- lib/DialogueManager.js
- lib/NPCMemoryManager.js
- lib/NPCServiceManager.js
- lib/BarkManager.js
- lib/NPCAffinityManager.js

### 20.2 Managers principales

NPCManager:
Carga y consulta NPCs, estados, ubicaciones.

RoutineManager:
Resuelve ubicación según hora, quest y evento.

DialogueManager:
Gestiona topics, opciones, condiciones y efectos.

NPCMemoryManager:
Guarda flags cualitativos por jugador/NPC.

NPCAffinityManager:
Gestiona afinidad numérica si aplica.

NPCServiceManager:
Activa tiendas, curación, entrenamiento y servicios.

BarkManager:
Líneas ambientales con cooldown.

### 20.3 Eventos

- npcTalkedTo.
- npcTopicSelected.
- npcDialogueChoice.
- npcAffinityChanged.
- npcMemoryAdded.
- npcStateChanged.
- npcMovedByRoutine.
- npcServiceUsed.
- npcBarkTriggered.
- npcProtected.
- npcInjured.
- npcNameAnchored.
- npcNameBlurred.

### 20.4 Persistencia

PlayerState:
- affinity por NPC.
- memory flags por NPC.
- topics conocidos.
- NPCs personales desbloqueados.

AreaState:
- NPC herido/ausente/protegido.
- evento local activo.
- rutina override local.

WorldState:
- muerte/desaparición/cambio global de NPC esencial, usar con cuidado.

### 20.5 Integración con otros bundles

QuestManager:
Diálogos avanzan quests.

ReputationManager:
Servicios y diálogos leen reputación.

ItemManager:
NPCs compran/venden/entregan objetos.

CombatManager:
NPCs pueden unirse, huir, ser protegidos o heridos.

Exploration:
NPCs aparecen en salas según rutina.

Chronicle:
Registra NPCs y recuerdos.

## 21. Comandos propuestos

### 21.1 Jugador

hablar [npc]
preguntar [npc] [tema]
decir [npc] [opción]
rumores [npc]
servicios [npc]
comprar/vender, si tienda
entrenar con [npc]
curar con [npc]
buscar [npc]
seguir [npc], si permitido
escoltar [npc]
recordar [npc]

### 21.2 Admin/debug

npcinfo [npc]
npcwhere [npc]
npcmove [npc] [room]
npcstate [npc] [state]
npcaffinity [player] [npc] [value]
npcmemory [player] [npc]
setnpcmemory [player] [npc] [flag]
clearnpcmemory [player] [npc] [flag]
reloadnpc [npc]
validatedialogues
validateroutines

## 22. Formatos de salida

### 22.1 Hablar con NPC

```
Doña Marga Panbendito
La panadera te mira desde detrás del mostrador. Sus manos están cubiertas de harina y autoridad.

Temas:
1. Comprar pan.
2. Pex.
3. El sótano.
4. Rumores de Villaclara.
5. Trabajo disponible.

Dice: “Si vienes por pan, perfecto. Si vienes por problemas, coge número”.
```

### 22.2 NPC ausente

```
No ves a Hermana Lúa en la capilla.
Una vela sigue encendida junto al altar y alguien ha dejado una nota: “He ido al Pozo Cantante. Si la campana suena antes de que vuelva, no respondas en voz alta”.
```

### 22.3 Servicio condicionado

```
Taren puede reparar tu espada, pero frunce el ceño al ver el brillo blanco de la hoja.
“Esto no es daño normal. Te la afilo, sí. Pero si empieza a escribir sola, vas a la capilla”.
```

### 22.4 Memoria de NPC

```
Otilia Cuerda
Estado: Nombre restaurado.
Relación: Confía en ti.
Recuerdos:
- Defendiste su existencia ante el archivo municipal.
- Fennel cantó su copla gracias a tu ayuda.
- Varo sabe que sospechas.
```

## 23. Roadmap de implementación

### Fase A: NPCs básicos
- Data de NPCs.
- Ubicación base.
- hablar [npc].
- Topics simples.
- Servicios básicos.

### Fase B: Rutinas
- RoutineManager.
- Bloques de día.
- buscar NPC.
- NPC ausente con pistas.

### Fase C: Memoria y afinidad
- Flags por jugador/NPC.
- Afinidad para NPCs principales.
- Diálogos por memoria.

### Fase D: Quests y diálogos ramificados
- Opciones condicionadas.
- Efectos de diálogo.
- Integración con QuestManager.

### Fase E: Servicios con estado
- Tiendas por reputación.
- Curación/entrenamiento/reparación contextual.
- Stock variable.

### Fase F: Barks y vida ambiental
- Líneas ambientales.
- Cooldowns.
- Reacciones por evento.

### Fase G: NPCs en combate/eventos
- Protección.
- Herido/capturado/ausente.
- Aliados temporales.

## 24. Riesgos y soluciones

Riesgo: rutinas frustrantes.
Solución: pistas de ubicación, horarios simples, overrides de quest, buscar NPC.

Riesgo: demasiada escritura.
Solución: empezar con topics base y barks, ampliar NPCs esenciales.

Riesgo: memoria demasiado compleja.
Solución: flags cualitativos para eventos importantes; afinidad solo en NPCs clave.

Riesgo: NPCs bloquean quests si están ausentes.
Solución: quest override y alternativas.

Riesgo: diálogos largos.
Solución: topics claros, opciones cortas, escenas separadas.

Riesgo: NPCs esenciales mueren o desaparecen accidentalmente.
Solución: estados herido/capturado/borrado antes que muerte permanente.

## 25. Recomendación de Fase 1

Implementar primero estos NPCs con memoria y rutinas:
1. Doña Marga Panbendito.
2. Pex.
3. Hermana Lúa Candela.
4. Silo Brincacepa.
5. Otilia Cuerda.
6. Bimba Cascabel.
7. Joro del Segundo Gallo.
8. Mirta Cesta Serena.
9. Taren Buenclavo.
10. Varo Nomenclaro.

Implementar como grupos:
- Tías del Mantel Blanco.
- Milicia de Campana.
- Aprendices del Caldero Feliz.

Topics mínimos:
- saludo.
- servicio.
- rumores.
- quest activa.
- despedida.

Memorias mínimas:
- ayudó a Pex.
- quemó/no quemó bodega.
- restauró nombre de Otilia.
- sospecha de Varo.
- protegió Villaclara.

## 26. Cierre

El sistema de NPCs vivos es el que hará que Villaclara deje de ser un hub y se convierta en hogar. Las quests pueden guiar, el combate puede emocionar y el inventario puede guardar reliquias, pero son los NPCs quienes harán que el jugador quiera volver.

Queremos que Doña Marga recuerde tus incendios, que Otilia recuerde tu defensa, que Pex recuerde si fuiste amable, que Lúa confíe en ti cuando la campana cante un nombre imposible y que Varo sonría con demasiada educación cuando sepa que estás cerca de la verdad.

Si el mundo tiene memoria, sus habitantes deben tenerla también.

FIN DEL DOCUMENTO DE NPCS VIVOS, DIÁLOGOS Y RUTINAS
