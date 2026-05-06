# InheronMUD — Guía de jugador: Bardo de Crónica Viva

**Documento de ayuda para jugadores nuevos**  
**Clase:** Bardo de Crónica Viva  
**Rango cubierto:** niveles 1–39  
**Versión:** v1.1  
**Cambios de esta versión:** feedback visual de estados, aclaración de Aplauso en solo play, Núcleo/Estrofa, Armonías visibles, Trama con peso de hilos, ejemplos de fallo y nota sobre instrumentos.

---

## 1. ¿Qué es un Bardo de Crónica Viva?

El Bardo de Crónica Viva no es solo alguien que canta mientras otros pegan. Es una clase que **lee la escena**, altera el ánimo del grupo, debilita enemigos, protege recuerdos y convierte momentos importantes en ventaja.

Tu trabajo no es hacer siempre el mayor daño. Tu trabajo es conseguir que el combate, la sala o la conversación empiecen a sonar a vuestro favor.

Un Bardo bien jugado:

- mantiene varios efectos activos;
- ayuda al grupo a acertar, resistir y sobrevivir;
- debilita enemigos con coplas y ritmos;
- interrumpe conjuros;
- cura de forma gradual;
- descubre ecos y pistas de las salas;
- protege nombres, recuerdos y momentos importantes;
- usa el **Pulso de Combate** para ver oportunidades;
- decide cuándo seguir el Pulso y cuándo experimentar manualmente.

Frase corta:

> El Bardo no gana por cantar más fuerte. Gana porque decide qué parte de la escena merece seguir viva.

---

## 2. Qué tipo de jugador disfrutará el Bardo

Te gustará el Bardo si quieres:

- apoyar al grupo sin ser solo sanador;
- tener muchas decisiones tácticas;
- jugar con buffs, debuffs y mantenimiento;
- manipular estados del enemigo;
- participar mucho en exploración y diálogo;
- sentir que tus acciones importan en la historia;
- jugar una clase con mucha personalidad.

Quizá no sea tu primera opción si quieres:

- daño directo simple;
- rotación fija de dos botones;
- armadura pesada;
- resolver todo pegando;
- ignorar estados, recursos y efectos.

---

## 3. Tus recursos

El Bardo usa cuatro indicadores importantes.

```text
PV 42/58 · Voz 84/125 · 🎶2 · 👏1 · Trama 3/4
```

En clientes con poco espacio puede verse todavía más compacto:

```text
PV 42/58 | Voz 84 | 🎶2 | 👏1 | T 3/4
```

### PV

Tus puntos de vida. Si llegan a cero, la canción se complica y puede que tus efectos sostenidos desaparezcan.

### Voz

Tu recurso principal.

Lo gastas para:

- lanzar notas;
- cantar himnos;
- usar coplas;
- curar;
- mantener efectos;
- leer salas;
- usar técnicas de interrupción.

Se recupera cada ronda.

Si te quedas sin Voz, todavía puedes actuar, pero perderás mucha potencia táctica.

### Estrofa 🎶

Representa el ritmo de tu composición.

Sube cuando usas habilidades de **familias distintas**.

Ejemplo:

```text
Nota → Copla → Himno
```

Eso crea variedad y sube Estrofa.

Cuando llegas a **Estrofa 3**, muchas habilidades ganan efectos extra. A eso lo llamamos encontrar el **Estribillo**.

#### ¿Qué pasa con las habilidades de Núcleo?

Las habilidades de familia **Núcleo**, como **Sostener Compás** o **Cambiar el Hilo**, son **neutrales** para la racha de Estrofa.

Eso significa:

- no suelen dar Estrofa por sí solas;
- no rompen tu secuencia anterior;
- no cuentan como repetición dañina;
- sirven para gestionar la Trama sin arruinar el ritmo.

Ejemplo:

```text
Copla → Sostener Compás → Himno
```

Sigue contando como cambio útil de Copla a Himno.

Consejo:

> No repitas siempre la misma familia. El Bardo brilla cuando alterna. Núcleo es tu mesa de mezclas, no la canción.

### Aplauso 👏

Es un recurso especial. Representa que la escena ha respondido a algo memorable.

Puedes ganar Aplauso aunque estés solo.

Fuentes de Aplauso:

- un crítico importante;
- una esquiva decisiva;
- un enemigo que falla por tus efectos;
- interrumpir una habilidad peligrosa;
- salvarte por poco;
- proteger un nombre;
- descubrir una pista;
- registrar un momento importante;
- tener testigos de una hazaña.

Los testigos **potencian** el Aplauso, pero no son siempre obligatorios.

Ejemplo en solo play:

```text
El Conejo Acorazado falla por culpa de tu Copla Pegadiza.
👏 La escena responde. Ganas 1 Aplauso.
```

Ejemplo con público:

```text
Silo ve cómo conviertes el ataque del bandido en un tropiezo glorioso.
👏 Los testigos hacen crecer la escena. Ganas 1 Aplauso.
```

### Trama

La Trama son los efectos bardos que mantienes activos.

Ejemplo:

```text
Trama activa: 3/4
- Himno de la Primera Chapa: 2 rondas
- Copla Pegadiza sobre Conejo Acorazado: 2 rondas
- Balada de Remiendo sobre Tilo: 3 rondas
```

Cada efecto ocupa un hilo de Trama. Algunos efectos importantes pueden ocupar más de un hilo.

Si llegas al límite, no podrás añadir más efectos hasta que uno expire, lo sostengas de otra forma o uses **Cambiar el Hilo**.

---

## 4. Cómo ver tus estados y efectos

En InheronMUD verás los estados de dos formas:

1. **Resumen mecánico**, con nombre y duración.
2. **Descripción narrativa**, al mirar al objetivo o la sala.

### Comando `estado`

Ejemplo:

```text
> estado conejo

Conejo Acorazado
Estados:
- 🟨 Zumbido (2r): -1 Concentración, -1 resistencia a interrupción.
- 🟪 Distraído (1r): -2 Precisión, -1 Evasión.
```

### Comando `mirar`

Ejemplo:

```text
> mirar conejo

El Conejo Acorazado sacude las orejas bajo el yelmo.
Un zumbido fino parece perseguirle por dentro del casco.
También mira a todas partes menos a donde debería.
```

### Comando `trama`

Ejemplo:

```text
> trama

🎵 Trama activa: 3/4 hilos

1. Himno de la Primera Chapa — grupo — 2r — peso 1
   +1 Precisión, Moral x1.

2. Copla Pegadiza — Conejo Acorazado — 2r — peso 1
   Distraído: -2 Precisión, -1 Evasión.

3. Balada de Remiendo — Tilo — 3r — peso 1
   Cura al inicio del turno.

Armonías:
- Ninguna activa.
- Armonía de Ridículo disponible si aplicas Síncopa Burlona al Conejo Acorazado.
```

Si un efecto pesa más:

```text
2. Balada de Ysolde — grupo — 2r — peso 2
   Protección fuerte contra Borrón, Juramento Falso y Culpa Prestada.
```

---

## 5. Colores e iconos de estados

La interfaz textual puede usar iconos y colores para ayudarte a leer rápido.

| Icono | Color sugerido | Tipo | Ejemplos |
|---|---|---|---|
| 🟩 | Verde | Curación / sostén | Balada de Remiendo, Calor en la Voz |
| 🟦 | Azul | Defensa / protección | Paso de Liria, Escudo, Nombre Anclado |
| 🟨 | Amarillo | Sónico / concentración | Zumbido, Ritmo Cortado |
| 🟪 | Violeta | Copla / control social | Distraído, Burlado, Fuera de Compás |
| 🟥 | Rojo | Daño / vulnerabilidad | Expuesto, Sangrado |
| ⬛ | Negro | Sombra / memoria peligrosa | Borrón, Olvido Menor |
| ✨ | Dorado | Moral / inspiración | Moral, Inspirado |
| 📜 | Pergamino | Crónica / pistas | Tinta de Voz, Testigo Improbable |

Ejemplo compacto:

```text
Estados: 🟪 Distraído 2r · 🟨 Zumbido 1r · 🟥 Expuesto 1r
```

---

## 6. Familias de habilidades

Las habilidades del Bardo tienen familias. Cambiar de familia ayuda a generar Estrofa.

| Familia | Qué hace |
|---|---|
| Nota | Daño sónico, presión e interrupción |
| Danza | Movimiento, evasión, ritmo corporal |
| Copla | Debuffs, burlas, mala suerte y control |
| Himno | Buffs, moral, protección |
| Balada | Curación, memoria, nombres |
| Relato | Exploración, Crónica, rumores |
| Contraestrofa | Reacciones, interrupciones, defensa mágica |
| Coda | Remates que consumen o transforman efectos |
| Núcleo | Gestión de Trama y recursos; neutral para Estrofa |

---

## 7. Cómo se juega el Bardo

El Bardo no suele buscar una rotación fija. Busca una **secuencia**.

Una secuencia básica puede ser:

1. Abrir con **Himno de la Primera Chapa** para mejorar al grupo.
2. Aplicar **Copla Pegadiza** al enemigo fuerte.
3. Usar **Sostener Compás** para mantener el efecto más importante.
4. Lanzar **Balada de Remiendo** si alguien está herido.
5. Rematar con **Coda Inoportuna** cuando el enemigo tenga un debuff y tú tengas Estrofa suficiente.

Tu objetivo es mantener la escena inclinada a tu favor.

---

## 8. Pulso de Combate

El **Pulso de Combate** es un sistema que te propone acciones rápidas según el momento.

En vez de tener que recordar todos los comandos, verás algo parecido a esto:

```text
Pulso de Combate:
1) Coda Inoportuna → Conejo Acorazado
2) Sostener Compás → Himno de la Primera Chapa
3) Balada de Remiendo → Tilo
4) Corte de Maelis
5) Paso de Liria
6) Canto de Resonancia → sala

Escribe 1-6, o un comando.
```

Puedes escribir:

```text
1
```

O:

```text
usar 3
```

O seguir usando comandos normales:

```text
cast copla conejo
cast sostener himno
```

### Pulso propone oportunidades, no órdenes

El Pulso te enseña jugadas útiles. No juega por ti.

A veces querrás seguir su consejo.  
A veces querrás preparar una combinación diferente.

Ejemplo:

```text
1. Coda Inoportuna → Conejo Acorazado
   Recomendado porque: el enemigo está Distraído y tienes Estrofa 3.
```

Eso te enseña:

> “Distraído + Estrofa 3 = buen momento para Coda.”

### ¿El Pulso muestra Armonías?

Sí. Cuando una Armonía está activa o está a punto de estarlo, el Pulso puede avisarte.

Ejemplo:

```text
🎭 Armonía de Ridículo activa sobre Conejo Acorazado.
Si falla un ataque, ganarás Estrofa. Si falla mucho, ganarás Aplauso.
```

Ejemplo de oportunidad:

```text
6) Síncopa Burlona → Conejo Acorazado
   Activaría Armonía de Ridículo junto a Copla Pegadiza.
```

### Modos del Pulso

Puedes cambiar cómo prioriza sugerencias:

```text
pulso modo tactico
pulso modo ofensivo
pulso modo defensivo
pulso modo soporte
pulso modo explorador
pulso modo manual
```

| Modo | Qué prioriza |
|---|---|
| táctico | equilibrio general |
| ofensivo | daño y remates |
| defensivo | supervivencia |
| soporte | ayudar al grupo |
| explorador | sala, entorno y utilidad |
| manual | solo muestra Pulso si lo pides |

---

## 9. Qué pasa si algo falla

### Trama llena

Si intentas lanzar un nuevo efecto cuando tu Trama está llena:

```text
No puedes trenzar más efectos.
Trama activa: 3/3.
Usa Sostener Compás, Cambiar el Hilo o deja que un efecto expire.
```

### Voz insuficiente

Si no tienes Voz suficiente:

```text
Tu Voz no alcanza para sostener esa melodía.
Necesitas 18 Voz. Tienes 11.
```

### Sostener demasiado el mismo efecto

```text
La melodía empieza a tensarse.
Sostener Himno de la Primera Chapa otra vez costará 14 Voz.
```

### El objetivo resiste

```text
Conejo Acorazado resiste la Copla Pegadiza.
Queda Irritado leve, pero no Distraído.
```

### El efecto es purgado

```text
El jefe sacude la melodía como quien se quita polvo de estatua.
Copla Pegadiza se desvanece y libera 1 hilo de Trama.
```

Si lo habías sostenido:

```text
Como habías sostenido la Copla, recuperas 1 Estrofa.
```

---

## 10. Instrumentos y equipo

Los instrumentos no son solo cosmética. Pueden modificar familias concretas.

Ejemplos de diseño:

| Instrumento | Bonus posible |
|---|---|
| Laúd ligero | +1 a Coplas o reducción pequeña de coste |
| Flauta de viaje | mejora Danza y exploración |
| Tambor de marcha | mejora Himnos y Moral |
| Campanilla de plata | mejora Contraestrofas e interrupciones |
| Arpa de memoria | mejora Baladas y Nombres |
| Rabel callejero | mejora Rumor Andante y acciones sociales |

Ejemplo:

```text
Laúd de Maelis
+1 a tiradas de Copla.
Corte de Maelis cuesta 1 Voz menos.
```

Nota:

> Los bonos de instrumento deben ser pequeños. El Bardo debe ganar por tocar bien la escena, no por llevar un piano legendario en el bolsillo.

---

## 11. Habilidades nivel 1–10

### Nivel 1: Nota Cortante I

**Tipo:** ataque sónico.  
**Familia:** Nota.  
**Coste:** Voz.  
**Uso:** hacer daño y aplicar presión.

Lanzas una nota afilada contra un enemigo. Hace daño sónico y puede aplicar **Zumbido**.

**Zumbido** hace que el enemigo tenga peor concentración y sea más fácil de interrumpir.

Úsala cuando:

- quieras hacer daño simple;
- el enemigo ya tenga estados bardos;
- quieras preparar una interrupción;
- no sepas aún qué preparar.

Mensaje típico:

```text
Tensas una nota fina como hilo de plata y la lanzas contra Conejo Acorazado.
```

---

### Nivel 1: Paso de Liria I

**Tipo:** defensa y movimiento.  
**Familia:** Danza.  
**Coste:** Voz.  
**Duración:** 2 rondas.

Te da:

- más evasión;
- más iniciativa;
- mejor posicionamiento.

Úsala cuando:

- estés en peligro;
- juegues solo;
- quieras preparar una Armonía con un Himno;
- necesites ganar tiempo.

---

### Nivel 2: Copla Pegadiza I

**Tipo:** debuff.  
**Familia:** Copla.  
**Coste:** Voz.  
**Duración:** varias rondas.

Cantas una copla irritante que puede dejar al enemigo **Distraído**.

**Distraído** reduce su precisión y evasión.

Úsala cuando:

- hay un enemigo peligroso;
- quieres reducir daño entrante;
- quieres preparar Coda Inoportuna;
- quieres activar futuros combos de control.

---

### Nivel 3: Estrofa Creciente

**Tipo:** pasiva.

Empiezas a generar Estrofa al alternar familias.

Ejemplo:

```text
Copla → Himno → Danza
```

Eso es bueno.

Repetir siempre lo mismo es malo para tu ritmo.

---

### Nivel 3: Sostener Compás

**Tipo:** mantenimiento.  
**Familia:** Núcleo.  
**Coste:** Voz.

Sirve para mantener efectos activos.

Puedes usarlo para:

- alargar un efecto;
- evitar que expire este turno;
- convertirlo en Eco;
- conservar una Armonía.

Ejemplo:

```text
cast sostener himno
```

Mensaje:

```text
Mantienes el compás de Himno de la Primera Chapa. Durará 1 ronda más.
```

Consejo:

> Esta es una de tus habilidades más importantes. El Bardo no solo lanza efectos: los mantiene.

---

### Nivel 4: Canto de Resonancia I

**Tipo:** exploración / entorno.  
**Familia:** Relato.  
**Coste:** Voz.

Cantas a la sala para detectar cómo responde.

Puede revelar:

- ecos;
- pistas sonoras;
- tensión;
- anomalías;
- secretos;
- memoria del lugar.

En combate puede crear **Resonancia de Sala**, que da efectos según el lugar.

Si una sala no tiene rasgos especiales definidos, el Canto de Resonancia seguirá dando una respuesta básica, aunque no descubra nada concreto.

Ejemplo:

```text
La sala no devuelve un eco útil, pero ahora sabes que aquí no hay resonancia especial.
```

Esto evita que la habilidad se sienta vacía cuando una zona aún no tiene tags ricos.

---

### Nivel 5: Himno de la Primera Chapa I

**Tipo:** buff grupal.  
**Familia:** Himno.  
**Coste:** Voz.  
**Duración:** 3 rondas.

Da al grupo:

- Moral;
- más precisión;
- resistencia mental extra si tienes Estrofa 3.

Úsala cuando:

- empieza un combate largo;
- el grupo necesita estabilidad;
- quieres preparar Armonía de Vanguardia con Paso de Liria.

---

### Nivel 6: Síncopa Burlona I

**Tipo:** control.  
**Familia:** Copla.  
**Coste:** Voz.

Deja al enemigo **Burlado**.

Un enemigo Burlado:

- ataca peor si ignora al Bardo;
- puede dar Estrofa al Bardo si intenta golpearlo y falla.

Combina muy bien con Copla Pegadiza para activar **Armonía de Ridículo**.

Úsala cuando:

- quieres controlar a un enemigo;
- quieres que falle;
- quieres preparar Aplauso;
- estás dispuesto a llamar su atención.

---

### Nivel 7: Corte de Maelis I

**Tipo:** reacción / interrupción.  
**Familia:** Contraestrofa.  
**Coste:** Voz.

Sirve para responder cuando un enemigo prepara:

- hechizo;
- canto;
- ritual;
- habilidad mental;
- habilidad verbal;
- efecto sónico.

Puede reducir o interrumpir la acción.

Funciona mejor si el enemigo tiene **Zumbido**.

Úsala cuando:

- el Pulso te avise de un conjuro enemigo;
- veas que un enemigo prepara algo peligroso;
- quieras proteger al grupo de magia o control.

---

### Nivel 8: Balada de Remiendo I

**Tipo:** curación gradual.  
**Familia:** Balada.  
**Coste:** Voz.  
**Duración:** 3 rondas.

Cura al aplicar y luego vuelve a curar en turnos posteriores.

No es una gran cura instantánea, pero es excelente para mantener vivo a alguien mientras sigues trenzando efectos.

A Estrofa 3 puede limpiar estados leves como:

- Cansado leve;
- Sangrado leve.

Úsala cuando:

- un aliado empieza a bajar de vida;
- quieres sostener al tanque;
- necesitas una cura eficiente;
- quieres preparar Armonía de Remiendo más adelante.

---

### Nivel 9: Rumor Andante I

**Tipo:** social / utilidad / debuff contextual.  
**Familia:** Relato.  
**Coste:** Voz.

Fuera de combate sirve para:

- abrir temas de conversación;
- buscar rumores;
- bajar hostilidad;
- detectar contradicciones;
- descubrir pistas sociales.

En combate funciona contra enemigos inteligentes o sociales, sembrando duda.

Úsala cuando:

- hablas con NPCs;
- investigas;
- estás en tabernas, mercados o escenas sociales;
- luchas contra humanoides o enemigos con reputación/ego.

---

### Nivel 10: Primer Estribillo

**Tipo:** pasiva.

La primera vez en cada combate que llegas a Estrofa 3:

- recuperas Voz;
- aumentas temporalmente tu límite de Trama;
- obtienes un Sostener Compás gratis.

Además, desbloqueas **Cambiar el Hilo**.

Este es el nivel donde el Bardo empieza a sentirse plenamente táctico.

---

### Nivel 10: Cambiar el Hilo

**Tipo:** gestión de Trama.  
**Familia:** Núcleo.  
**Coste:** Voz.

Retiras voluntariamente uno de tus efectos bardos activos para:

- liberar Trama;
- ganar Estrofa;
- abaratar la próxima habilidad de familia distinta.

Úsala cuando:

- tu Trama está llena;
- quieres preparar una Coda;
- un efecto ya no te interesa;
- necesitas cambiar de plan.

Mensaje:

```text
Sueltas un hilo antes de que ahogue la melodía. Estrofa +1.
```

---

## 12. Habilidades nivel 11–19

### Nivel 11: Nota Cortante II

Versión mejorada de Nota Cortante.

Hace más daño y funciona mejor contra enemigos que ya tienen estados bardos.

Úsala como daño estable y para seguir presionando enemigos debilitados.

---

### Nivel 12: Paso de Liria II

Mejora la evasión y el reposicionamiento.

Permite moverte mejor entre flanco y retaguardia, y puede ayudarte contra estados de movimiento leve.

Ideal para sobrevivir y reposicionarte sin perder ritmo.

---

### Nivel 13: Copla de Mala Suerte I

Debuff que reduce la probabilidad de crítico y la evasión del enemigo.

También puede generar Aplauso si el enemigo falla.

Úsala contra enemigos peligrosos, ágiles o con ataques fuertes.

---

### Nivel 14: Himno del Valor Prestado I

Buff mental.

Ayuda contra miedo, confusión leve y presión psicológica.

Úsalo cuando:

- el grupo está asustado;
- un enemigo usa magia mental;
- necesitas resistencia adicional;
- quieres preparar Armonía de Remiendo junto a Balada de Remiendo.

---

### Nivel 15: Verso de Fennel I

Habilidad de memoria y protección.

Aplica **Nombre Anclado menor**.

Ayuda contra:

- miedo;
- confusión;
- Olvido;
- Borrón;
- manipulación de identidad.

También puede estabilizar NPCs o testimonios fuera de combate.

Úsala cuando la escena toque nombres, memoria, Cámara o identidad.

---

### Nivel 16: Contraestrofa I

Reacción defensiva.

Reduce o cancela parcialmente efectos enemigos como:

- miedo;
- magia mental;
- canto;
- efectos sónicos;
- memoria menor;
- debuffs verbales.

Úsala para proteger aliados cuando el peligro no sea solo daño físico.

---

### Nivel 17: Relato Fidedigno I

Convierte una acción notable reciente en ventaja.

Puede darte Aplauso si un aliado o tú:

- hizo crítico;
- salvó a otro;
- interrumpió un boss;
- descubrió una pista;
- protegió un NPC;
- resistió un estado importante;
- sobrevivió por poco.

También da Inspirado leve.

Consejo:

> No lo uses sobre acciones triviales. Espera un momento que merezca ser contado.

---

### Nivel 18: Coda Inoportuna I

Remate táctico.

Requiere:

- Estrofa 3;
- que el enemigo tenga un efecto bardo.

Hace daño sónico y transforma un debuff en **Expuesto**.

Úsala cuando:

- el enemigo ya está Distraído, Burlado o con Zumbido;
- tienes Estrofa suficiente;
- quieres abrir una ventana de daño para el grupo.

---

### Nivel 19: Ensayo General

Pasiva.

Te da:

- más Voz máxima;
- más Aplauso máximo;
- Estrofa inicial si entras en combate con instrumento equipado.

---

## 13. Especialización al nivel 20

Al nivel 20 eliges una especialización.

No cambia tu identidad base, pero define qué tipo de escena sabes mantener mejor.

---

# 14. Especialización: Cantor del Alba

## Rol

Sanación, moral, protección y claridad.

El Cantor del Alba es el Bardo que mantiene al grupo en pie cuando la escena quiere convertirse en tragedia con gastos de gestión.

## Rasgo: Voz Cálida

Tus curaciones y efectos de moral dejan **Calor en la Voz**.

Calor en la Voz mejora la próxima curación recibida.

---

## Habilidades destacadas

### Nivel 21: Himno de Orencio I

Cura levemente al grupo y mejora moral/resistencia mental.

Muy bueno para combates largos.

### Nivel 23: Coro Protector I

Aplica escudo al grupo gastando Aplauso.

Más fuerte si hay testigos o aliados presentes.

### Nivel 25: Nana del Alba Serena I

Reacción curativa cuando un aliado baja demasiado de vida.

Ideal para evitar caídas inesperadas.

### Nivel 28: Luz ante Testigos I

Habilidad social y ritual.

Puede estabilizar NPCs, proteger testimonios o reforzar aliados en escenas tensas.

### Nivel 29: Coro de Viaje I

Ayuda en exploración y combate.

Reduce fatiga, mejora orientación y da iniciativa.

### Nivel 35: Bendición con Estribillo I

Consume Estrofa para proteger al grupo con escudo, inspiración y Calor en la Voz.

### Nivel 38: Coro de los Presentes

Muy potente si hay testigos, NPCs o aliados no combatientes.

Convierte presencia social en fuerza de grupo.

---

# 15. Especialización: Maestro del Contrapunto

## Rol

Control, interrupciones, debuffs y manipulación de fallos enemigos.

El Maestro del Contrapunto no hace que el enemigo pierda porque sea débil. Hace que pierda porque entra en la escena con el pie equivocado.

## Rasgo: Caos con Compás

Tus efectos variables siempre producen resultados útiles.

Además, enemigos con varios debuffs bardos pueden generar Estrofa o Aplauso cuando fallan.

---

## Habilidades destacadas

### Nivel 21: Contrapunto de Maelis I

Aplica **Fuera de Compás**.

El enemigo pierde precisión, concentración y se vuelve peor preparando habilidades.

### Nivel 23: Traspié de Branno I

Gasta Aplauso para hacer que un enemigo pierda ritmo.

Contra enemigos normales puede hacer perder acción menor.

Contra bosses se reduce a penalizaciones tácticas.

### Nivel 25: Paso Sincopado I

Movilidad y evasión avanzada.

Si un enemigo falla al atacarte, puedes ganar Aplauso.

### Nivel 28: Risa de Branno I

Debuff de área contra enemigos sensibles a lo mental/social.

Excelente contra grupos de humanoides.

### Nivel 29: Contraestrofa Burlona I

Reacción contra enemigos ya debilitados por tus efectos.

Reduce habilidades enemigas y puede ganar Estrofa.

### Nivel 35: Fuga del Traspié

Control de varios enemigos.

Puede ralentizar, quitar acciones menores y aplicar Expuesto si ya estaban Distraídos.

### Nivel 37: Cadencia Trampa I

Marca a un enemigo.

La próxima vez que falle, genera Aplauso y puede quedar Expuesto.

### Nivel 38: Aplauso Desviado I

Reduce o corrompe buffs enemigos menores.

Muy útil contra enemigos que se potencian.

---

# 16. Especialización: Cronista de Nombres

## Rol

Memoria, anti-Borrón, Crónica, investigación y protección de pistas.

El Cronista de Nombres es el Bardo más ligado al corazón de Inheron. No solo ayuda a ganar combates: impide que la verdad desaparezca.

También sirve en combate estándar. No necesitas estar siempre en una misión de la Cámara para ser útil.

## Rasgo: Tinta de Voz

Puedes proteger pistas, nombres y recuerdos importantes.

También haces que ciertas acciones queden marcadas para la Crónica.

---

## Cómo aporta en combate normal

Aunque no haya Borrón ni misterio evidente, el Cronista puede:

- dar defensa mental fuerte;
- proteger contra miedo y confusión;
- marcar enemigos con Tinta en el Aire;
- registrar acciones notables para generar Aplauso;
- usar Nota Cortante y Coplas como cualquier Bardo;
- reforzar al grupo con Crónica Compartida;
- convertir una sala o hecho reciente en anclaje táctico.

`Verso de Nombre Verdadero` no es solo anti-Cámara. Es una **defensa mental/mágica genérica muy potente**.

Úsalo contra:

- miedo;
- confusión;
- control mental;
- engaños;
- debuffs de identidad;
- enemigos que manipulan moral o memoria;
- bosses con fases psicológicas.

---

## Habilidades destacadas

### Nivel 21: Verso de Nombre Verdadero I

Aplica **Nombre Anclado**.

Protege contra manipulación mental, Olvido, Borrón y Juramento Falso menor.

También es defensa mental general.

### Nivel 23: Pregunta con Eco I

Herramienta de investigación.

Puede revelar contradicciones, topics ocultos o pistas.

En combates narrativos puede ayudar a descubrir patrones o incoherencias.

### Nivel 25: Copla contra el Borrón I

Protege al grupo contra Olvido y Borrón.

También puede funcionar como resistencia mental en escenas de presión psicológica.

### Nivel 28: Testigo Improbable I

Convierte un NPC, criatura, objeto o sala en testigo temporal.

Perfecto para escenas de investigación o memoria.

### Nivel 29: Relato Fidedigno II

Mejora Relato Fidedigno.

Permite registrar acciones notables también fuera de combate.

### Nivel 32: Tinta en el Aire I

Marca temporalmente una verdad, pista, sala, nombre o enemigo.

En combate puede ayudar contra enemigos de Cámara o Sombra, pero también sirve para señalar un patrón importante.

### Nivel 35: Balada de Ysolde I

Defensa grupal fuerte contra Borrón, Juramento Falso y Culpa Prestada.

Una habilidad muy importante en arcos de memoria.

### Nivel 37: Última Nota de Ysolde I

Protección de emergencia.

Puede evitar que un aliado o NPC sea borrado, silenciado o perdido narrativamente.

### Nivel 38: Refrán Inborrable I

Reduce el próximo debuff mental o de memoria que afecte al grupo.

---

## 17. Estados importantes

### Zumbido

Penaliza concentración y resistencia a interrupción.

Ideal para preparar Corte de Maelis.

### Distraído

Reduce precisión y evasión.

Muy bueno para preparar Coda Inoportuna.

### Burlado

Penaliza al enemigo si ignora al Bardo.

Combina con Copla Pegadiza.

### Moral

Aumenta precisión y resistencia mental.

Se acumula hasta cierto límite.

### Inspirado leve

Pequeño bonus de precisión y resistencia mental.

### Nombre Anclado

Protege contra miedo, Olvido, Borrón y manipulación de identidad.

Clave para Cronista.

### Fuera de Compás

Debuff avanzado del Maestro del Contrapunto.

Reduce precisión, concentración y preparación enemiga.

### Calor en la Voz

Mejora la siguiente curación recibida.

Clave para Cantor del Alba.

### Expuesto

El enemigo queda vulnerable a daño o ataques posteriores.

Suele aparecer tras una Coda o una preparación táctica.

---

## 18. Armonías que debes recordar

### Armonía de Vanguardia

Activa si mantienes:

- Himno de la Primera Chapa;
- Paso de Liria.

Resultado:

- más iniciativa;
- mejor movimiento.

### Armonía de Ridículo

Activa si el mismo enemigo tiene:

- Copla Pegadiza;
- Síncopa Burlona.

Resultado:

- si falla, ganas Estrofa;
- si falla mucho, puedes ganar Aplauso.

### Armonía de Remiendo

Activa con:

- Balada de Remiendo;
- Himno del Valor Prestado.

Resultado:

- mejor curación;
- ayuda contra miedo.

### Armonía de Nombre

Activa con:

- Verso de Fennel o Nombre Anclado;
- Relato Fidedigno o pista registrada.

Resultado:

- más resistencia contra Olvido/Borrón;
- puede generar Aplauso.

---

## 19. Consejos de juego

### Consejo 1: no llenes la Trama sin plan

Si llenas la Trama con efectos poco útiles, no tendrás espacio para lo importante.

Usa **Cambiar el Hilo** cuando la escena cambie.

### Consejo 2: sostén lo que importa

No sostengas todo.

Sostén:

- el Himno si el grupo lo necesita;
- la Copla si prepara una Coda;
- la Balada si alguien sigue en peligro;
- el efecto que mantiene una Armonía.

### Consejo 3: busca Estrofa 3

Estrofa 3 es tu punto dulce.

Al llegar ahí:

- muchas habilidades mejoran;
- Primer Estribillo te da beneficios;
- puedes preparar Codas.

### Consejo 4: usa Pulso, pero piensa

Pulso de Combate te da buenas opciones, no órdenes.

A veces conviene elegir una opción menos obvia para preparar un turno mejor.

### Consejo 5: el Bardo juega mejor mirando la sala

Si una sala tiene eco, memoria, público o elementos raros, tus habilidades de Relato pueden convertirlo en ventaja.

Si una sala no tiene tags especiales, Canto de Resonancia debería al menos confirmarte que no hay resonancia destacable.

### Consejo 6: protege nombres importantes

Si ves enemigos o escenas que tocan memoria, Olvido, Borrón o Cámara, las habilidades de Nombre pueden ser más importantes que hacer daño.

### Consejo 7: experimenta fuera del Pulso

El Pulso enseña buenas jugadas, pero no todas las jugadas.

Prueba combinaciones manuales para descubrir patrones:

```text
cast copla conejo
cast himno
cast sostener copla
cast sincopa conejo
```

---

## 20. Rotaciones y ejemplos

### Apertura básica de grupo, nivel 5

1. Himno de la Primera Chapa.
2. Copla Pegadiza al enemigo principal.
3. Sostener Compás sobre Himno si va a expirar.
4. Nota Cortante o Paso de Liria según peligro.

Resultado:

- grupo con Moral;
- enemigo debilitado;
- Estrofa creciendo.

### Control básico, nivel 6

1. Copla Pegadiza.
2. Síncopa Burlona sobre el mismo enemigo.
3. Mantener una de las dos.
4. Esperar fallo enemigo.
5. Ganar Estrofa/Aplauso si la Armonía se activa.

### Sostén defensivo, nivel 8

1. Himno de la Primera Chapa.
2. Balada de Remiendo al aliado herido.
3. Paso de Liria si te atacan.
4. Sostener Compás sobre Balada o Himno.

### Remate táctico, nivel 18

1. Copla Pegadiza.
2. Nota Cortante para añadir presión.
3. Llegar a Estrofa 3.
4. Coda Inoportuna.
5. Grupo aprovecha Expuesto.

---

## 21. Comandos útiles

Comandos largos:

```text
cast nota conejo
cast copla conejo
cast himno
cast sostener himno
cast cambiar_hilo copla
cast balada tilo
cast resonancia
```

Pulso:

```text
pulso (o p)
1
usar 2
rapida 3
1 conejo
```

Modos:

```text
pulso modo tactico (o p modo tactico)
pulso modo soporte
pulso modo manual
```

Estado:

```text
estado
estado bardo
trama
mirar conejo
mirar sala
```

---

## 22. Errores comunes

### “No puedo lanzar más efectos”

Tu Trama está llena.

Soluciones:

- espera a que expire algo;
- usa Sostener Compás si merece la pena;
- usa Cambiar el Hilo;
- usa una Coda si puedes convertir un debuff.

### “No gano Estrofa”

Probablemente repites la misma familia.

Alterna entre:

- Copla;
- Himno;
- Danza;
- Nota;
- Relato;
- Balada.

Recuerda: Núcleo es neutral y no debería romperte la racha.

### “Me quedo sin Voz”

Estás sosteniendo demasiado o usando habilidades caras.

Prueba:

- habilidades más baratas;
- dejar caer un efecto;
- usar Cambiar el Hilo;
- elegir otra sugerencia del Pulso.

### “Cronista se siente poco útil en combate simple”

Usa sus herramientas de fallback:

- proteger resistencia mental;
- marcar enemigos;
- registrar acciones notables;
- generar Aplauso;
- usar Nota Cortante cuando no haya memoria que proteger.

### “El Pulso no me propone una opción que esperaba”

Puede que tu personaje no tenga información suficiente.

Ejemplos:

- no ha visto que el enemigo prepara un conjuro;
- no ha detectado una pista;
- la sala no ha sido leída;
- el objetivo no tiene el estado necesario.

---

## 23. MVP recomendado para aprender la clase

Para empezar, no intentes dominar todo a la vez.

Aprende por capas:

### Capa 1: niveles 1–5

Objetivo:

- entender Voz;
- alternar familias;
- llegar a Estrofa 3;
- no llenar Trama sin plan.

Skills clave:

- Nota Cortante;
- Copla Pegadiza;
- Himno de la Primera Chapa;
- Sostener Compás;
- Canto de Resonancia.

### Capa 2: niveles 6–10

Objetivo:

- activar Armonía de Ridículo;
- usar Balada de Remiendo;
- usar Pulso;
- aprender Cambiar el Hilo.

### Capa 3: niveles 11–19

Objetivo:

- aprender Coda Inoportuna;
- usar Verso de Fennel;
- convertir acciones notables en Aplauso;
- preparar especialización.

---

## 24. Resumen rápido

El Bardo tiene cuatro ideas clave:

1. **Voz**: tu energía.
2. **Estrofa**: tu ritmo.
3. **Aplauso**: la escena reconociendo algo memorable.
4. **Trama**: los efectos que mantienes activos.

Tu ciclo básico:

```text
Preparar → Trenzar → Sostener → Activar Armonía → Rematar o Proteger
```

Si no sabes qué hacer, usa:

```text
pulso (o p)
```

Si quieres aprender de verdad, mira por qué el Pulso te recomienda algo y prueba variaciones manuales.

Y recuerda:

> Un Bardo no pregunta “qué botón hace más daño”. Pregunta “qué necesita esta escena para acabar a nuestro favor”.
