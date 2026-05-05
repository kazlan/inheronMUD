# InheronMUD - Sistema de onboarding

## Prólogo: El Último Día Normal

Este documento define el sistema de onboarding de **InheronMUD**, siguiendo el lore de Villaclara y el tono isekai del proyecto.

El jugador no empieza directamente en Villaclara. Primero vive una pequeña escena en su **mundo real**, ligada a su pasado. Esa escena enseña comandos básicos y acaba siempre con una muerte narrativa o “fallo dimensional” que lo transporta a Eryndor.

Cuando aparece en la **Plaza del Alba Chica de Villaclara**, el jugador ya debe tener:

- Nombre de personaje.
- Pasado del mundo real.
- Nueva raza.
- Clase inicial.
- Un objeto especial: **Vale de Orientación para Aventurero Novato**.
- Una razón narrativa para ir al **Gremio de Aventureros**.

El onboarding debe durar poco, idealmente entre **8 y 15 minutos**, pero dejar sabor. La idea es que cada pasado tenga su propia microzona tutorial.

---

# Objetivo de diseño

El onboarding debe funcionar como una miniaventura de creación de personaje, tutorial y transición narrativa al mundo isekai.

No debe ser un menú seco ni un bloque informativo, sino una experiencia jugable donde el jugador:

1. Elige quién era en el mundo real.
2. Aprende los comandos básicos.
3. Muere de forma inevitable, cómica y narrativa.
4. Es procesado por una entidad extradimensional.
5. Escoge raza y clase.
6. Aparece en Villaclara con un vale para presentarse en el Gremio.

La muerte no debe sentirse como castigo. Debe sentirse como el botón de entrada al género.

---

# Flujo general

## Fase 1: Identidad del mundo real

El jugador elige su pasado.

Ejemplo de prompt:

```text
Antes de despertar en Eryndor, tuviste una vida. Quizá no gloriosa.
Quizá ni siquiera organizada. Pero tuya.

Elige tu pasado:
1. Oficinista agotado
2. Hikikomori de manual
3. Deportista amateur
4. Estudiante en apuros
5. Ama de casa todoterreno
...
```

Cada pasado otorga:

- Una **microzona inicial**.
- Un pequeño rasgo pasivo inicial.
- Una afinidad sugerida de clase.
- Una muerte/tutorial distinta.
- Una frase de epitafio humorístico.

Importante: el pasado no debería encasillar. Un oficinista puede acabar siendo Bárbaro Solar si quiere.

---

## Fase 2: Tutorial en el mundo real

Cada pasado despierta en una zona distinta de 4 a 7 rooms.

Aquí se enseñan comandos básicos:

| Momento | Comando |
|---|---|
| Despertar | `mirar` |
| Revisar entorno | `examinar <objeto>` |
| Recoger algo | `coger <objeto>` |
| Inventario | `inventario` |
| Equipar/usar | `usar <objeto>` o `equipar <objeto>` |
| Movimiento | `norte`, `sur`, `este`, `oeste`, etc. |
| Hablar | `hablar <npc>` |
| Interacción social | `decir <texto>` |
| Combate básico o peligro | `atacar`, `huir`, `defender` |
| Ayuda | `ayuda` |
| Mapa local | `mapa` |

La muerte llega después de que el jugador haya demostrado que sabe moverse, mirar, coger, hablar y usar algo.

---

## Fase 3: Muerte tutorial inevitable

No debe sentirse como castigo. Debe ser el botón de “insertar moneda cósmica”.

Ejemplos de muertes:

- Atropello por camión.
- Caída por escalera.
- Explosión de microondas.
- Infarto de vergüenza social.
- Portal en una lavadora.
- Ataque de paloma de rango SSS.
- Ascensor que decide jubilarse de la física.

Al morir, se muestra una escena de transición:

```text
Todo se vuelve blanco.

Luego negro.

Luego aparece una ventanilla de atención al difunto con un cartel:

"REENCARNACIONES, ISEKAIS Y DEVOLUCIONES IMPROCEDENTES"

Una mujer con gafas de media luna revisa tus papeles.
—Vaya. Otro caso de transferencia narrativa accidental.
—¿Destino?
La funcionaria golpea un sello dorado.

VILLACLARA.
```

---

## Fase 4: Cámara de Transferencia Narrativa

Aquí el jugador elige o confirma:

- Nueva raza.
- Clase inicial.
- Rasgo heredado del pasado.
- Aspecto básico.

Esta fase puede estar representada como una sala extradimensional:

## La Oficina de Reubicación Heroica No Solicitada

NPC sugerido:

### Dama Sello

Funcionaria cósmica con paciencia erosionada por milenios de protagonistas.

Frases:

```text
—No, no puedes volver.
—No, no conservas tu móvil.
—Sí, el pato de goma cuenta como objeto emocional.
—No, no todos los mundos tienen cobertura.
—Firma aquí, aquí y aquí. La última firma es por si te conviertes en slime.
```

---

## Fase 5: Aparición en Villaclara

El jugador aparece en:

## Plaza del Alba Chica

Estado inicial:

- Vida al 100%.
- Sin equipamiento potente.
- Ropa sencilla de recién llegado.
- Un objeto clave.
- Quizá un debuff suave: **Mareo Dimensional**.

Mensaje:

```text
Caes sobre los adoquines de una plaza soleada.

Huele a pan reciente, hierba húmeda y burocracia rural.

Una niña te señala.
—¡Mamá, otro!

Una mujer mayor suspira desde un banco.
—Que lo lleven al Gremio antes de que pregunte por el wifi.

Has recibido:
Vale de Orientación para Aventurero Novato.
```

Objeto:

```yaml
id: vale_orientacion_aventurero_novato
nombre: "Vale de Orientación para Aventurero Novato"
tipo: "documento"
calidad: "común"
vinculado: true
descripcion: >
  Un papel grueso con sello del Gremio de Aventureros de Villaclara.
  Dice: "Canjeable por una explicación básica, una mirada de compasión
  y una asignación inicial de rango Cobre. No incluye desayuno."
uso:
  lugar: gremio_aventureros_villaclara
  efecto: desbloquea_registro_gremio
```

---

# Pasados iniciales

Propuesta inicial: **14 pasados**. Variedad suficiente sin convertir el onboarding en una enciclopedia con zapatos.

---

## 1. Oficinista agotado

### Room inicial

**Cubículo 4B, planta de administración**

### Minirooms

- Cubículo 4B.
- Sala de impresoras.
- Pasillo de fluorescentes.
- Cocina corporativa.
- Ascensor averiado.
- Calle frente a la oficina.

### Tutorial

- `mirar`: ves papeles, ordenador y taza.
- `examinar ordenador`: descubres 47 correos sin leer.
- `coger taza`: obtienes “Taza de café tibio”.
- `usar impresora`: la impresora se atasca.
- `hablar jefe`: enseña conversación.
- `sur`: sales al pasillo.

### Muerte

Sales a la calle mirando el móvil corporativo. Un camión de reparto con el logo **“Mudanzas Narrativas Truck-kun S.L.”** te manda al prólogo eterno.

### Rasgo heredado

**Resistencia al papeleo**

- +1 a tareas administrativas.
- Menor penalización ante misiones burocráticas.
- Pequeño bonus con ayuntamiento, gremio y contratos.

### Afinidades sugeridas

- Escriba Arcano.
- Clérigo Solar.
- Guardián.
- Pícaro de Oficina, si hacemos clase humorística avanzada.

---

## 2. Hikikomori de manual

### Room inicial

**Habitación con persianas bajadas**

### Minirooms

- Habitación.
- Escritorio del PC.
- Pasillo oscuro.
- Cocina de madrugada.
- Portal del edificio.
- Tienda 24h.

### Tutorial

- `mirar`: habitación llena de cables.
- `examinar pc`: mensaje extraño en pantalla.
- `coger mochila`: obtienes “Mochila gastada”.
- `usar interruptor`: enseña objetos interactivos.
- `hablar repartidor`: primer NPC.
- `este`: salir de la habitación.

### Muerte

Al abrir la puerta al repartidor, el paquete contiene una runa de “beta cerrada”. El suelo se convierte en un círculo mágico. Muerte por **exceso de transferencia dimensional**.

### Rasgo heredado

**Familiaridad con sistemas**

- Bonus leve a identificar interfaces mágicas, paneles, runas y mecanismos.
- Mayor probabilidad de entender rarezas isekai.

### Afinidades sugeridas

- Mago.
- Invocador.
- Artificiero.
- Explorador táctico.

---

## 3. Deportista amateur

### Room inicial

**Gimnasio municipal**

### Minirooms

- Vestuario.
- Sala de máquinas.
- Pista interior.
- Recepción.
- Aparcamiento.
- Calle lateral.

### Tutorial

- `equipar zapatillas`: enseña equipamiento.
- `usar cinta`: enseña comandos contextuales.
- `hablar entrenador`: diálogo.
- `atacar saco`: combate básico sin riesgo.
- `huir`: tutorial de retirada.

### Muerte

El jugador sale a correr. Un patinete eléctrico poseído por el demonio menor de las aceras le hace una llave de judo urbana.

### Rasgo heredado

**Cuerpo entrenado**

- +1 a vigor inicial.
- Menor fatiga al viajar.
- Bonus menor a huida o esquiva.

### Afinidades sugeridas

- Guerrero.
- Monje.
- Explorador.
- Lancero.

---

## 4. Estudiante en apuros

### Room inicial

**Biblioteca universitaria**

### Minirooms

- Mesa de estudio.
- Estanterías.
- Máquina de café.
- Aula vacía.
- Pasillo de exámenes.
- Parada de autobús.

### Tutorial

- `examinar apuntes`: lore personal.
- `coger bolígrafo`: primer objeto.
- `usar máquina`: obtienes café sospechoso.
- `hablar compañera`: interacción social.
- `leer cartel`: introduce lectura de objetos.

### Muerte

Tras beber el café de máquina número cinco, el jugador ve fórmulas flotando. Una pregunta de examen abre un portal y lo absorbe.

### Rasgo heredado

**Aprendiz rápido**

- Pequeño bonus de experiencia durante los primeros niveles.
- Desbloquea líneas de diálogo sobre libros y academias.

### Afinidades sugeridas

- Mago.
- Bardo.
- Clérigo.
- Artificiero.

---

## 5. Ama de casa todoterreno

### Room inicial

**Cocina familiar en hora punta**

### Minirooms

- Cocina.
- Salón.
- Lavadero.
- Despensa.
- Portal.
- Mercado del barrio.

### Tutorial

- `coger sartén`: objeto equipado.
- `usar lavadora`: interacción.
- `hablar vecino`: social.
- `examinar lista`: lectura.
- `atacar cucaracha`: combate básico con enemigo menor.

### Muerte

La lavadora entra en centrifugado extradimensional. Al abrirla, aparece un túnel de luz, calcetines perdidos y una voz que dice: “por fin, una persona competente”.

### Rasgo heredado

**Gestión del caos**

- Bonus a cocina, organización y tareas de campamento.
- Resistencia menor a miedo/confusión doméstica, muy importante ante slimes de despensa.

### Afinidades sugeridas

- Clérigo.
- Cocinero de batalla.
- Guerrero.
- Alquimista.

---

## 6. Repartidor urbano

### Room inicial

**Calle con pedido urgente**

### Minirooms

- Portal del cliente.
- Calle principal.
- Cruce imposible.
- Parque.
- Escalera sin ascensor.
- Aparcamiento de motos.

### Tutorial

- `mapa`: encontrar destino.
- `mirar cartel`: orientación.
- `coger pedido`: item de misión.
- `entregar pedido`: primera quest mínima.
- `huir perro`: tutorial de peligro.

### Muerte

Un GPS dice “gire a la derecha” en una calle sin derecha. El jugador obedece y atraviesa la realidad.

### Rasgo heredado

**Orientación callejera**

- Bonus a moverse por ciudades.
- Reduce probabilidad de perderse en zonas urbanas.
- Mejor lectura de rutas y atajos.

### Afinidades sugeridas

- Explorador.
- Pícaro.
- Mensajero del Alba.
- Duelista.

---

## 7. Programador nocturno

### Room inicial

**Habitación iluminada por tres monitores**

### Minirooms

- Escritorio.
- Cocina con ramen.
- Servidor casero.
- Pasillo.
- Balcón.
- Calle mojada.

### Tutorial

- `examinar terminal`: texto interactivo.
- `usar teclado`: comando contextual.
- `coger pendrive`: objeto raro.
- `hablar compañero por chat`: diálogo no presencial.
- `ayuda`: se justifica con documentación.

### Muerte

El programa compila sin errores. La imposibilidad estadística rompe el universo local.

### Rasgo heredado

**Pensamiento lógico**

- Bonus a resolver puzzles.
- Pequeña ventaja con mecanismos, runas y autómatas.
- Desbloquea chistes con magos sobre “código arcano”.

### Afinidades sugeridas

- Artificiero.
- Mago.
- Cronista.
- Invocador.

---

## 8. Cocinero de bar

### Room inicial

**Cocina de menú del día**

### Minirooms

- Fogones.
- Cámara frigorífica.
- Barra.
- Calle trasera.
- Mercado.
- Almacén.

### Tutorial

- `usar cuchillo`: interacción segura.
- `coger ingredientes`: inventario.
- `combinar`: si queremos enseñar crafting básico.
- `hablar camarera`: social.
- `atacar rata`: combate básico.

### Muerte

Una olla a presión alcanza masa crítica narrativa y libera vapor con forma de dragón administrativo.

### Rasgo heredado

**Instinto culinario**

- Bonus inicial a cocina.
- Identifica ingredientes.
- Puede mejorar raciones simples.

### Afinidades sugeridas

- Cocinero de batalla.
- Alquimista.
- Guerrero.
- Bardo.

---

## 9. Enfermero de urgencias

### Room inicial

**Sala de descanso del hospital**

### Minirooms

- Sala de descanso.
- Pasillo de urgencias.
- Box médico.
- Almacén.
- Entrada de ambulancias.
- Cafetería.

### Tutorial

- `examinar paciente`: lectura de estado.
- `usar botiquín`: uso de objeto.
- `hablar médico`: diálogo.
- `coger vendas`: inventario.
- `ayudar paciente`: acción contextual.

### Muerte

Una ambulancia llega sin conductor, con matrícula “RX-404”. Al abrir la puerta, dentro hay un cielo con tres lunas.

### Rasgo heredado

**Manos firmes**

- Bonus a primeros auxilios.
- Mejora leve el uso de vendas y pociones básicas.
- Mejores diálogos con sanadores.

### Afinidades sugeridas

- Clérigo.
- Sanador.
- Alquimista.
- Guardián.

---

## 10. Policía local

### Room inicial

**Comisaría de barrio**

### Minirooms

- Recepción.
- Archivo.
- Calle patrullada.
- Parque.
- Cruce.
- Callejón.

### Tutorial

- `examinar denuncia`: leer documentos.
- `hablar compañero`: diálogo.
- `coger linterna`: objeto.
- `usar linterna`: iluminar.
- `atacar sombra`: combate tutorial.

### Muerte

Persigues una sombra por un callejón. La sombra gira, enseña una placa de “Agente Dimensional Interino” y te arresta por existir fuera de género.

### Rasgo heredado

**Sentido de la autoridad**

- Bonus a intimidar o mediar.
- Mejor lectura de conflictos civiles.
- Afinidad con guardias y milicias.

### Afinidades sugeridas

- Guardián.
- Guerrero.
- Inquisidor Solar, si existe más adelante.
- Explorador.

---

## 11. Jubilado curioso

### Room inicial

**Banco del parque**

### Minirooms

- Banco del parque.
- Kiosco.
- Fuente.
- Centro cívico.
- Cruce.
- Panadería del barrio.

### Tutorial

- `mirar gente`: observación.
- `hablar vecino`: social avanzado.
- `examinar periódico`: lectura.
- `coger bastón`: equipamiento.
- `usar bastón`: interacción.

### Muerte

Una paloma roba tu periódico. Al perseguirla, descubres que la paloma tiene barra de vida, título nobiliario y alas de portal.

### Rasgo heredado

**Sabiduría de banco**

- Bonus a rumores.
- Mejores resultados escuchando conversaciones.
- Pequeña resistencia a engaños simples.

### Afinidades sugeridas

- Bardo.
- Clérigo.
- Druida urbano.
- Mago.

---

## 12. Influencer de baja reputación

### Room inicial

**Habitación preparada para directo**

### Minirooms

- Set de grabación.
- Baño con aro de luz.
- Cocina.
- Terraza.
- Portal.
- Calle con seguidores imaginarios.

### Tutorial

- `mirar cámara`: observación.
- `usar móvil`: objeto.
- `hablar chat`: diálogo.
- `examinar paquete`: interacción.
- `gritar`: comando social opcional.

### Muerte

Intentas grabar “abriendo un portal a otra dimensión, sale mal”. Sale bien.

### Rasgo heredado

**Presencia escénica**

- Bonus a carisma social.
- Mejora actuaciones, provocaciones y negociación.
- Desbloquea frases ridículas ante bardos.

### Afinidades sugeridas

- Bardo.
- Pícaro.
- Ilusionista futuro.
- Duelista.

---

## 13. Mecánico de taller

### Room inicial

**Taller con olor a aceite**

### Minirooms

- Elevador.
- Banco de herramientas.
- Oficina del taller.
- Almacén.
- Callejón.
- Gasolinera.

### Tutorial

- `coger llave inglesa`: objeto.
- `equipar llave`: equipamiento.
- `usar elevador`: mecanismo.
- `examinar motor`: inspección.
- `atacar máquina expendedora`: combate humorístico opcional.

### Muerte

Un motor arranca solo y empieza a recitar latín técnico. La explosión abre un portal con forma de junta de culata.

### Rasgo heredado

**Manitas**

- Bonus a reparar.
- Ventaja con mecanismos, trampas simples y herramientas.
- Mejora crafting técnico.

### Afinidades sugeridas

- Artificiero.
- Guerrero.
- Explorador.
- Forjador.

---

## 14. Dependiente de tienda

### Room inicial

**Tienda de barrio en hora rara**

### Minirooms

- Mostrador.
- Pasillo de snacks.
- Almacén.
- Caja registradora.
- Entrada.
- Calle nocturna.

### Tutorial

- `examinar caja`: objeto interactivo.
- `hablar cliente`: social.
- `coger escoba`: equipamiento.
- `usar escoba`: limpiar/arma improvisada.
- `vender`: si queremos introducir comercio muy básico.

### Muerte

Un cliente entra a las 03:33 y pide “una recarga para el alma”. Al pasar el código de barras, el lector escanea tu destino.

### Rasgo heredado

**Ojo comercial**

- Bonus leve a tasar objetos comunes.
- Mejores precios en compras menores.
- Detecta timos sencillos.

### Afinidades sugeridas

- Mercader aventurero.
- Pícaro.
- Bardo.
- Alquimista.

---

# Rasgos heredados

Los rasgos del pasado deben ser útiles pero pequeños. No sustituyen a raza ni clase. Funcionan como “sabor mecánico”.

Ejemplo de estructura:

```yaml
background:
  id: oficinista_agotado
  nombre: "Oficinista agotado"
  rasgo: resistencia_al_papeleo
  bonus:
    administracion: 1
    voluntad: 1
  dialog_tags:
    - mundo_real
    - oficina
    - burocracia
  suggested_classes:
    - escriba_arcano
    - clerigo_solar
    - guardian
```

---

# Selección de raza

Tras morir, la Dama Sello ofrece razas disponibles.

Para el onboarding inicial, recomiendo no abrir demasiadas. Mejor 7 u 8, claras y jugables.

## Razas iniciales sugeridas

### 1. Humano Renacido

Versátil, adaptable, con memoria parcial del mundo real.

Bonus:

- +1 punto flexible.
- Aprende un poco más rápido durante niveles bajos.

Ideal para quien quiera una experiencia clásica.

---

### 2. Luminar

Humanoide tocado por luz solar altheriana.

Bonus:

- Resistencia leve a miedo y sombras.
- Afinidad con magia solar y curación.

Muy conectado con Altherion, Seralyne, la Capilla del Sol Quieto y el tono luminoso de Villaclara.

---

### 3. Silvano de Hojaluna

Raza feérica o elfoide de bosque claro.

Bonus:

- Mejor percepción natural.
- Afinidad con arcos, naturaleza y sigilo.

Conecta con la Senda de Hojaluna y zonas feéricas cercanas.

---

### 4. Ferino

Humanoide con rasgos animales.

Subvariantes cosméticas:

- Zorro.
- Gato.
- Lobo.
- Conejo.
- Mapache.

Bonus:

- Mejor olfato/percepción.
- Mejor iniciativa o esquiva.

Perfecto para tono isekai y retratos de personaje.

---

### 5. Forjado Menor

Cuerpo artificial, arcano o semimecánico.

Bonus:

- Resistencia a venenos.
- Menor necesidad de comer.
- Afinidad con mecanismos.

Ideal para programadores, mecánicos y jugadores que quieran jugar “soy una tostadora sagrada con ansiedad”.

---

### 6. Dracónido Suave

Sangre dracónica menor, no necesariamente enorme.

Bonus:

- Resistencia elemental ligera.
- Ataque menor de aliento desbloqueable.

Debe ser equilibrado para no parecer “modo protagonista con DLC”.

---

### 7. Mediano Campestre

Pequeño, resistente, sociable.

Bonus:

- Mejor suerte menor.
- Bonus a cocina, comercio y esconderse.

Funciona muy bien con Villaclara, panadería, huertos y caos rural.

---

### 8. Umbrío Redimido

Raza marcada por sombra, pero no malvada.

Bonus:

- Visión en penumbra.
- Afinidad con sigilo y magia de sombra menor.

Interesante por el conflicto con Purificadores Risueños y documentos alterados.

---

# Selección de clase inicial

La clase se elige después de la raza, con sugerencias basadas en el pasado.

## Clases iniciales sugeridas

### 1. Guerrero

Directo, resistente, fácil para principiantes.

Rol:

- Combate cuerpo a cuerpo.
- Protección básica.
- Buen aguante.

---

### 2. Explorador

Movimiento, rastreo, arco, supervivencia.

Rol:

- Zonas exteriores.
- Misiones de campo.
- Buen tutorial para mapas y rastros.

---

### 3. Pícaro

Sigilo, trampas, golpes precisos.

Rol:

- Mazmorras.
- Cerraduras.
- Rutas alternativas.

---

### 4. Mago Aprendiz

Daño elemental y utilidad.

Rol:

- Combate a distancia.
- Identificación mágica.
- Puzzles arcanos.

---

### 5. Clérigo Solar

Curación, luz, apoyo.

Rol:

- Supervivencia.
- Bendiciones.
- Capilla del Sol Quieto.

---

### 6. Bardo

Social, apoyo, control ligero.

Rol:

- Rumores.
- NPCs.
- Buffs.

---

### 7. Artificiero

Mecanismos, herramientas, gadgets.

Rol:

- Reparaciones.
- Trampas.
- Objetos raros.

---

### 8. Cocinero de Batalla

Clase muy InheronMUD.

Rol:

- Buffs por comida.
- Sartén como arma.
- Ingredientes raros.
- Sinergia fuerte con Villaclara y Doña Marga.

Esta clase debería existir sí o sí. La sartén es canon emocional.

---

### 9. Guardián Albañil

Inspirado en la Guardia Albañil de la historia local.

Rol:

- Tanque.
- Reparaciones simples.
- Defensa de aliados.
- Construcciones menores.

Clase con sabor propio de Altherion.

---

### 10. Invocador Novato

Invoca ayudantes menores.

Rol:

- Mascotas.
- Control.
- Versatilidad.

Puede empezar con cosas pequeñas y ridículas:

- Pollo astral.
- Limo obediente.
- Mano mágica con baja autoestima.

---

# Relación pasado → sugerencias

| Pasado | Clases sugeridas |
|---|---|
| Oficinista agotado | Clérigo Solar, Guardián, Bardo, Artificiero |
| Hikikomori | Mago, Invocador, Artificiero |
| Deportista amateur | Guerrero, Explorador, Guardián |
| Estudiante | Mago, Bardo, Clérigo |
| Ama de casa | Cocinero de Batalla, Clérigo, Guerrero |
| Repartidor | Explorador, Pícaro, Duelista futuro |
| Programador | Artificiero, Mago, Invocador |
| Cocinero | Cocinero de Batalla, Alquimista futuro, Guerrero |
| Enfermero | Clérigo Solar, Alquimista, Guardián |
| Policía local | Guardián, Guerrero, Explorador |
| Jubilado curioso | Bardo, Clérigo, Mago |
| Influencer | Bardo, Pícaro, Ilusionista futuro |
| Mecánico | Artificiero, Guardián Albañil, Guerrero |
| Dependiente | Pícaro, Bardo, Mercader futuro |

---

# Estructura de rooms por pasado

Cada zona tutorial debería usar una plantilla común.

```yaml
tutorial_zone:
  id: tutorial_oficinista
  nombre: "Último turno en la oficina"
  background: oficinista_agotado
  max_duration_minutes: 12
  rooms:
    - id: cubiculo_4b
      teaches:
        - mirar
        - examinar
    - id: sala_impresoras
      teaches:
        - usar
    - id: cocina_corporativa
      teaches:
        - coger
        - inventario
    - id: pasillo_fluorescentes
      teaches:
        - movimiento
    - id: calle_oficina
      teaches:
        - evento_final
  final_event:
    id: truck_kun_reparto
    type: unavoidable_death
```

---

# Tutorial común por hitos

En vez de comprobar que el jugador pisa rooms concretas, recomiendo usar flags.

```yaml
tutorial_flags:
  looked: false
  examined: false
  moved: false
  picked_item: false
  checked_inventory: false
  talked: false
  used_item: false
  faced_danger: false
```

El evento final solo se activa cuando se cumplen las mínimas:

```yaml
required_for_death_event:
  - looked
  - examined
  - moved
  - picked_item
  - checked_inventory
  - talked
  - used_item
```

Esto evita que el jugador muera demasiado pronto sin aprender lo básico.

---

# La muerte no debe poder evitarse

Puede parecer injusto, así que hay que presentarla bien.

Regla de oro:

> El jugador puede variar cómo ocurre el final, pero no impedirlo.

Ejemplo:

- Si cruza la calle: Truck-kun.
- Si vuelve al edificio: ascensor dimensional.
- Si se queda quieto: paloma apocalíptica.
- Si intenta llamar a emergencias: el teléfono responde “Servicio de reencarnaciones, espere su turno”.

Esto da libertad teatral sin romper el flujo.

---

# Pantalla o room de transición

## Oficina de Reubicación Heroica No Solicitada

Descripción:

```text
Estás en una sala blanca, infinita y moderadamente mal ventilada.

Hay una mesa, una lámpara, una montaña de formularios y una ventanilla
con el letrero:

REENCARNACIONES / ISEKAIS / MIGRACIONES NARRATIVAS

Una funcionaria de expresión cansada moja un sello en tinta dorada.
```

Comandos:

- `mirar`
- `hablar dama`
- `elegir raza`
- `elegir clase`
- `confirmar`
- `ayuda razas`
- `ayuda clases`

La Dama Sello entrega el vale.

```text
La funcionaria te entrega un papel sellado.

—Cuando despiertes, ve al Gremio de Aventureros.
—Diles que vienes por orientación de novato.
—No aceptes contratos de sótanos, panes vivos o pozos cantantes hasta que alguien te explique el sistema.
Hace una pausa.
—Bueno. Probablemente lo harás igualmente.
```

---

# Item inicial

## Vale de Orientación para Aventurero Novato

Descripción larga:

```text
Un vale oficial del Gremio de Aventureros de Villaclara, sellado con tinta azul y dorada.

Texto visible:
"Este documento acredita que su portador ha sufrido una transferencia planar,
renacimiento narrativo, abducción dimensional o accidente equivalente.

Canjeable en el Gremio de Aventureros por:
- explicación básica del mundo,
- registro provisional,
- rango Cobre,
- una misión inicial razonablemente segura,
- y una mirada de lástima profesional.

No canjeable por cerveza.
No insistir."
```

Uso:

```text
usar vale
```

Fuera del Gremio:

```text
Agitas el vale con dignidad.
Nadie parece impresionado, salvo una gallina que se aleja con prudencia.
```

En el Gremio:

```text
Entregas el vale en el mostrador.

La recepcionista lo lee, te mira, mira tus zapatos, vuelve a mirar el vale.

—Transferido reciente. Clase inicial sin validar. Sin historial local.
Suspira.
—Perfecto. Rango Cobre. Bienvenido a Villaclara.
```

---

# Primeras quests tras llegar a Villaclara

Al entregar el vale, el Gremio desbloquea el “paquete de novato”.

## Quest 1: Registro de Aventurero Cobre

Objetivo:

- Entregar vale.
- Elegir nombre local si quiere.
- Recibir placa provisional.

Recompensa:

- Placa Cobre provisional.
- 5 monedas.
- Pan de Alba Serena.
- Acceso al tablón del gremio.

---

## Quest 2: Aprende a no morir en Villaclara

Miniquest guiada.

Objetivos:

- Visitar la Posada del Segundo Gallo.
- Visitar la Panadería Panbendito.
- Visitar la Capilla del Sol Quieto.
- Leer el Tablón del Gremio.

Recompensa:

- Mapa básico de Villaclara.
- Reputación local +1.
- Desbloqueo de misiones Cobre.

---

## Quest 3: Primera tarea Cobre

Opciones según clase:

| Clase | Primera tarea recomendada |
|---|---|
| Guerrero | Espantapájaros animado en Campo Norte |
| Explorador | Rastrear gallina con cascabel |
| Pícaro | Recuperar cucharas desaparecidas |
| Mago | Identificar runa en el pozo |
| Clérigo | Ayudar en la Capilla |
| Bardo | Recoger rumores en la posada |
| Artificiero | Reparar cierre del tablón |
| Cocinero | Ayudar a Doña Marga con masa sospechosa |
| Guardián Albañil | Inspeccionar grieta del sótano |
| Invocador | Controlar un limo pequeño |

---

# Ventajas del sistema

## 1. Enseña jugando

Nada de tutorial con voz de manual de lavadora. El jugador aprende porque necesita sobrevivir a su último día normal.

## 2. Da identidad al personaje

El pasado no es solo una línea en ficha. Es una anécdota jugable.

## 3. Justifica el isekai

El jugador no aparece “porque sí”. El juego lo convierte en parte del tono.

## 4. Hace Villaclara más memorable

El contraste entre mundo real y plaza rural mágica hace que Villaclara se sienta como hogar extraño desde el minuto uno.

## 5. Permite rejugabilidad

Crear personajes nuevos no es repetir el mismo pasillo. Cada pasado tiene su propia broma mortal.

---

# Diseño técnico sugerido

## Entidad Background

```json
{
  "id": "oficinista_agotado",
  "name": "Oficinista agotado",
  "description": "Vivías atrapado entre correos, reuniones y una impresora que olía a derrota.",
  "tutorialZone": "tutorial_oficina",
  "trait": "resistencia_al_papeleo",
  "suggestedClasses": [
    "clerigo_solar",
    "guardian_albanil",
    "bardo",
    "artificiero"
  ],
  "startingMemory": "Recuerdas una taza de café tibio y el sonido de un claxon demasiado narrativo."
}
```

## Entidad Trait

```json
{
  "id": "resistencia_al_papeleo",
  "name": "Resistencia al papeleo",
  "description": "Has visto formularios capaces de romper voluntades menores.",
  "effects": [
    {
      "type": "skill_bonus",
      "skill": "administracion",
      "value": 1
    },
    {
      "type": "dialogue_unlock",
      "tag": "burocracia"
    }
  ]
}
```

## Estado de onboarding

```json
{
  "characterCreation": {
    "phase": "real_world_tutorial",
    "background": "oficinista_agotado",
    "race": null,
    "class": null,
    "tutorialFlags": {
      "looked": true,
      "examined": true,
      "moved": true,
      "pickedItem": true,
      "checkedInventory": true,
      "talked": false,
      "usedItem": false
    }
  }
}
```

---

# Comando especial recomendado

## `recordar`

Una vez en Eryndor, el jugador puede usar:

```text
recordar
```

Respuesta:

```text
Cierras los ojos.

Recuerdas luces blancas, un claxon, una ventanilla administrativa
y una funcionaria diciendo que Villaclara era "un destino de baja mortalidad relativa".

No estás seguro de si eso debería tranquilizarte.
```

Este comando puede mostrar:

- Pasado.
- Rasgo heredado.
- Última escena del mundo real.
- Pistas emocionales futuras.

---

# Nombre oficial del onboarding

Opciones buenas:

1. **El Último Día Normal**
2. **Prólogo: Antes del Alba**
3. **Transferencia a Villaclara**
4. **Tutorial de Defunción Heroica**
5. **La Oficina de Reubicación Heroica No Solicitada**

Recomendación:

## Prólogo: El Último Día Normal

Tiene tono isekai, humor y algo de melancolía suave.

---

# Resumen jugable

```text
1. El jugador crea nombre básico.
2. Elige pasado del mundo real.
3. Aparece en una microzona tutorial propia.
4. Aprende comandos básicos.
5. Muere de forma inevitable y personalizada.
6. Despierta en la Oficina de Reubicación Heroica.
7. Elige nueva raza.
8. Elige clase inicial.
9. Recibe el Vale de Orientación para Aventurero Novato.
10. Aparece en la Plaza del Alba Chica de Villaclara.
11. El juego le dirige al Gremio de Aventureros.
12. Entrega el vale y empieza oficialmente como aventurero Cobre.
```

---

# Recomendación de implementación inicial

Para la vertical slice, implementar primero solo **4 pasados completos**:

- Oficinista agotado.
- Hikikomori.
- Deportista amateur.
- Ama de casa todoterreno.

Los demás pueden quedar como contenido expansible.

Esto permite probar el flujo completo sin construir catorce prólogos de golpe.

---

# Pendientes recomendados

1. Definir el esquema final de `backgrounds`.
2. Definir el esquema final de `traits`.
3. Definir las razas jugables iniciales.
4. Definir las clases iniciales y sus skills de nivel 1.
5. Diseñar las rooms completas de los cuatro pasados de la vertical slice.
6. Escribir los diálogos de la Dama Sello.
7. Diseñar la room de Plaza del Alba Chica.
8. Diseñar el flujo del Gremio de Aventureros.
9. Implementar `recordar`.
10. Conectar el vale con el registro de aventurero Cobre.
