# INHERONMUD — SISTEMA DE INVENTARIO, EQUIPO, LOOT Y RELIQUIAS
## Diseño detallado para objetos, equipo, botín contextual y reliquias con memoria en el motor de Inheron

Documento de diseño sistémico. Objetivo: definir cómo funcionarán los objetos de InheronMUD: inventario, equipo, ranuras, bolsas, rarezas, durabilidad ligera, loot contextual, identificación, objetos de quest, almacenamiento, botín de party, tags de crafting y reliquias dormidas o despiertas. El sistema debe ser cómodo de jugar, expresivo para el lore, útil para combate/quests/crafting y lo bastante flexible para que una cuchara pueda ser solo una cuchara... salvo cuando Pex la haya llevado a una grieta con hambre de cubiertos.

Stack previsto: Node.js / TypeScript (Motor Custom de Inheron).
Zona inicial de referencia: Villaclara, Altherion.
Sistemas relacionados: combate, quests, exploración, crafting, economía, reputación, progresión, bestiario, NPCs y Crónica Viva.

## 1. Principios de diseño

### 1.1 Los objetos deben contar mundo

Un objeto no es solo una línea de inventario. En InheronMUD, un objeto puede ser herramienta, pista, broma local, recuerdo, llave, ingrediente, prueba legal, arma, reliquia, problema familiar o excusa para que Doña Marga juzgue al jugador desde detrás del mostrador.

Regla de oro:
Todo objeto relevante debe responder a tres preguntas:
- ¿Para qué sirve mecánicamente?
- ¿Qué cuenta del mundo?
- ¿Cómo puede interactuar con quests, combate, crafting o reputación?

### 1.2 Inventario cómodo, no contabilidad de penitencia

El inventario debe tener límites para que las decisiones importen, pero no debe convertirse en una hoja fiscal con botas. Usaremos un sistema híbrido ligero: slots + tamaño/peso narrativo.

No queremos que el jugador abandone una aventura porque una zanahoria ocupa 0,17 unidades de carga. Queremos que piense si merece llevar tres escudos, veinte geles de slime y una estatua pequeña que “quizá sea importante”.

### 1.3 El loot debe premiar cómo juegas

No todo botín debe caer por matar. El sistema debe premiar:
- Derrotar.
- Capturar.
- Deshuesar.
- Cocinar.
- Investigar.
- Usar daño apropiado.
- Evitar destruir partes valiosas.
- Completar bestiario.
- Resolver sin violencia.

Ejemplo:
Un slime de mermelada derrotado con fuego puede dejar gel quemado. Atraído con pan duro y capturado puede dejar núcleo intacto. Estudiado por Inspector puede añadir una ficha de bestiario. Cocinado por un Cocinero puede convertirse en ingrediente con moral discutible.

### 1.4 Las reliquias despiertan por historia

Las reliquias no deben ser simplemente “objetos morados con números mejores”. Deben tener memoria, condiciones de despertar y relación con la Crónica Viva.

Una reliquia despierta cuando el jugador hace algo que resuena con su identidad:
- Proteger un pueblo.
- Cumplir un juramento.
- Restaurar un nombre borrado.
- Vencer un boss relevante.
- Resolver una quest de forma temática.
- Llevarla durante un arco importante.

### 1.5 Restricciones blandas, no cárceles de clase

Las clases pueden usar equipo fuera de su estilo, pero con penalizaciones o costes. Un Arcanista puede ponerse armadura pesada. El juego no se lo prohíbe. La Concentración, en cambio, presentará una queja formal con tres copias.

## 2. Modelo general de inventario

### 2.1 Sistema híbrido ligero

Usaremos:
- Slots de inventario.
- Tamaño de objeto.
- Etiquetas de carga para objetos especiales.

Cada personaje tiene una mochila base con número de slots. Algunos objetos ocupan más de un slot. Algunos son apilables.

Tamaños:
- Minúsculo: no ocupa slot individual si está en pila o contenedor adecuado.
- Ligero: 1 slot.
- Normal: 1 slot.
- Pesado: 2 slots.
- Enorme: 4 slots o requiere transporte especial.
- Inmanejable: no puede guardarse en inventario normal.

Ejemplos:
- Moneda: minúsculo.
- Pan de Alba Serena: ligero, apilable.
- Espada corta: normal.
- Escudo grande: pesado.
- Saco de harina lunar: pesado.
- Estatua de jardín con sospechas: enorme.
- Puerta de mazmorra con opiniones: inmanejable. No, Jorge, no cabe.

### 2.2 Capacidad inicial

Mochila básica:
- 24 slots.

Bolsillo rápido:
- 4 slots de consumibles/herramientas rápidas.

Equipo vestido:
No ocupa slots de mochila mientras esté equipado.

Bolsa de ingredientes inicial:
- 10 slots solo para ingredientes comunes.
- Mejorable por profesión/crafting/reputación.

Bolsa de documentos:
- Espacio especial para contratos, actas, mapas pequeños y cartas.
- Evita que objetos narrativos saturen mochila.

### 2.3 Ampliación de capacidad

Fuentes:
- Mochilas mejores.
- Bolsas de oficio.
- Rango de Gremio.
- Baúl de posada.
- Almacén del Gremio.
- Mascotas portadoras futuras.
- Reliquias de almacenamiento, con cuidado extremo.

Ejemplos:
Mochila de Cobre Reforzada:
+6 slots.

Bolsa de Ingredientes de Nana:
+10 slots de ingredientes, reduce deterioro de comida.

Estuche de Cartógrafo:
Mapas y documentos no ocupan slots normales.

### 2.4 Apilamiento

Objetos apilables:
- Monedas.
- Ingredientes comunes.
- Consumibles básicos.
- Materiales de crafting.
- Flechas/proyectiles.

Límites de pila:
- Consumibles: 10 por pila.
- Ingredientes comunes: 20 por pila.
- Materiales raros: 5 por pila.
- Objetos inestables: no apilan salvo contenedor especial.

Ejemplo:
Gel dorado nervioso no apila con gel dorado tranquilo. La diferencia es técnica, económica y ligeramente pegajosa.

## 3. Almacenamiento

### 3.1 Baúl personal de posada

Disponible desde fase 1 en la Posada del Segundo Gallo.

Características:
- 60 slots iniciales.
- Local a Villaclara.
- Seguro para objetos normales.
- No acepta objetos peligrosos sin contenedor.
- Puede guardar objetos recuerdo.

Tono:
Joro jura que nadie toca los baúles. El gallo del patio canta si alguien miente. Esta política ha reducido robos y aumentado discusiones al desayuno.

### 3.2 Almacén del Gremio

Desbloqueable por rango.

Cobre:
Sin almacén global.

Hierro:
Almacén del Gremio básico entre hubs principales de Altherion.

Plata+:
Mayor capacidad y envío entre regiones.

Restricciones:
- No transportar objetos malditos sin inspección.
- No transportar comida perecedera salvo contrato especial.
- No transportar slimes vivos en caja de documentos. Esta regla existe por algo.

### 3.3 Almacenes locales especiales

Ejemplos:
- Despensa de Doña Marga: ingredientes culinarios.
- Archivo municipal: documentos y actas.
- Capilla: reliquias sagradas y objetos benditos.
- Gremio: trofeos de bestiario.
- Herrería: materiales metálicos.

## 4. Ranuras de equipo

### 4.1 Ranuras principales

- Cabeza.
- Torso.
- Manos.
- Piernas.
- Pies.
- Capa/manto.
- Arma principal.
- Arma secundaria / escudo / foco.
- Amuleto.
- Anillo 1.
- Anillo 2.
- Herramienta.
- Reliquia menor.
- Bolsa/mochila.

### 4.2 Ranuras condicionales

Instrumento:
Visible para Bardos o personajes con entrenamiento musical.

Grimorio/foco avanzado:
Visible para Arcanistas y clases arcanas.

Utensilio culinario:
Visible para Cocinero de Mazmorra.

Kit profesional:
Para profesiones: cartografía, inspección, alquimia, herboristería.

Mascota/familiar:
No es equipo normal, pero se mostrará junto a ficha del personaje.

### 4.3 Restricciones blandas de equipo

Cada clase tiene equipo recomendado. Usar equipo fuera de estilo aplica penalizaciones suaves.

Ejemplos:
Armadura pesada en Arcanista:
- +defensa física.
- -recuperación de Concentración.
- +riesgo de Sobrecarga por fatiga.

Armadura pesada en Bardo:
- +defensa.
- -Voz máxima o Estrofa sostenida si no tiene talento.

Escudo grande en Duelista:
- +defensa.
- -Estilo generado por finta.

Utensilio no homologado en Cocinero:
- Puede funcionar.
- Doña Marga puede enterarse.

### 4.4 Competencia

Cada clase tiene competencias base:
- Armas simples.
- Armas marciales.
- Armas ligeras.
- Bastones/focos.
- Instrumentos.
- Escudos.
- Armaduras ligeras/medias/pesadas.
- Herramientas de oficio.

No competente:
- Puede equipar, pero sufre penalización de precisión, recurso o acción.

Talentos pueden ampliar competencias.

## 5. Tipos de objetos

### 5.1 Equipo

Armas, armaduras, focos, escudos, instrumentos, herramientas equipables.

### 5.2 Consumibles

Pociones, comida, pergaminos, bombas culinarias, ungüentos, agua clara, croquetas de maná.

### 5.3 Ingredientes

Materiales de cocina, alquimia, crafting, rituales y profesiones.

### 5.4 Materiales

Metal, madera, tela, cuero, cristal, hueso, placas, tintas, gemas.

### 5.5 Objetos de quest

Necesarios para quests o arcos. Protegidos contra venta/destrucción accidental.

### 5.6 Objetos recuerdo

Recompensas narrativas. Pueden ser cosméticas, equipables o registradas en Crónica.

### 5.7 Documentos

Cartas, actas, contratos, mapas, diarios, permisos, folios sellados.

### 5.8 Reliquias

Objetos con memoria, estado dormido/despierto, condiciones de resonancia y posible vínculo con el jugador.

### 5.9 Objetos peligrosos

Malditos, inestables, de Cámara, de Sombra, de Verdanza o planares. Requieren identificación, contención o reputación específica.

### 5.10 Basura útil

Objetos sin valor alto pero con posibles usos.

Ejemplos:
- Pan duro.
- Cuerda mordida.
- Botón negro.
- Cuchara doblada.
- Recibo ilegible.

En Inheron, “basura” es una opinión temporal.

## 6. Rarezas de objetos

### 6.1 Escala oficial

Común:
Objetos cotidianos o equipo básico.

Bueno:
Mejor calidad, pequeño bonus o durabilidad superior.

Artesanal:
Creado por artesano competente. Puede tener rasgo menor.

Raro:
Objeto especial, loot poco frecuente o creación avanzada.

Reliquia dormida:
Objeto con memoria latente. No está completamente despierto.

Reliquia despierta:
Objeto que ha respondido a una acción, nombre, juramento o arco.

Legendario:
Objeto histórico de gran poder y peso narrativo. (Color: Naranja)

Imposible:
Objeto de procedencia planar, anomalía, Trono de Nadie o realidad incompatible. Muy raro, regulado por sentido común y gritos del SystemMaster.

### 6.2 Rareza no equivale siempre a poder bruto

Un objeto Raro puede ser más útil en una quest que en combate. Una Reliquia Dormida puede tener stats modestos, pero potencial narrativo enorme.

Ejemplo:
Cinta de Otilia:
Rareza: objeto recuerdo.
Poder de combate: bajo.
Valor narrativo: alto.
Efecto: resistencia menor a Borrón en Villaclara.

### 6.3 Colores sugeridos para UI textual

Si el cliente lo permite:
- Común: blanco/gris.
- Bueno: verde.
- Artesanal: azul suave.
- Raro: violeta.
- Reliquia dormida: dorado tenue.
- Reliquia despierta: dorado brillante.
- Legendario: naranja/ámbar.
- Imposible: iridiscente o texto especial.

En texto plano, usar etiquetas:
[Común], [Bueno], [Raro], [Reliquia dormida].

## 7. Durabilidad

### 7.1 Principio

La durabilidad existe para dar peso a derrota, improvisación y objetos especiales, no para cobrar impuesto por respirar.

### 7.2 Cuándo baja durabilidad

Baja en:
- Derrota.
- Ataques especialmente destructivos.
- Uso de objeto improvisado como arma.
- Fallo crítico de crafting.
- Sobrecarga arcana que afecte foco.
- Trampas corrosivas.
- Eventos narrativos.

No baja por:
- Cada ataque normal.
- Caminar.
- Usar equipo de forma esperada en combate normal.

### 7.3 Estados de durabilidad

Intacto:
Sin penalización.

Gastado:
Sin penalización o mínima.

Dañado:
Pequeña penalización.

Muy dañado:
Penalización significativa, riesgo de fallo.

Roto:
No equipable o efecto muy limitado.

### 7.4 Reparación

Servicios:
- Herrería Buenclavo: armas/armaduras simples.
- Gremio: equipo aventurero.
- Arcanista/Capilla: focos y reliquias menores.
- Crafting: reparación propia si tiene profesión.

Coste:
Depende de rareza, daño y material.

Reliquias:
No siempre se “reparan”; a veces se reconcilian, se recuerdan o se convencen mediante quest.

## 8. Identificación de objetos

### 8.1 Qué requiere identificación

No todo debe identificarse. Requieren identificación:
- Reliquias dormidas.
- Objetos malditos.
- Objetos de Cámara.
- Objetos de Verdanza.
- Objetos imposibles/planares.
- Objetos con efectos ocultos.

### 8.2 Métodos de identificación

- Arcanista: Detectar Resonancia, Lectura de Reliquia.
- Clérigo: Sello de Verdad, luz sobre objetos sagrados o falsos.
- Inspector: análisis de peligro y normativa arcana.
- Bardo: memoria, nombres y ecos.
- Cartógrafo: procedencia, rutas y marcas.
- Tiendas/servicios: identificación por pago.
- Quest: identificación narrativa.

### 8.3 Estados de conocimiento

Desconocido:
Nombre genérico. “Anillo de metal frío”.

Sospechoso:
Algún rasgo descubierto. “Anillo con sombra retrasada”.

Identificado parcialmente:
Efecto básico conocido, riesgo oculto.

Identificado:
Nombre, rareza, efectos, riesgos.

Revelado por Crónica:
Objeto conectado a arco o memoria.

### 8.4 Mensajes útiles

Ejemplo:
“Este objeto no parece maldito. Parece peor: parece convencido de tener razón”.

## 9. Tags de objetos

### 9.1 Propósito

Los tags permiten integrar inventario con crafting, combate, quests, bestiario y economía.

### 9.2 Tags de tipo

- weapon.
- armor.
- consumable.
- ingredient.
- material.
- quest.
- document.
- relic.
- tool.
- currency.
- container.
- trophy.
- pet_item.

### 9.3 Tags elementales/Corrientes

- alba.
- raiz.
- brasa.
- marea.
- sombra.
- memoria.
- nombre.
- planar.
- aureano.
- camara.
- verdanza.

### 9.4 Tags de crafting

- comestible.
- alquimico.
- metalico.
- organico.
- textil.
- mineral.
- arcano.
- fermento.
- especia.
- tinta.
- madera.
- hueso.

### 9.5 Tags de comportamiento

- apilable.
- perecedero.
- inestable.
- maldito.
- no_vendible.
- no_destruible.
- unico.
- vinculado.
- identificable.
- equipable.
- consumible_rapido.

### 9.6 Ejemplo

```yaml
id: gel_dorado_nervioso
tags: [ingredient, material, organico, arcano, marea, suerte, apilable, inestable]
```

## 10. Objetos de quest y objetos recuerdo

### 10.1 Objetos críticos de quest

Reglas:
- No vendibles.
- No destruibles.
- No tirables sin confirmación especial.
- Si se pierden por bug o evento, se pueden recuperar.

Ejemplos:
- Acta falsa de Otilia.
- Folio sellado de Varo.
- Mapa de Mediodía.
- Sello de Resonancia de Pozo.

### 10.2 Objetos secundarios de quest

Pueden venderse o perderse con advertencia clara si no bloquean campaña.

Ejemplo:
“Esta cuchara mordida parece relacionada con una quest activa. ¿Seguro que quieres venderla? Doña Marga podría enterarse por medios culinarios”.

### 10.3 Objetos recuerdo

Objetos que celebran decisiones, arcos o vínculos.

Pueden ser:
- Equipables cosméticos.
- Decoración futura de vivienda/baúl.
- Pasivos contextuales menores.
- Entradas de Crónica.

Ejemplos:
Cinta de Otilia.
Primera Placa Cobre.
Cuchara de Pex no devuelta oficialmente.
Miga del Pan de Alba Serena.

### 10.4 Registro en Crónica

Al recibir objeto recuerdo:
[Crónica actualizada] Has obtenido un recuerdo: Cinta de Otilia.

La Crónica puede mostrar:
Recuerdos de Villaclara:
- Primera Placa Cobre.
- Cinta de Otilia.
- Migas del Pan de Alba Serena.

## 11. Loot contextual

### 11.1 Capas de loot

Todo enemigo o evento puede tener varias capas:

Loot base:
Cae casi siempre.

Loot raro:
Probabilidad baja.

Loot contextual:
Depende de método de resolución.

Loot de bestiario:
Depende de observación, captura o registro.

Loot de clase/profesión:
Depende de Cocinero, Inspector, Cartógrafo, Arcanista, etc.

Loot de quest:
Solo si quest activa.

### 11.2 Ejemplo: Conejo Acorazado Joven

Loot base:
- Placa córnea pequeña.
- Zanahoria mordida.

Loot raro:
- Pata de conejo irónica.

Contextual:
- Si se derrota sin romper placas: placa intacta.
- Si se captura: conejo asustado, posible misión de domesticación.
- Si se usa Cartógrafo: mapa de madriguera.
- Si Cocinero usa Deshuesar: carne de conejo acorazado.
- Si Inspector analiza: ficha de carga frontal.

### 11.3 Ejemplo: Slime de Mermelada

Loot base:
- Gel frutal.

Raro:
- Núcleo blando.

Contextual:
- Fuego: gel caramelizado, peor para alquimia, mejor para postres.
- Frío: núcleo intacto.
- Pan duro: captura no letal.
- Bardo: slime calmado, posible mascota menor.
- Cocinero: ingrediente “Mermelada con Vocación”.

### 11.4 Ejemplo: Escriba sin Rostro

Loot base:
- Tinta blanca sellada.
- Folio sin firma.

Raro:
- Máscara lisa.

Contextual:
- Si se rompe su ritual: acta incompleta.
- Si se captura: interrogatorio y pista de Cámara.
- Si Bardo ancla nombre durante combate: eco de nombre borrado.
- Si Inspector usa Formulario 13-B: contrato inválido como prueba.
- Si Arcanista identifica fórmula: sello de luz vertical.

## 12. Botín grupal

### 12.1 Principio

En party, evitar caos de “el más rápido se queda todo”, salvo en eventos cómicos controlados. Usaremos mezcla:
- Loot común individual para materiales básicos.
- Loot importante compartido con reparto.
- Objetos de quest para todos los elegibles.
- Trofeos únicos con necesidad/codicia o decisión de líder.

### 12.2 Tipos de reparto

Individual:
Cada jugador recibe su botín menor.

Compartido:
Objeto cae en pool de party.

Need/Greed:
Necesidad/codicia para equipo relevante.

Asignación por líder:
Para grupos organizados.

Registro de Crónica:
Para objetos narrativos, todos los presentes registran el evento aunque solo uno porte el objeto.

### 12.3 Reglas de elegibilidad

Un jugador es elegible si:
- Participó en combate o resolución.
- Está en rango de nivel permitido.
- Tiene quest activa si objeto es de quest.
- Está en party o instancia.

### 12.4 Antininja

Sistema simple:
- Objetos raros quedan vinculados al reparto durante X minutos.
- No se pueden vender hasta resolver reparto.
- Logs de loot visibles para party.

Mensaje:
“El Núcleo Blando de Slime entra en reparto. Pex votaría necesidad, pero no está censado”.

## 13. Reliquias

### 13.1 Definición

Una reliquia es un objeto con memoria. Puede estar dormida, despierta o en disputa. Algunas tienen voluntad, otras solo eco. Todas importan.

### 13.2 Estados de reliquia

Dormida:
Tiene rasgos menores o ocultos.

Inquieta:
Reacciona a lugares, nombres o eventos.

Despierta:
Desbloquea poder y memoria.

Vinculada:
Asociada a un jugador o NPC.

Corrompida:
Alterada por Cámara, Sombra, Verdanza o uso indebido.

Recordada:
Registrada en Crónica con verdad restaurada.

### 13.3 Despertar de reliquias

Fuentes de despertar:
- Quest específica.
- Arco completado.
- Uso temático repetido.
- Vínculo con NPC o lugar.
- Acto heroico.
- Restauración de nombre.
- Ritual de clase.

No recomendado:
- Matar 300 ratas para despertar espada legendaria, salvo que la espada odie ratas por una razón muy buena y documentada.

### 13.4 Reliquias menores iniciales

Escudo de Aldea:
Dormida. Escudo común reforzado.
Despierta si protege Villaclara durante evento.
Efecto: defensa extra contra ataques a NPCs locales.

Cuchara de Pex:
Objeto recuerdo absurdo.
Puede despertar como herramienta culinaria menor si se resuelve la cadena de Pex con amabilidad.
Efecto: mejora recetas de slime sin que el jugador quiera admitirlo.

Vela de Lúa:
Herramienta/reliquia menor.
Revela tinta sin sombra y pequeñas falsedades.
Puede despertar si se usa para restaurar el nombre de Otilia.

Placa Cobre del Primer Contrato:
Objeto de gremio.
Puede ganar marcas de Crónica por arcos completados.
Efecto social: demuestra rango y hazañas.

### 13.5 Reliquias mayores futuras

Escudo del Alba.
Espada Aurelia.
Cáliz de Mediodía, fragmentos/gotas.
Mapa del Trono de Nadie.
Faroles de Sombral.
Corona de Coral Negro.

Estas no deben entrar como loot normal. Son piezas de campaña.

### 13.6 Reliquias con personalidad

Solo algunas reliquias deben hablar o reaccionar con voz propia. Si todos los objetos comentan, el inventario se convierte en taberna. Tentador, pero peligroso.

Regla:
- Reliquias menores: sensaciones, calor, vibración, sueños.
- Reliquias importantes: frases ocasionales.
- Reliquias legendarias: voluntad clara.

## 14. Maldiciones y objetos peligrosos

### 14.1 Principio

Los objetos peligrosos deben ser tentadores. Beneficio claro, riesgo claro o descubrible.

### 14.2 Tipos

Maldito:
Tiene penalización espiritual, mental o narrativa.

Inestable:
Puede fallar, explotar, mutar o atraer atención.

De Cámara:
Manipula memoria, documentos, nombres o reputación.

De Verdanza:
Reflejos, duplicados, identidad.

Sombrío:
Sombra, miedo, sueños, límites.

Planar/Imposible:
Lógica externa, efectos extraños.

### 14.3 Ejemplos

Anillo de Brillo Excesivo:
+Presencia.
Atrae hadas y gente que quiere venderte cosas.

Pluma de Tinta Blanca:
Mejora falsificación documental.
Aumenta Atención de la Cámara y riesgo de Borrón.

Botas del Paso Dramático:
+iniciativa al entrar en combate.
Desventaja al intentar sigilo; hacen ruido heroico aunque camines con vergüenza.

Moneda de Deuda Inexistente:
Puede pagar un servicio menor.
Luego alguien recuerda que le debes algo.

### 14.4 Limpieza o contención

Métodos:
- Capilla.
- Arcanista.
- Inspector.
- Bardo/Cronista de Nombres.
- Quest de purificación.
- Contenedor sellado.

## 15. Inventario y combate

### 15.1 Bolsillo rápido

Solo objetos en bolsillo rápido pueden usarse como acción menor en combate.

Ejemplos:
- Poción menor.
- Croqueta de maná.
- Vela de Lúa pequeña.
- Campanilla.
- Pan duro.
- Bomba culinaria.

Objetos en mochila:
Usarlos en combate cuesta acción principal o requiere preparar.

### 15.2 Cambiar equipo en combate

Regla:
- Cambiar arma simple: acción menor.
- Cambiar armadura: no viable en combate normal.
- Cambiar anillo/amuleto: acción principal y riesgo.
- Cambiar foco: acción menor si en bolsillo rápido, si no acción principal.

### 15.3 Objetos improvisados

Permitir lanzar/usar objetos comunes.

Ejemplos:
- Lanzar pan duro a slime.
- Usar taburete como defensa.
- Tirar harina para cegar.
- Usar cuerda para trabar.

Los objetos improvisados pueden dañarse o romperse.

### 15.4 Consumibles y balance

Consumibles ayudan, no sustituyen clases.

Poción menor:
Curación baja-media. Cooldown corto o límite de uso por combate.

Comida:
Más potente fuera de combate o como preparación.

Cocina de Mazmorra:
Puede romper esta regla de forma controlada porque es su identidad.

## 16. Inventario y crafting

### 16.1 Ingredientes desde fase 1

Todo ingrediente debe tener tags y calidad.

Campos:
- tipo.
- tags.
- rareza.
- frescura.
- calidad.
- fuente.
- usos.

### 16.2 Calidad

Calidades:
- Dañado.
- Normal.
- Bueno.
- Excelente.
- Extraño.
- Perfecto.

La calidad depende de:
- Método de obtención.
- Clase/profesión.
- Daño usado.
- Herramienta.
- Tiempo.

### 16.3 Perecederos

Alimentos e ingredientes pueden tener frescura, pero no queremos agobio.

Regla inicial:
Solo ingredientes especiales/perecederos tienen temporizador. Los comunes no caducan o caducan solo tras mucho tiempo.

Contenedores especiales reducen deterioro.

### 16.4 Despiece y recolección

Comandos:
- recolectar [recurso]
- deshuesar [criatura]
- extraer [material]
- conservar [ingrediente]

Requiere herramienta o habilidad según caso.

## 17. Inventario y quests

### 17.1 Objetos que avanzan quests

Los objetos pueden emitir eventos:
- itemReceived.
- itemExamined.
- itemUsed.
- itemDelivered.
- itemIdentified.
- itemDestroyed.
- itemEquipped.

QuestManager escucha estos eventos.

### 17.2 Pistas en objetos

Examinar un objeto puede descubrir clue.

Ejemplo:
examinar folio_sellado
“La esquina del folio tiene una marca de sol vertical. No brilla: ordena la luz alrededor”.

[Crónica actualizada] Has descubierto: Sello de luz vertical.

### 17.3 Entrega flexible

Permitir entregar objetos aunque el jugador no tenga quest activa, si tiene sentido.

Ejemplo:
Entregar tinta blanca a Hermana Lúa puede iniciar quest o desbloquear pista.

### 17.4 Protección de objetos críticos

Si un objeto es necesario:
- Advertir antes de vender/tirar.
- Permitir recuperación.
- Registrar en Crónica.

## 18. Inventario y economía

### 18.1 Valor base

Cada objeto tiene valor base. Las tiendas aplican modificadores:
- Tipo de tienda.
- Reputación.
- Oferta/demanda.
- Estado de quest.
- Rareza.
- Identificación.

Ejemplo:
Gel dorado vale más tras rumor de slimes dorados.
Pan cuesta menos si Doña Marga te aprecia.
Pan cuesta más si incendiaste su bodega. Esto no es inflación, es justicia.

### 18.2 Venta de loot

No todas las tiendas compran todo.

Panadería:
Ingredientes, comida, geles útiles.

Herrería:
Metal, placas, armas.

Gremio:
Trofeos, contratos, materiales de bestiario.

Capilla:
Reliquias sagradas, agua clara, objetos malditos para contención.

Mirta:
Casi todo, pero pregunta demasiado poco.

### 18.3 Objetos no vendibles

- Quest críticos.
- Vinculados.
- Malditos no identificados, según tienda.
- Reliquias mayores.

### 18.4 Sumideros económicos

- Reparación.
- Identificación.
- Posada.
- Viaje.
- Entrenamiento.
- Crafting.
- Baúl ampliado.
- Limpieza de maldiciones.
- Tasas de Gremio avanzadas.

## 19. Comandos propuestos

### 19.1 Inventario

inventario / inv / i:
Muestra objetos.

inv equipo:
Muestra equipo equipado.

inv ingredientes:
Muestra bolsa de ingredientes.

inv quest:
Muestra objetos de quest.

inv recuerdos:
Muestra objetos recuerdo.

buscar inv [texto]:
Filtra inventario.

### 19.2 Examinar y usar

examinar [objeto]
usar [objeto]
usar [objeto] en [objetivo]
leer [documento]
identificar [objeto]

### 19.3 Equipo

equipar [objeto]
desequipar [ranura/objeto]
comparar [objeto]
comparar [objeto] con [ranura]

### 19.4 Gestión

tirar [objeto]
vender [objeto]
comprar [objeto]
guardar [objeto] en baul
sacar [objeto] de baul
mover [objeto] a bolsillo
ordenar inv

### 19.5 Loot

loot / botin:
Muestra botín cercano o de party.

recoger [objeto]
recoger todo
repartir botin
necesidad [objeto]
codicia [objeto]
pasar [objeto]

### 19.6 Crafting/recolección

recolectar [recurso]
deshuesar [criatura]
extraer [material]
conservar [ingrediente]

## 20. Formato de salida textual

### 20.1 Inventario básico

```
Inventario de Jorge — 17/24 slots
Bolsillo rápido: 3/4
Bolsa de ingredientes: 6/10

Equipo y herramientas:
- Espada corta buena [Bueno]
- Escudo de Aldea [Reliquia dormida]
- Vela de Lúa [Raro]

Consumibles:
- Pan de Alba Serena x3
- Poción menor x2
- Pan duro x1

Materiales:
- Placa córnea pequeña x4
- Gel frutal x2

Documentos:
- Contrato Cobre: Conejos con casco
- Acta falsa de Otilia [Quest]
```

### 20.2 Examinar objeto

```
Escudo de Aldea [Reliquia dormida]
Ranura: arma secundaria/escudo
Tamaño: pesado
Estado: intacto
Tags: shield, relic, alba, villaclara, equipable, identificable

Un escudo sencillo de madera clara y borde metálico. Tiene marcas de reparaciones antiguas y una campanilla grabada en el interior. Cuando lo sostienes cerca del Pozo Cantante, vibra apenas.

Efectos:
- +defensa física.
- Mejor al proteger NPCs de Villaclara.

Estado de reliquia:
Dormida. Parece recordar un juramento, pero no cuál.
```

### 20.3 Advertencia de venta

```
Ese objeto parece importante para una quest activa: Acta falsa de Otilia.
Venderlo puede bloquear una ruta de resolución, aunque quizá existan alternativas.
¿Seguro que quieres venderlo? confirmar vender acta
```

### 20.4 Loot contextual

```
Botín obtenido: Slime de Mermelada
- Gel frutal x2
- Núcleo blando intacto x1 [contextual: derrotado con frío]
- Nota de bestiario: el pan duro lo distrae con eficacia humillante.
```

## 21. Objetos iniciales de Villaclara

### 21.1 Consumibles

Pan de Alba Serena:
Comida. +moral leve fuera de combate o al inicio del siguiente combate.

Croqueta de Maná Menor:
Restaura recurso menor. Mejor para clases con recursos mágicos o Voz.

Agua Clara de Lúa:
Limpia estado leve: Cegado, Pegajoso, Tinta menor.

Pan Duro Reglamentario:
Consumible/herramienta. Atrae slimes, puede lanzarse.

### 21.2 Herramientas

Vela de Lúa:
Revela tinta blanca, sombras falsas y rastros menores.

Tiza de Mazmorra Cívica:
Marca rutas, reduce perderse, interactúa con Inspector.

Campanilla de Milicia:
Llama ayuda cerca de Villaclara o activa ciertos eventos.

Cuerda de Cáñamo Honrada:
Sirve para pozos, bajadas, trampas simples.

Kit de Escriba Barato:
Permite copiar actas o tomar notas; peligroso cerca de Cámara.

### 21.3 Materiales/ingredientes

Gel frutal.
Gel dorado nervioso.
Placa córnea pequeña.
Harina lunar.
Huevo de pollo elemental.
Paja animada.
Botón negro de espantapájaros.

### 21.4 Equipo inicial

Espada corta de Gremio.
Bastón de aprendiz.
Daga de compás.
Sartén de viaje.
Laúd de madera clara.
Escudo de Aldea.
Túnica de aprendiz arcano.
Porra reglamentaria.

### 21.5 Documentos

Placa Cobre provisional.
Contrato Cobre.
Acta falsa.
Mapa feo de Bimba.
Recibo de duende de peaje.
Carta de Sera Mimbrel.

## 22. Ejemplos de objetos YAML

### 22.1 Consumible

```yaml
id: pan_alba_serena
name: Pan de Alba Serena
rarity: common
type: consumable
size: ligero
stackable: true
maxStack: 10
tags: [consumable, food, comestible, alba, villaclara]
effects:
  use:
    context: out_of_combat
    applyState:
      id: moral_leve
      duration: next_combat
value: 3
description: >
  Pan dorado y ligeramente dulce creado para celebrar la coronación de Seralyne.
  Huele a horno limpio, promesa rural y autoridad panadera.
```

### 22.2 Equipo

```yaml
id: escudo_de_aldea
name: Escudo de Aldea
rarity: relic_dormant
type: shield
slot: offhand
size: pesado
durability:
  max: 100
  current: 100
tags: [armor, shield, relic, alba, villaclara, equipable, identificable]
stats:
  defense_physical: 4
effects:
  conditional:
    - condition: protecting_npc && zone:villaclara
      defense_physical: 2
relic:
  state: dormant
  awakenConditions:
    - arcCompleted: arco_pozo_tarareaba
    - protectedNpcCount: 3
    - titleEarned: nombre_de_villaclara
description: >
  Un escudo sencillo de madera clara. La campanilla grabada en su interior parece más antigua que el resto.
```

### 22.3 Objeto de quest

```yaml
id: acta_falsa_otilia
name: Acta falsa de Otilia
rarity: rare
type: document
size: ligero
tags: [document, quest, camara, memoria, no_vendible, no_destruible, identificable]
questItem:
  quest: villaclara_otilia_no_existe
clues:
  onExamine:
    - clue_tinta_blanca_no_sombra
value: 0
description: >
  Un acta municipal que insiste, con caligrafía impecable, en que Otilia Cuerda nunca existió.
  La tinta blanca no proyecta sombra.
```

### 22.4 Ingrediente contextual

```yaml
id: nucleo_blando_slime_intacto
name: Núcleo blando de slime intacto
rarity: uncommon
type: ingredient
size: ligero
stackable: true
maxStack: 5
tags: [ingredient, organico, alquimico, marea, comestible_con_dudas]
quality: bueno
source:
  enemy: slime_mermelada
  method: cold_damage_or_capture
uses:
  - receta_mermelada_estable
  - pocion_pegajosidad_controlada
value: 12
description: >
  Una esfera gelatinosa que tiembla con modestia. Técnicamente comestible, moralmente negociable.
```

## 23. Implementación técnica en el motor de Inheron

### 23.1 Bundle recomendado

inheron-items

Subcarpetas:
- commands/items/
- data/items/
- data/loot_tables/
- data/rarities.yml
- data/equipment_slots.yml
- data/item_tags.yml
- data/relics.yml
- data/containers.yml
- lib/InventoryManager.js
- lib/EquipmentManager.js
- lib/LootManager.js
- lib/RelicManager.js
- lib/ItemIdentifyManager.js
- lib/ContainerManager.js
- lib/ItemEventBus.js

### 23.2 Managers principales

InventoryManager:
Gestiona slots, pilas, contenedores, mover objetos, límites.

EquipmentManager:
Gestiona ranuras, competencias, restricciones blandas, comparar equipo.

LootManager:
Genera botín base, raro, contextual y de party.

RelicManager:
Controla estados de reliquia, despertar, vínculos y efectos narrativos.

ItemIdentifyManager:
Gestiona identificación parcial/completa.

ContainerManager:
Baúl, bolsas, almacén del Gremio.

ItemEventBus:
Emite eventos para quests, crafting, combate y economía.

### 23.3 Eventos principales

- itemPickedUp.
- itemDropped.
- itemEquipped.
- itemUnequipped.
- itemUsed.
- itemExamined.
- itemIdentified.
- itemSold.
- itemBought.
- itemStored.
- itemRetrieved.
- itemDamaged.
- itemRepaired.
- lootGenerated.
- relicAwakened.
- relicCorrupted.
- questItemProtected.

### 23.4 Persistencia

PlayerState:
- inventory.
- equipment.
- containers local references.
- identified items.
- relic states linked to player.
- quick slots.

World/AreaState:
- dropped loot persistent if necesario.
- public containers.
- market state.
- world relics.

### 23.5 Scope de objetos

Objetos normales:
Instancias simples o stacks.

Equipo:
Instancias con durabilidad, mejoras y estado.

Reliquias:
Instancias únicas con estado propio.

Documentos/quest:
Instancias por jugador o party según quest.

Materiales comunes:
Stacks.

## 24. Integración con agentes IA

Loro:
Valida lore de reliquias y objetos históricos.

Zono:
Ubica objetos en salas y dungeons.

Queso:
Define objetos de quest y recuerdos.

Ñeque:
Asocia objetos con NPCs y servicios.

Reglo:
Balancea stats, rareza y economía.

Torta:
Define loot de enemigos y uso en combate.

Nivelo:
Controla equipo por clase, talentos y progresión.

Bolso:
Precios, tiendas y sumideros.

Puchero:
Ingredientes, recetas y calidad.

Yunque:
Convierte objetos a YAML/JSON.

Ojo:
Prueba duplicación, pérdida de objetos críticos y exploits.

## 25. Roadmap de implementación

### Fase A: Inventario mínimo
- Slots.
- Pilas.
- Comandos inventario, recoger, tirar, examinar.
- Objetos comunes de Villaclara.

### Fase B: Equipo
- Ranuras.
- Equipar/desequipar.
- Stats básicos.
- Comparar.
- Competencias blandas.

### Fase C: Loot
- Loot tables base.
- Loot contextual simple.
- Enemigos iniciales.
- Botín de party básico.

### Fase D: Quest items y Crónica
- No vendible/no destruible.
- Objetos recuerdo.
- Clues en objetos.
- Integración con QuestManager.

### Fase E: Baúl y tiendas
- Baúl de Posada.
- Comprar/vender.
- Reputación en precios.
- Servicios de reparación/identificación básicos.

### Fase F: Reliquias
- Estados dormida/despierta.
- Condiciones de despertar.
- Reliquias menores de Villaclara.
- Crónica de reliquias.

### Fase G: Durabilidad y objetos peligrosos
- Daño por derrota/eventos.
- Reparación.
- Maldiciones/inestables.
- Contención.

### Fase H: Crafting avanzado
- Tags completos.
- Calidad.
- Perecederos especiales.
- Integración con Puchero.

## 26. Riesgos y soluciones

Riesgo: inventario demasiado restrictivo.
Solución: capacidad generosa, bolsas especiales, baúl temprano.

Riesgo: demasiada microgestión.
Solución: no durabilidad por uso normal, apilamiento, filtros y ordenar inventario.

Riesgo: loot contextual demasiado complejo.
Solución: empezar con 1-2 condiciones por enemigo; ampliar con bestiario/crafting.

Riesgo: reliquias pierden magia si hay demasiadas.
Solución: pocas reliquias con personalidad. Muchas dormidas con eco, pocas hablantes.

Riesgo: objetos de quest bloquean progreso.
Solución: protección, avisos, recuperación y rutas alternativas.

Riesgo: economía se rompe por loot.
Solución: Bolso revisa fuentes/sumideros; precios bajos para materiales comunes; demanda dinámica limitada.

Riesgo: equipos fuera de clase rompen balance.
Solución: restricciones blandas con penalizaciones a recursos clave.

## 27. Recomendación de Fase 1 para Villaclara

Implementar:
- Inventario 24 slots.
- Bolsillo rápido 4 slots.
- Bolsa de ingredientes 10 slots.
- Baúl local en Segundo Gallo.
- Ranuras principales.
- Rarezas hasta Raro + Reliquia dormida.
- Durabilidad solo por derrota/eventos.
- Identificación solo en reliquias/objetos peligrosos.
- Loot contextual simple para conejo, slime, hada y escriba.
- Objetos de quest protegidos.
- 4 reliquias menores: Escudo de Aldea, Vela de Lúa, Placa Cobre, Cuchara de Pex.
- Tags de crafting desde el principio.

Primeros objetos necesarios:
- Pan de Alba Serena.
- Poción menor.
- Croqueta de Maná Menor.
- Pan duro.
- Vela de Lúa.
- Tiza de Mazmorra Cívica.
- Campanilla de Milicia.
- Cuerda.
- Acta falsa de Otilia.
- Mapa feo de Bimba.
- Placa Cobre provisional.
- Escudo de Aldea.
- Cuchara de Pex.
- Gel frutal.
- Placa córnea.
- Harina lunar.

## 28. Cierre

El sistema de objetos de InheronMUD debe ser cómodo, expresivo y lleno de posibilidades. El jugador debe poder mirar su inventario y ver algo más que estadísticas: debe ver historia. Su primera placa Cobre, el pan que compró en Villaclara, la vela que reveló una tinta imposible, la cuchara que Pex no admite haber robado, el escudo que quizá recuerde un juramento.

El inventario no debe ser una mochila. Debe ser una pequeña Crónica con hebillas.

Y cuando una reliquia despierte, no debería sentirse como subir un número. Debería sentirse como si el mundo acabara de recordar que el jugador estaba allí.

FIN DEL DOCUMENTO DE INVENTARIO, EQUIPO, LOOT Y RELIQUIAS
