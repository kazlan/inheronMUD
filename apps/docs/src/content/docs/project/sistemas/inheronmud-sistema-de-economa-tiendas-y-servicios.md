---
title: "INHERONMUD — SISTEMA DE ECONOMÍA, TIENDAS Y SERVICIOS"
---

# INHERONMUD — SISTEMA DE ECONOMÍA, TIENDAS Y SERVICIOS
## Diseño detallado para moneda, precios, tiendas, servicios, contratos, recompensas y economía local en Ranvier

Documento de diseño sistémico. Objetivo: definir cómo funcionará la economía de InheronMUD: moneda, fuentes de ingresos, gastos, tiendas, servicios, stocks, precios, reputación, contratos de gremio, materiales, loot vendible, inflación controlada y consecuencias económicas de quests. La economía debe apoyar la aventura, reforzar el mundo y dar peso a las decisiones del jugador sin convertir Villaclara en una hoja de cálculo con olor a cebolla.

Stack previsto: Ranvier / Node.js.
Zona inicial de referencia: Villaclara, Altherion.
Sistemas relacionados: inventario/loot/reliquias, quests/arcos, NPCs, reputación, crafting, mazmorras, bestiario, progreso, tiempo/calendario, muerte/derrota y Crónica Viva.

## 1. Principios de diseño

### 1.1 La economía debe servir al juego, no secuestrarlo

La economía debe crear decisiones interesantes:
- ¿Compro pociones o ahorro para reparar equipo?
- ¿Vendo este gel raro o lo guardo para una receta?
- ¿Pago identificación o busco a un Arcanista?
- ¿Acepto un contrato sospechoso porque paga demasiado?

Pero no debe forzar farmeo aburrido. Las quests, los arcos y el descubrimiento deben ser mejores fuentes de progreso que matar cien bichos por monedas.

### 1.2 Los precios cuentan relaciones

En InheronMUD, el precio no es solo mercado. También es memoria social.

Doña Marga puede venderte pan barato si salvaste su sótano. También puede cobrarte más si convertiste la bodega en una nube de harina caliente. Ambas cosas son economía. Una es descuento. La otra es pedagogía.

### 1.3 El loot debe tener salida útil

Todo loot común debe poder hacer al menos una de estas cosas:
- Venderse.
- Usarse en crafting.
- Entregarse en contrato.
- Registrarse en bestiario.
- Convertirse en reputación.
- Servir como herramienta contextual.

Si un objeto solo existe para acumular polvo y arrepentimiento, debe revisarlo Bolso.

### 1.4 Controlar inflación desde el inicio

Fuentes de moneda deben tener sumideros claros. Si el jugador gana soles sin gastarlos en nada útil, la economía muere joven y con bolsillos llenos.

Sumideros sanos:
- Posada.
- Reparaciones.
- Identificación.
- Viajes.
- Herramientas.
- Consumibles.
- Entrenamiento.
- Baúl ampliado.
- Limpieza de maldiciones.
- Crafting.
- Tasas de gremio avanzadas.

### 1.5 La economía debe ser local al principio

Fase 1 debe centrarse en Villaclara. La economía local debe reaccionar a quests, reputación y eventos. Más adelante se añadirá economía regional entre Altherion, Solazur, Candaluz, Verdanza y Luminara.

### 1.6 Servicios antes que tiendas infinitas

Comprar cosas importa, pero los servicios dan vida:
- Dormir.
- Reparar.
- Curar.
- Identificar.
- Entrenar.
- Enviar objetos.
- Encargar recetas.
- Registrar bestiario.
- Sellar reliquias peligrosas.

Un buen servicio puede ser más memorable que un objeto. Especialmente si el herrero te insulta con precisión profesional.

## 2. Moneda

### 2.1 Moneda base

Moneda principal: sol.
Plural: soles.

Subunidad opcional: brizna.
100 briznas = 1 sol.

Para fase 1, se recomienda usar solo soles enteros y evitar céntimos salvo para sabor textual.

### 2.2 Justificación de lore

El sol es moneda estándar de Altherion. Su nombre proviene de las primeras acuñaciones del Reino Solar, marcadas con el sello de Seralyne y la campana de San Orencio. Las monedas de Villaclara suelen estar gastadas, con más harina en los bordes de la que recomienda cualquier tesorero.

### 2.3 Valores orientativos fase 1

Pan básico: 2-3 soles.
Poción menor: 12-18 soles.
Noche en posada común: 8-12 soles.
Reparación menor: 5-20 soles.
Identificación simple: 15-30 soles.
Herramienta básica: 5-25 soles.
Arma básica: 30-80 soles.
Armadura básica: 50-150 soles.
Contrato Cobre simple: recompensa 15-50 soles.
Quest de arco: 20-80 soles + reputación/objeto.

### 2.4 No abusar de números grandes

Mantener cifras pequeñas ayuda a que el jugador entienda valor. Si una croqueta cuesta 800 soles al nivel 3, alguien en economía ha abierto una grieta inflacionaria y debe ser enviado a hablar con Ojo.

## 3. Fuentes de ingresos

### 3.1 Quests

Fuente principal de moneda en progresión normal.

Tipos:
- Quests de arco.
- Contratos de gremio.
- Encargos de NPC.
- Eventos dinámicos.
- Repetibles con límite.

Las quests deben pagar moneda, pero también reputación, objetos, acceso y Crónica.

### 3.2 Contratos del Gremio

Fuente formal de ingresos de aventurero.

Rango Cobre:
15-60 soles.

Hierro:
50-150 soles.

Plata:
150-400 soles.

Oro:
400-900 soles.

Alba:
900+ soles, pero con recompensas políticas/reliquias.

Leyenda:
No se mide solo en soles.

### 3.3 Loot vendible

Materiales de enemigos, trofeos, objetos comunes y hallazgos.

Debe dar ingresos moderados, no superar quests principales.

### 3.4 Crafting y profesiones

El jugador puede vender comida, pociones, mapas, informes, materiales refinados o encargos.

Control:
- Límite por demanda diaria/semanal.
- Precios decrecientes si vende demasiados iguales.
- Mayor ganancia por encargos, no por spam.

### 3.5 Bestiario y Archivo de Monstruos

Paga por conocimiento, no solo cadáveres.

Recompensas:
- Primera ficha completa.
- Debilidad descubierta.
- Captura no letal.
- Observación de habilidad rara.
- Variante registrada.

### 3.6 Exploración

Ingresos por:
- Cofres.
- Secretos.
- Mapas raros.
- Reliquias menores.
- Materiales.
- Objetos recuerdo, normalmente no vendibles.

### 3.7 Reputación como ingreso indirecto

Una reputación alta genera ahorro:
- Descuentos.
- Servicios gratis.
- Fiado.
- Acceso a mejores contratos.
- Regalos.

## 4. Sumideros económicos

### 4.1 Consumibles

Pociones, comida, herramientas de uso, bombas, agua clara, tiza, velas.

Deben ser útiles sin sustituir clases.

### 4.2 Reparación

Durabilidad ligera, principalmente por derrota, eventos y uso extremo.

Reparaciones relevantes:
- Armas/armaduras.
- Focos arcanos.
- Instrumentos.
- Herramientas.
- Contenedores.

### 4.3 Identificación

Objetos raros, reliquias dormidas, maldiciones, Cámara, Verdanza e imposibles.

Debe costar lo suficiente para que el jugador piense, pero no tanto que nunca identifique nada.

### 4.4 Posada y descanso

Descanso largo, baúl, rumores, seguridad.

La posada debe ser un gasto útil, no castigo.

### 4.5 Viaje

Caravanas, barcas, guías, rutas seguras.

Inicialmente poco relevante en Villaclara, importante al abrir Altherion.

### 4.6 Entrenamiento

Talentos, habilidades generales, profesiones, respec parcial.

No todas las habilidades se compran. Algunas se ganan por nivel o quest.

### 4.7 Crafting

Ingredientes raros, herramientas, estaciones, recipientes, recetas.

### 4.8 Ampliación de almacenamiento

Baúl, bolsa de ingredientes, estuche de cartógrafo, caja de reliquias.

### 4.9 Limpieza/contención de maldiciones

Servicio caro pero ocasional.

Ejemplo:
Contener una Pluma de Tinta Blanca cuesta más que identificar una espada rara, porque la espada solo corta; la pluma discute con la realidad.

## 5. Precios y modificadores

### 5.1 Fórmula base

Precio final = precio base × modificador de tienda × modificador de reputación × modificador de afinidad × modificador de evento × modificador de disponibilidad.

Para implementación, usar porcentajes simples.

### 5.2 Modificador de reputación

Reputación muy baja:
+25% a +50%, servicios limitados.

Baja:
+10% a +20%.

Neutral:
0%.

Buena:
-5% a -10%.

Alta:
-10% a -20%.

Heroica/local:
-20% a -30%, regalos puntuales.

### 5.3 Afinidad personal

Afinidad con NPC puede modificar precio adicionalmente.

Ejemplo:
Doña Marga con afinidad alta:
-10% en comida, acceso a recetas.

Marga enfadada por bodega quemada:
+20% en pan durante X días o hasta compensación.

### 5.4 Modificador de evento

Ejemplos:
Panadería en crisis:
Pan +20%, ingredientes -10% si ayudas.

Feria de Cosecha:
Comida -10%, objetos raros +15%.

Ataque de conejos:
Herramientas agrícolas +20%, contratos de defensa +mejor pago.

Contratos falsos activos:
Algunos pagos demasiado altos, pero riesgo de Cámara.

### 5.5 Disponibilidad

Stock bajo:
+10% a +30%.

Stock alto:
-5% a -15%.

Objeto raro:
Precio fijo o subasta/negociación.

## 6. Tiendas

### 6.1 Anatomía de tienda

Cada tienda debe tener:
- ID.
- Nombre.
- NPC responsable.
- Ubicación.
- Tipo.
- Stock base.
- Stock variable.
- Servicios.
- Horario.
- Modificadores por reputación.
- Líneas de compra/venta.
- Reglas de compra de loot.

### 6.2 Tipos de tienda

Comida.
General.
Herrería.
Alquimia.
Capilla.
Gremio.
Posada.
Mercado ambulante.
Tienda secreta.
Especialista de profesión.

### 6.3 Stock base y variable

Stock base:
Siempre o casi siempre disponible.

Stock variable:
Depende de:
- Día.
- Evento.
- Quest.
- Reputación.
- Rango.
- Suministro regional.

### 6.4 Tiendas no infinitas, pero tampoco frustrantes

Consumibles básicos deben reponerse. Objetos raros pueden agotarse.

Regla fase 1:
- Básicos: stock diario o ilimitado razonable.
- Buenos/raros: stock limitado por reset/evento.
- Quest/reliquia: único o controlado.

## 7. Tiendas iniciales de Villaclara

### 7.1 Panadería Panbendito

NPC: Doña Marga Panbendito.
Tipo: comida, cocina, buffs, quest.

Stock base:
- Pan de Alba Serena.
- Pan duro reglamentario.
- Bollito de descanso.
- Empanadilla de Campo Norte.

Stock desbloqueable:
- Croqueta de Maná Menor.
- Bollo de Memoria Tibia.
- Pan Antipegote.
- Masa sellada para dungeon.

Compra:
- Harina lunar.
- Gel frutal limpio.
- Ingredientes comestibles.

No compra:
- Tinta blanca.
- Armas.
- Cualquier cosa que Pex esté mirando demasiado.

Modificadores:
- Ayudó a Pex: descuento pequeño.
- Quemó bodega: recargo temporal.
- Completó Sótano limpio: receta desbloqueada.

### 7.2 La Cesta Serena

NPC: Mirta Cesta Serena.
Tipo: tienda general, herramientas, mapas, curiosidades.

Stock base:
- Cuerda de Cáñamo Honrada.
- Tiza de Mazmorra Cívica.
- Vela común.
- Frascos vacíos.
- Kit de escriba barato.
- Mochila básica.

Stock variable:
- Mapa feo pero útil.
- Ganzúa simple.
- Caja de reliquia menor.
- Moneda rara.
- Botas del Paso Dramático, evento raro.

Compra:
- Materiales comunes.
- Documentos no peligrosos.
- Curiosidades.

Modificadores:
Mirta ofrece mejores herramientas si confía en el jugador.

### 7.3 Herrería Buenclavo

NPC: Taren Buenclavo.
Tipo: armas, armaduras, reparación.

Stock base:
- Espada corta de Gremio.
- Daga simple.
- Porra reglamentaria.
- Escudo de madera.
- Armadura ligera reparada.

Servicios:
- Reparación menor/media.
- Evaluación de metal.
- Mejora básica de equipo.

Stock desbloqueable:
- Refuerzo de placa córnea.
- Clavos aureanos.
- Escudo de Aldea restaurado.

Compra:
- Placas córneas.
- Metal.
- Herramientas dañadas.
- Armas.

No compra:
- Gel pegajoso sin recipiente. Lo aprendió una vez.

### 7.4 Posada del Segundo Gallo

NPC: Joro del Segundo Gallo.
Tipo: descanso, rumores, baúl, comida ligera.

Servicios:
- Descanso corto.
- Descanso largo.
- Baúl local.
- Rumores.
- Contratación de habitación.
- Fiado limitado.

Stock:
- Sopa de viaje.
- Sidra sin misterio.
- Bocadillo de guardia.

Modificadores:
- Forasteros pueden recibir primera noche con descuento si tienen recomendación.
- Deudas generan flags.

### 7.5 Capilla del Sol Quieto

NPC: Hermana Lúa Candela.
Tipo: curación, bendiciones, identificación espiritual, limpieza de estados.

Servicios:
- Curación menor.
- Limpieza de estados leves.
- Bendición de viaje.
- Identificación de objetos sagrados/falsos.
- Contención de maldiciones menores.

Coste:
Puede ser donativo flexible según reputación.

No funciona como tienda agresiva. La Capilla acepta donativos, favores y materiales sagrados.

### 7.6 Oficina del Gremio / Tablón Cobre

NPC: Oficial local o Silo/Gilda según fase.
Tipo: contratos, recompensas, rango, bestiario básico.

Servicios:
- Aceptar contratos.
- Entregar pruebas.
- Cobrar recompensas.
- Registrar rango.
- Comprar trofeos homologados.
- Evaluar ficha de bestiario.

Stock:
- Kit Cobre básico.
- Placa Cobre provisional.
- Contratos disponibles.

### 7.7 Mercado de Feria

Tipo: temporal/evento.

NPCs variables.

Stock:
- Ingredientes raros.
- Objetos decorativos.
- Mapas dudosos.
- Mascotas pequeñas futuras.
- Talismanes menores.

Riesgo:
Contratos falsos y objetos demasiado baratos.

## 8. Servicios

### 8.1 Descanso

Descanso corto:
Recupera parte de vida/energía/recursos. Más barato. No limpia estados fuertes.

Descanso largo:
Recupera completo, limpia estados normales, actualiza algunas rutinas y stocks.

Precios fase 1:
Descanso corto: 3-5 soles.
Noche común: 8-12 soles.
Noche buena: 18-25 soles, con buff pequeño.

### 8.2 Reparación

Coste según rareza y daño.

Común/Bueno:
Barato.

Artesanal/Raro:
Medio.

Reliquia:
Requiere especialista o quest.

Ejemplo:
Reparar espada dañada común: 8 soles.
Reparar escudo raro muy dañado: 40 soles.
Reparar foco arcano humeante: 25 soles + identificación si hay Sobrecarga.

### 8.3 Curación

No sustituir descanso ni clases, pero ayuda.

Curación menor:
5-15 soles o donativo.

Limpiar estado leve:
8-20 soles.

Borrón de Nombre:
No se cura con dinero normal. Requiere quest, Crónica o ritual.

### 8.4 Identificación

Identificación simple:
15-30 soles.

Identificación rara:
40-100 soles.

Reliquia dormida:
Puede requerir quest, clase o especialista.

Objeto de Cámara:
Puede ser peligroso de identificar. El servicio puede negarse.

### 8.5 Entrenamiento

Tipos:
- Habilidad general básica.
- Talento.
- Profesión.
- Reentrenamiento.

No todo se compra. Requiere nivel, reputación, rango o quest.

Ejemplo:
Aprender Ojo para Baldosas Sospechosas:
20 soles + favor de Inspector/Gremio.

Reentrenar talento:
Coste alto + tiempo + NPC apropiado.

### 8.6 Transporte

Fase 1 limitado:
- Carro a Candaluz, futuro.
- Ruta a Solazur, futuro.
- Guía local, opcional.

Debe integrarse con sistema de viaje.

### 8.7 Almacenamiento

Baúl local:
Gratis o barato al alquilar habitación.

Ampliación de baúl:
Coste creciente.

Almacén de Gremio:
Desbloqueo por rango.

## 9. Contratos y recompensas

### 9.1 Contratos como economía formal

Los contratos del Gremio regulan pagos y dan estructura al jugador.

Cada contrato tiene:
- Rango.
- Emisor.
- Pago base.
- Bonos opcionales.
- Penalizaciones.
- Reputación.
- Prueba requerida.

### 9.2 Contratos Cobre fase 1

Conejos con casco:
Pago base: 25 soles.
Bonus: +10 por placa intacta.
Bonus: +reputación si no daña cultivos.

Pex y las cucharas desaparecidas:
Pago directo bajo o en especie.
Recompensa: comida, reputación, acceso dungeon.

Inspección de sótano:
Pago: 40 soles.
Bonus: informe completo +15.
Bonus: no quemar bodega +título.

Harina lunar extraviada:
Pago: 20 soles.
Bonus por recuperar saco intacto.

### 9.3 Bonos opcionales

Los contratos deben premiar juego interesante:
- Captura no letal.
- Menos daños colaterales.
- Prueba adicional.
- Informe de bestiario.
- Protección de NPC.
- Resolución diplomática.

### 9.4 Contratos falsos

La Cámara y otros antagonistas pueden publicar contratos con pagos demasiado altos.

Indicadores:
- Sello perfecto.
- Lenguaje rígido.
- Pago excesivo.
- Objetivo socialmente turbio.
- Tinta sin sombra.

Recompensas:
Pueden pagar, pero aumentan Atención de Cámara o reputación negativa.

## 10. Compra y venta de loot

### 10.1 Tipos de compradores

Generalista:
Compra casi todo con precio bajo.

Especialista:
Compra ciertas categorías mejor.

Gremio:
Compra trofeos homologados.

Crafting:
Compra ingredientes/materiales.

Capilla:
Acepta objetos sagrados/peligrosos.

Mercado negro futuro:
Compra cosas peligrosas, con consecuencias.

### 10.2 Precios de venta

Por defecto, tiendas compran al 25-40% del valor base.

Especialistas compran al 50-70% si encaja.

Reputación alta puede mejorar ligeramente.

Objetos raros pueden requerir tasación.

### 10.3 Saturación de mercado

Si el jugador vende demasiados materiales iguales, precio baja temporalmente.

Ejemplo:
Vender 40 placas córneas pequeñas en un día:
Taren: “Si traes otra, empiezo a construir una iglesia al conejo”.
Precio -20% temporal.

### 10.4 Demanda dinámica simple

Eventos pueden subir demanda:
- Ataque de conejos: placas, armas, vendas.
- Feria: comida, adornos.
- Dungeon abierta: tiza, cuerdas, pociones.
- Cámara activa: velas, sellos, identificación.

## 11. Economía y crafting

### 11.1 Ingredientes como puente económico

Ingredientes pueden ser:
- Vendidos.
- Cocinados.
- Usados en alquimia.
- Entregados por encargo.
- Usados en quests.

El valor de vender debe ser menor que el valor de usar bien en crafting, pero vender debe ser válido.

### 11.2 Encargos de profesión

Encargos rotativos:
- Nana pide gel frutal.
- Taren pide placas córneas.
- Lúa pide agua clara.
- Mirta pide mapas raros.

Pagan moneda + reputación/profesión.

### 11.3 Calidad afecta precio

Calidad:
Dañado: 50% valor.
Normal: 100%.
Bueno: 125%.
Excelente: 160%.
Extraño: variable.
Perfecto: 200% o más, si comprador adecuado.

### 11.4 Productos crafted

Evitar explotación:
- Coste de ingredientes + tiempo + estación.
- Demanda limitada.
- No siempre vender al jugador más caro que suma de ingredientes sin límites.

## 12. Economía y reputación

### 12.1 Reputación como memoria económica

Los NPCs no ajustan precios porque sí. Ajustan porque recuerdan.

Ejemplos:
- Salvó el pozo: descuentos locales.
- Protegió a Otilia: Tías ofrecen rumores gratis.
- Quemó bodega: recargo de Marga.
- Ayudó a milicia: mejor pago en defensa.

### 12.2 Estados sociales económicos

Héroe local:
Descuentos y regalos menores.

Cliente fiable:
Acceso a fiado.

Sospechoso:
Precios peores, menos stock raro.

Deudor simpático:
Puede fiar, pero con límite.

Deudor problemático:
Servicios bloqueados, rumores negativos.

Quemador de bodegas:
Etiqueta económica concreta. Muy seria. Muy evitable.

### 12.3 Facciones y servicios

Capilla alta:
Curación más barata, bendiciones especiales.

Gremio alto:
Mejores contratos y almacén.

Caldero Feliz alto:
Recetas y mejores ingredientes.

Cámara alta oculta:
Contratos sospechosos aparecen más. No es bueno aunque paguen bien.

## 13. Economía y muerte/derrota

### 13.1 Coste de derrota

Derrota no debe arruinar al jugador. Costes posibles:
- Reparación.
- Pérdida ligera de consumibles si justificable.
- Pago de rescate/curación.
- Tiempo perdido.
- Quest cambia estado.

No recomendado fase 1:
- Pérdida grande de oro.
- Drop de equipo completo.
- Castigo que obligue a grind.

### 13.2 Rescate

Si cae en dungeon:
- Gremio puede rescatar por coste bajo/moderado.
- Party puede rescatar gratis o con riesgo.
- Capilla puede recuperar con donativo.

### 13.3 Seguro de Gremio futuro

Rangos altos pueden pagar cuota para reducir coste de derrota.

## 14. Economía y arcos narrativos

### 14.1 Consecuencias económicas de quests

Pex y cucharas:
- Panadería recupera stock.
- Descuento si amable.
- Pex ayuda con objetos raros.

Otilia no existe:
- Tías del Mantel Blanco comparten rumores gratis.
- Archivo puede cobrar menos por copias legales.

El escriba amable:
- Contratos falsos detectados reducen riesgo económico.
- Si Varo escapa, aumentan estafas.

Mapa de Mediodía:
- Gremio reconoce Villaclara como punto estratégico.
- Mejores contratos.
- Viajes desbloqueables.

### 14.2 Economía como pista

Cambios raros en precios pueden indicar trama.

Ejemplo:
El precio de velas de Lúa sube porque alguien compra todas antes de que aparezcan contratos falsos.

### 14.3 Economía como decisión moral

Ejemplos:
- Aceptar pago alto por vigilar forasteros.
- Vender tinta blanca a Mirta o entregarla a Lúa.
- Cobrar a Otilia por ayudar o hacerlo como favor.
- Denunciar especulación de feria.

## 15. UI y comandos

### 15.1 Tiendas

comerciar [npc]
tienda [npc]
comprar [objeto]
vender [objeto]
vender todo [categoria]
valor [objeto]
stock [npc]
servicios [npc]

### 15.2 Servicios

descansar
alquilar habitacion
reparar [objeto]
identificar [objeto]
curar
limpiar estado [estado]
entrenar [habilidad]
baul
guardar [objeto]
sacar [objeto]

### 15.3 Contratos

tablon
contrato [nombre]
aceptar contrato [nombre]
entregar contrato
recompensas
rango gremio

### 15.4 Economía personal

monedas
balance, opcional
historial pagos, opcional para debug o jugadores muy ordenados.

### 15.5 Mensajes de compra

Compra simple:
“Compras Pan de Alba Serena x2 por 6 soles. Doña Marga añade una mirada que no aparece en el recibo”.

Venta con especialista:
“Taren compra Placa córnea intacta x3 por 24 soles. ‘Buen corte. El conejo no opinó, imagino’”.

Servicio condicionado:
“Hermana Lúa acepta tu donativo de 5 soles y limpia el Pegajoso leve. La luz huele a jabón y a paciencia”.

## 16. Formatos de salida

### 16.1 Tienda

```
Panadería Panbendito — Doña Marga
Reputación local: buena
Afinidad: cordial
Modificador de precio: -10%

Comida:
1. Pan de Alba Serena — 3 soles
2. Pan duro reglamentario — 1 sol
3. Bollito de descanso — 6 soles

Especial:
4. Croqueta de Maná Menor — 14 soles [desbloqueada]

Servicios:
- Encargo culinario
- Receta básica, requiere confianza

Doña Marga dice: “El pan no arregla todo, pero ayuda a discutir con el mundo”.
```

### 16.2 Servicio de reparación

```
Herrería Buenclavo
Taren revisa tu equipo.

Objetos reparables:
1. Espada corta de Gremio — dañado — 8 soles
2. Escudo de Aldea — gastado — 12 soles
3. Foco cristalino — humeante — requiere identificación
```

### 16.3 Contrato

```
Contrato Cobre: Conejos con casco
Emisor: Concejo de Villaclara
Pago base: 25 soles
Bonus: +10 soles por placa intacta
Bonus: +reputación si no se dañan cultivos
Zona: Campo Norte
Riesgo: bajo-medio

Nota: “Uno lleva algo parecido a un casco. Nadie está orgulloso de esta frase”.
```

## 17. Datos YAML

### 17.1 Tienda

```yaml
id: shop_panbendito
name: Panadería Panbendito
npc: npc_dona_marga_panbendito
location: villaclara_panaderia_principal
type: food
hours: [madrugada, manana, mediodia, tarde]
priceModifiers:
  reputation:
    villaclara:
      good: -0.10
      hero: -0.20
  npcMemory:
    marga_quemo_bodega: 0.20
    marga_ayudo_pex: -0.05
stock:
  base:
    - item: pan_alba_serena
      price: 3
      quantity: unlimited_basic
    - item: pan_duro_reglamentario
      price: 1
      quantity: 10
  unlocked:
    - condition: questCompleted:villaclara_pex_cucharas
      items:
        - item: croqueta_mana_menor
          price: 14
          quantity: 5
buys:
  tags: [ingredient, food, comestible]
  excludedTags: [camara, maldito]
services:
  - cooking_training_basic
```

### 17.2 Servicio

```yaml
id: service_identificacion_lua
name: Identificación espiritual menor
provider: npc_hermana_lua_candela
location: villaclara_capilla_sol_quieto
basePrice: 20
acceptsDonation: true
requirements:
  any:
    - reputation:villaclara >= 0
    - questActive:villaclara_otilia_no_existe
targets:
  tags: [relic, camara, sombra, memoria]
limits:
  maxRarity: rare
failure:
  ifTag: camara
  message: La luz se tensa. Hermana Lúa decide no tocarlo sin preparación.
```

### 17.3 Contrato

```yaml
id: contract_conejos_con_casco
name: Conejos con casco
rank: copper
issuer: concejo_villaclara
board: villaclara_tablon_gremio
levelRange: [2, 5]
baseReward:
  currency: 25
  reputation:
    villaclara: 3
bonusRewards:
  - condition: deliveredItem:placa_corneal_intacta:1
    currency: 10
  - condition: noFlag:campo_norte_cultivos_danados
    reputation:
      villaclara: 2
objectives:
  - defeatOrDriveAway: conejo_acorazado_joven
    count: 3
notes: >
  Uno de ellos lleva algo parecido a un casco. Nadie está orgulloso de haberlo escrito.
```

## 18. Implementación técnica en Ranvier

### 18.1 Bundle recomendado

inheron-economy

Subcarpetas:
- commands/economy/
- data/currency.yml
- data/shops/
- data/services/
- data/contracts/
- data/price_modifiers.yml
- data/market_events.yml
- lib/EconomyManager.js
- lib/ShopManager.js
- lib/ServiceManager.js
- lib/ContractRewardManager.js
- lib/PriceManager.js
- lib/MarketStateManager.js
- lib/TransactionLog.js

### 18.2 Managers principales

EconomyManager:
Controla moneda del jugador, transacciones, validaciones.

ShopManager:
Carga tiendas, stock, compra/venta.

ServiceManager:
Gestiona servicios y costes.

PriceManager:
Calcula precio final con modificadores.

ContractRewardManager:
Calcula recompensas de contratos y bonos.

MarketStateManager:
Eventos de mercado, stock variable, saturación.

TransactionLog:
Registro debug y protección contra exploits.

### 18.3 Eventos

- playerBoughtItem.
- playerSoldItem.
- playerUsedService.
- playerPaidFee.
- playerReceivedCurrency.
- shopStockChanged.
- marketEventStarted.
- marketEventEnded.
- contractRewardPaid.
- debtCreated.
- debtPaid.
- priceModifierApplied.

### 18.4 Integración

ItemManager:
Objetos, rareza, tags, valor base.

NPCManager:
Servicios, afinidad, horarios.

ReputationManager:
Precios y acceso.

QuestManager:
Recompensas, contratos, consecuencias.

Crafting:
Ingredientes, encargos, productos.

Combat/Loot:
Materiales y botín.

WorldState:
Eventos de mercado y stocks.

## 19. Control de exploits

### 19.1 Compra/venta infinita

Evitar que un objeto pueda comprarse barato y venderse caro en otra tienda sin coste o límite.

Soluciones:
- Precios de venta siempre menores que compra base.
- Stock limitado.
- Demanda limitada.
- Rutas de trade futuras con riesgo/tiempo.

### 19.2 Crafting rentable infinito

Soluciones:
- Demanda diaria.
- Coste de estación.
- Calidad variable.
- Productos crafted vendidos a precio reducido salvo encargos.

### 19.3 Contratos repetibles

Soluciones:
- Cooldowns.
- Variantes.
- Menor pago tras repetición.
- Reputación/profesión como recompensa principal.

### 19.4 Duplicación de loot

Necesario QA:
- Instancias no duplican recompensas únicas.
- Objetos de quest no vendibles.
- Party loot con elegibilidad.

## 20. Roadmap de implementación

### Fase A: Moneda y transacciones
- Moneda soles.
- Comandos monedas, comprar, vender.
- Valor base de objetos.
- TransactionLog.

### Fase B: Tiendas de Villaclara
- Panbendito.
- Cesta Serena.
- Buenclavo.
- Segundo Gallo.
- Capilla.

### Fase C: Servicios
- Descanso.
- Baúl.
- Reparación.
- Curación leve.
- Identificación simple.

### Fase D: Contratos Cobre
- Tablón.
- Pagos base.
- Bonos opcionales.
- Entrega de pruebas.

### Fase E: Modificadores
- Reputación.
- Afinidad.
- Quest flags.
- Eventos locales.

### Fase F: Mercado dinámico simple
- Stock variable.
- Saturación de venta.
- Feria.
- Crisis de panadería.

### Fase G: Crafting/economía avanzada
- Encargos.
- Calidad.
- Demanda.
- Profesiones.

## 21. QA y validación

Validaciones automáticas:
- Toda tienda referencia NPC existente.
- Todo item de stock existe.
- Todo servicio tiene proveedor.
- Precios no negativos.
- Modificadores dentro de rango seguro.
- Contratos tienen recompensa y objetivos.
- Objetos no vendibles bloqueados.
- Venta no genera más que compra base por defecto.

Casos de prueba:
- Comprar sin dinero.
- Comprar con reputación alta/baja.
- Vender loot a tienda general y especialista.
- Intentar vender objeto de quest.
- Reparar objeto dañado.
- Identificar objeto de Cámara.
- Cobrar contrato con bonus.
- Saturar mercado con muchas placas.
- Deuda de posada.

## 22. Recomendación fase 1

Implementar:
- Soles como moneda única.
- 5 tiendas/servicios principales: Panbendito, Cesta Serena, Buenclavo, Segundo Gallo, Capilla.
- Tablón Cobre con 4 contratos iniciales.
- Compra/venta básica.
- Precios por reputación y memoria para Doña Marga.
- Servicios: descanso, baúl, reparación, curación leve, identificación simple.
- Stock variable mínimo por quest.
- Venta especialista con mejor precio.
- Objetos de quest protegidos.
- Recompensas con moneda moderada y mucho valor narrativo.

Precios iniciales sugeridos:
- Pan de Alba Serena: 3 soles.
- Pan duro reglamentario: 1 sol.
- Poción menor: 15 soles.
- Croqueta de Maná Menor: 14 soles.
- Cuerda: 8 soles.
- Tiza de Mazmorra Cívica: 5 soles.
- Vela de Lúa: 20 soles o quest.
- Descanso corto: 4 soles.
- Noche común: 10 soles.
- Reparación menor: 8-15 soles.
- Identificación simple: 20 soles.
- Contrato Cobre básico: 25-40 soles.

## 23. Cierre

La economía de InheronMUD debe sentirse viva, local y recordable. No queremos una tienda genérica que compra veinte espadas sin pestañear. Queremos a Doña Marga vendiendo pan con memoria, a Taren evaluando placas de conejo con cansancio profesional, a Mirta ofreciendo mapas demasiado baratos, a Lúa aceptando donativos con cuidado y al Gremio pagando contratos que a veces huelen a tinta blanca.

El jugador debe ganar soles, sí. Pero también debe ganar confianza, favores, descuentos, deudas, acceso, recetas, rumores y esa clase de reputación que hace que una posada te guarde habitación aunque llegues cubierto de harina hostil.

Una buena economía no solo mueve dinero. Mueve historias.

FIN DEL DOCUMENTO DE ECONOMÍA, TIENDAS Y SERVICIOS
