# Mejores Prácticas de Diseño MUD

Este documento recopila las mejores prácticas estándar de la industria (basado en Reddit, Grimwheel, Gammon y MUDPortal) para el diseño de habitaciones y textos en InheronMUD.

## 1. Muestra, No Cuentes (Show, Don't Tell)
Concéntrate en detalles concretos y sensoriales en lugar de emociones abstractas o juicios de valor. 
- *Evitar*: "Sientes mucho miedo al entrar."
- *Preferir*: "Un escalofrío húmedo asciende por las paredes de piedra desnuda y el eco constante de goteos distorsiona el sentido de la orientación."

## 2. Involucra Múltiples Sentidos
No te limites a la vista. Incluye sonidos, olores y texturas para crear inmersión.
- **Olfato**: ozono, pan recién horneado, tierra húmeda, decadencia.
- **Oído**: susurros ahogados, crujidos de madera, el crepitar del fuego.
- **Tacto**: corrientes de aire helado, humedad pegajosa, polvo espeso.

## 3. Voz Activa
Usa la voz activa para que el entorno se sienta vivo y presente.
- *Evitar*: "La sala está llena de libros viejos."
- *Preferir*: "Tomos polvorientos abarrotan cada estantería e invaden el suelo de madera."

## 4. Respeta la Agencia del Jugador
NUNCA dictes lo que siente o piensa el personaje, ni asumas sus acciones. 
- **Regla de oro**: Evita usar la palabra "tú" o "sientes" en las descripciones estáticas. Describe el espacio, deja que el jugador reaccione a él.

## 5. Sé Conciso (3-5 frases)
Los jugadores leen estas descripciones docenas de veces. Una prosa excelente pero excesivamente larga se vuelve tediosa. Ve al grano, establece la atmósfera y muestra las salidas.

## 6. Excluye Entidades Transitorias
Las descripciones estáticas de la habitación (`Room.description`) no deben mencionar entidades que pueden moverse o morir (NPCs, mobs o ítems que se recogen).
- *Evitar*: "Un guardia vigila la puerta." (¿Qué pasa si el jugador mata al guardia? La descripción dejará de tener sentido).
- *Preferir*: "Una caseta de vigilancia flanquea la robusta puerta de hierro." (El NPC guardia se mostrará en la lista dinámica de habitantes).

## 7. Accesibilidad y Navegación
- Las salidas deben estar listadas en una línea separada al final de la descripción. (Ya manejado por el cliente).
- No dependas exclusivamente del color para transmitir información crítica.

## Checklist del Arquitecto (ZoneMaster/ContentSmith)
Antes de enviar una sala, verifica:
- [ ] ¿La prosa está en voz activa?
- [ ] ¿Evité la palabra "tú" o "sientes"?
- [ ] ¿Involucré al menos dos sentidos (vista + oído/olfato)?
- [ ] ¿Es concisa (máx. 5 frases)?
- [ ] ¿Me aseguré de NO mencionar NPCs o monstruos móviles en el texto base?
