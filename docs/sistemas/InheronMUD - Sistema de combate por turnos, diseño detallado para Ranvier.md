# INHERONMUD — SISTEMA DE COMBATE POR TURNOS
## Diseño detallado para implementación en Ranvier

Documento de diseño mecánico. Objetivo: definir un sistema de combate por turnos para InheronMUD que sea táctico, legible, equilibrado, divertido y profundamente conectado con el tono de Eryndor: fantasía isekai luminosa, gremios, rangos, skills con personalidad, estados memorables, reliquias caprichosas, monstruos absurdamente peligrosos y decisiones tácticas que no se reduzcan a “atacar hasta que algo deje de moverse”.

Stack previsto: Ranvier / Node.js.
Modelo general: MUD textual con combate por turnos/semiturnos, comandos explícitos, cola de acciones, estados, recursos por clase, IA de enemigos y logs narrativos ricos.

## 1. Principios de diseño

### 1.1 Combate táctico pero no lento
El combate debe tener decisiones reales, pero no atascar el ritmo del MUD. Cada turno debe ofrecer opciones claras: atacar, usar skill, defender, moverse, usar objeto, interactuar con entorno, ayudar, huir o preparar acción.

Regla guía:
Una pelea normal de bajo nivel debería durar entre 3 y 6 rondas. Un elite, entre 6 y 10. Un boss, entre 10 y 16, con fases, avisos y mecánicas.

### 1.2 Legibilidad antes que complejidad oculta
El jugador debe entender por qué ganó o perdió. Los logs deben explicar:
- Qué acción usó cada criatura.
- Qué recurso gastó.
- Qué estado aplicó.
- Qué defensa redujo el daño.
- Qué señal avisaba de un ataque fuerte.
- Qué opción táctica podía haber ayudado.

Ejemplo de log útil:
“El Conejo Acorazado Coronel rasca el suelo y baja la cabeza. Sus placas vibran. Parece que cargará en la próxima ronda”.

Esto permite que el jugador aprenda. Si muere, debe pensar “debí defender o apartarme”, no “el sistema me ha mordido desde una caja negra”.

### 1.3 Identidad de clase fuerte desde nivel 1
Cada clase debe sentirse distinta desde sus primeras skills. El Caballero protege, el Monje fluye, el Cocinero prepara, el Cartógrafo revela, el Bardo fija memoria, el Clérigo sostiene, el Duelista responde, el Inspector controla, el Invocado improvisa.

### 1.4 Humor diegético, mecánica seria
Los nombres pueden ser divertidos, pero el sistema debe ser sólido. “Sartén Meteórica” puede hacer gracia; sus números deben estar balanceados. “Mapa que Insulta” puede tener sabor, pero debe aportar utilidad táctica real.

### 1.5 La memoria y los nombres como mecánica
InheronMUD tiene un eje narrativo: memoria, nombres, registros, Canon del Mediodía. El combate debe reflejarlo con estados como Marcado, Nombre Anclado, Olvido Menor, Juramento Falso, Crónica Viva o Borrón de Nombre.

### 1.6 Roles cooperativos sin obligar a party perfecta
Debe poder jugarse solo, pero las parties deben ser más ricas. Ninguna clase debe ser inútil fuera de su nicho. Un Bardo no debe “solo bufar”; un Clérigo no debe “solo curar”; un tanque debe poder hacer daño razonable.

## 2. Estructura general del combate

### 2.1 Combate por rondas con iniciativa dinámica
El combate se divide en rondas. Cada ronda representa unos segundos de acción narrativa. En cada ronda, participantes actúan en orden de iniciativa.

Iniciativa inicial:
Iniciativa = Destreza + Percepción + modificador de arma/armadura + tirada ligera + estados.

Para evitar aleatoriedad excesiva:
- La tirada debe ser pequeña.
- Las builds ágiles deben actuar consistentemente antes.
- Algunos enemigos pueden tener “acciones anunciadas” que ocurren al final de ronda.

Propuesta numérica:
Iniciativa base = Destreza + Percepción.
Tirada = 1d10.
Armadura pesada: -2 a -5.
Armas ligeras: +1.
Sorpresa: +5 en la primera ronda.
Estado Ralentizado: -5.
Estado Inspirado: +3.

### 2.2 Turno básico de participante
En su turno, un personaje puede realizar:
- 1 Acción principal.
- 1 Acción menor.
- 1 Reacción por ronda, si tiene una condición que la active.
- Movimiento dentro de su zona, si el combate usa posiciones abstractas.

Acción principal:
Atacar, usar skill importante, lanzar conjuro, usar objeto potente, ayudar a aliado caído, interactuar con mecanismo, intentar huir.

Acción menor:
Cambiar postura, beber consumible menor, moverse entre posiciones cercanas, marcar objetivo, sacar objeto, usar habilidad rápida.

Reacción:
Bloquear, contraatacar, proteger, interrumpir, esquivar, usar Contraestrofa, activar Escudo Interpuesto, etc.

### 2.3 Posicionamiento abstracto recomendado
Ranvier es textual. No conviene simular una cuadrícula completa al inicio. Propongo un sistema de zonas abstractas dentro de la sala de combate.

Posiciones:
- Vanguardia: cuerpo a cuerpo, recibe más ataques, puede proteger.
- Retaguardia: casters, bardos, arqueros, más segura contra melee simple.
- Flanco: posición táctica para duelistas, cartógrafos y enemigos ágiles.
- Elevación/Cobertura: si la sala lo permite.
- Enzarzado: cuando un enemigo se pega a un personaje concreto.

Ejemplo:
“Estás en la retaguardia. Tilo ocupa la vanguardia. El Conejo Acorazado Veterano está enzarzado con Tilo. Dos Hadas de Harina revolotean en flanco”.

Comandos posibles:
- mover vanguardia
- mover retaguardia
- mover flanco conejo
- cubrir lúa
- interceptar slime

Reglas simples:
- Las armas cuerpo a cuerpo atacan mejor a enemigos en vanguardia o enzarzados.
- Las armas a distancia y conjuros pueden atacar desde retaguardia.
- Algunos ataques de área afectan una posición completa.
- Defender en vanguardia puede proteger retaguardia.
- Enemigos rápidos pueden saltar a retaguardia si no están controlados.

### 2.4 Combate solo vs combate en grupo
En solitario, el jugador ocupa una posición principal y puede usar seguidores/mascotas en el futuro.
En party, cada jugador declara acciones cuando llega su turno, con posible temporizador para evitar bloqueo.

Temporizador recomendado para combates multijugador:
- 45-60 segundos por turno en contenido normal.
- Si no actúa: acción por defecto configurada, normalmente atacar o defender.
- En boss: 90 segundos opcionales.

Comandos de calidad de vida:
- auto atacar
- auto defender bajo 30%
- repetir última habilidad
- objetivo principal [enemigo]
- focus [enemigo]
- proteger [aliado]

## 3. Atributos principales

El sistema debe usar atributos claros, con nombres fantásticos pero comprensibles.

### 3.1 Atributos base
Fuerza:
Daño físico, carga, armas pesadas, romper guardias, empujar.

Destreza:
Precisión con armas ligeras, evasión, iniciativa, críticos, movilidad.

Constitución:
Vida, resistencia a venenos, sangrado, cansancio, aguante.

Ingenio:
Trampas, mapas, improvisación, crafting, habilidades técnicas, Invocado, Inspector, Cartógrafo.

Sabiduría:
Sanación, percepción espiritual, resistencia mental, magia de Alba/Raíz/Sombra controlada.

Presencia:
Buffs, bardos, juramentos, amenaza, liderazgo, social en combate, resistencia al miedo.

Percepción:
Detección, iniciativa, precisión a distancia, trampas, enemigos ocultos.

### 3.2 Estadísticas derivadas
Vida máxima:
Base por clase + Constitución x factor + nivel.

Energía:
Recurso físico general para ataques especiales, maniobras, defensa activa.

Maná / Devoción / Voz / Disciplina / Juramento / Tinta Viva / Resonancia:
Recursos específicos por clase.

Ataque físico:
Arma + Fuerza o Destreza según arma + nivel + competencia.

Ataque mágico:
Foco + Sabiduría/Ingenio/Presencia según clase + nivel + competencia.

Defensa física:
Armadura + Constitución + escudo + postura.

Defensa mágica:
Sabiduría + equipo + resistencias + estados.

Evasión:
Destreza + Percepción + peso de armadura.

Precisión:
Atributo relevante + competencia + modificadores.

Crítico:
Base 5%, sube con Destreza, armas ligeras, estados o ventajas. Tope recomendado bajo al inicio: 20-25%.

Amenaza:
Valor usado por IA para elegir objetivos. Suben acciones de daño, curación, provocación, protección, debuffs potentes.

Moral:
Recurso grupal o estado contextual. Afecta resistencia a miedo, habilidades de Bardo, eventos de historia y algunas recompensas.

Nombre:
Valor narrativo-mecánico relacionado con identidad. No es una stat visible normal, pero puede tener “anclaje de nombre” como resistencia a borrado, miedo, confusión o Canon.

## 4. Recursos de clase

### 4.1 Energía general
Todos tienen Energía. Se usa para maniobras físicas, defender activamente, huir, cargar, esquivar, empujar.

Recuperación:
- +X por ronda de forma pasiva.
- +extra al Defender.
- +extra mediante comida, Bardo, descanso o skills.

Evitar spam:
Las skills de coste alto deben dejar al jugador expuesto si gasta sin pensar.

### 4.2 Juramento — Caballero del Alba
Se genera al proteger, recibir golpes en vanguardia, provocar enemigos o cumplir condiciones de voto.
Se gasta en defensas, intercepciones y ataques de castigo.

Sensación deseada:
Cuanto más cumple su papel de protector, más fuerte se vuelve.

### 4.3 Disciplina — Monje de Candaluz
Se genera al esquivar, encadenar técnicas distintas, mantener calma, no abusar de consumibles ofensivos.
Se gasta en combos, curaciones menores, interrupciones y movilidad.

Sensación:
Flujo, ritmo, precisión. El monje premia variar técnicas.

### 4.4 Ingredientes y Calor — Cocinero de Mazmorra
Ingredientes son cargas obtenidas de loot o preparación.
Calor sube al usar habilidades culinarias en combate.
Calor alto potencia habilidades, pero si se descontrola puede provocar “Quemado”, “Sartén Sobrecalentada” o resultados caóticos.

Sensación:
Preparación, oportunidad, recompensa por conocer monstruos y llevar despensa.

### 4.5 Tinta Viva — Cartógrafo Vivo
Se genera explorando, marcando rutas, detectando trampas, estudiando enemigos.
Se gasta en mapas tácticos, marcas, rutas seguras y revelaciones.

Sensación:
El combate se gana antes y durante, leyendo la sala.

### 4.6 Resonancia — Invocado Desubicado
Se genera al usar soluciones creativas, recibir efectos extraños, interactuar con tecnología/magia incompatible o estar en peligro.
Se gasta en skills resonantes, improvisación y protección contra memoria alterada.

Sensación:
“Esto no debería funcionar, pero funciona porque mi lógica viene de otro mundo”.

### 4.7 Devoción — Clérigo del Sol Quieto
Se genera sanando, protegiendo, revelando falsedades o actuando según doctrina.
Se gasta en curaciones, sellos, luz y protecciones de nombre.

Sensación:
La luz verdadera cuida antes de castigar.

### 4.8 Estilo — Duelista de Academia
Se genera con fintas, duelos, contraataques, saludos formales, cambios de postura y golpes precisos.
Se gasta en remates, counters, movilidad y ataques con nombre excesivo.

Sensación:
Elegancia táctica. Si parece un torneo, mejor.

### 4.9 Sellos — Inspector de Mazmorras
Se generan identificando amenazas, inspeccionando salas, preparando protocolos.
Se gastan para controlar terreno, reducir daño, bloquear peligros y explotar debilidades reglamentarias.

Sensación:
Convertir burocracia en arma táctica. El monstruo no entiende el formulario, pero lo sufre.

### 4.10 Voz, Aplauso y Estrofa — Bardo de Crónica Viva
Voz: recurso principal, se recupera por ronda y descanso.
Aplauso: se genera cuando aliados hacen acciones notables, enemigos fallan por debuffs del bardo o el grupo completa objetivos.
Estrofa: contador de canción encadenada. Al usar canciones distintas, sube. Al repetir demasiado, baja.

Sensación:
El bardo no spamea una canción; compone una escena.

## 5. Resolución de acciones

### 5.1 Fórmula simple recomendada
Para implementar rápido en Ranvier, usar una resolución híbrida con precisión, defensa y variación ligera.

Probabilidad de impacto:
Base 75% + precisión atacante - evasión/defensa objetivo + modificadores.

Límites:
Mínimo 10%.
Máximo 95%.

Crítico:
Si impacta, tirada separada de crítico.
Crítico = daño x 1.5 al inicio. Algunas clases alteran esto.

Bloqueo:
Reduce daño antes de aplicarlo. Escudos y defensas activas aumentan bloqueo.

Resistencias:
Reducen daño por tipo: físico, luz, fuego, frío, sombra, marea, raíz, veneno, sónico, mental.

### 5.2 Ventaja y desventaja ligera
Evitar sistemas excesivamente pesados. Propongo estados de ventaja simples:

Ventaja menor:
+10% precisión o +10% efecto.

Ventaja mayor:
+20% precisión o +20% efecto.

Desventaja menor:
-10% precisión.

Desventaja mayor:
-20% precisión.

Ejemplos:
- Atacar a enemigo Marcado por Cartógrafo: ventaja menor.
- Atacar desde flanco a enemigo Enzarzado: ventaja menor.
- Atacar cegado: desventaja mayor.
- Usar fuego contra slime de mermelada: ventaja de daño o efecto especial.

### 5.3 Daño y mitigación
Daño bruto = daño habilidad + atributo + arma + escalado por nivel.
Daño final = daño bruto - mitigación plana - porcentaje resistencia.

Recomendación:
No abusar de mitigación plana alta, porque hace inútil el daño bajo. Mejor combinar armadura moderada con resistencias.

Ejemplo:
Golpe del Alba nivel 3:
Daño = arma + Fuerza x 0.8 + 4.
Contra sombra/no-muerto: +2 luz.

### 5.4 Estados con tirada de resistencia
Algunos efectos aplican automáticamente si impactan. Otros requieren tirada.

Resistencia física:
Constitución + nivel + equipo.

Resistencia mental:
Sabiduría + Presencia + Nombre Anclado.

Resistencia mágica:
Sabiduría + equipo + afinidad.

Resistencia técnica:
Ingenio + Percepción.

Ejemplo:
Hada de Harina usa Nube Cegadora.
Tirada: ataque mágico vs resistencia física/Percepción.
Si falla defensa: Cegado 1 ronda.
Si resiste: Desventaja menor solo hasta fin de turno.

## 6. Tipos de daño

Físico:
Corte, perforación, contundente. Base de armas.

Luz / Alba:
Eficaz contra Sombra, no-muertos, juramentos falsos, reflejos oscuros. Puede revelar.

Fuego / Brasa:
Daño alto, quemaduras, útil contra plantas y masas, peligroso en panaderías. Doña Marga lo sabe.

Frío:
Control, ralentización, defensa. Asociado a Hieloeterno.

Raíz:
Naturaleza, ataduras, venenos, regeneración, sueño vegetal.

Marea:
Agua, reflejo, movimiento, cambios de posición, limpieza.

Sombra:
Daño mental/identidad, miedo, olvido, drenaje. No siempre maligno, pero delicado.

Sónico / Voz:
Bardos, campanas, topos campaneros, control de concentración.

Veneno:
Daño en el tiempo, debilitación.

Mental:
Miedo, confusión, culpa falsa, fascinación.

Memoria / Nombre:
Tipo especial. Afecta identidad, registros, protección contra Canon, recuerdos y ciertos bosses. Usarlo con cuidado para no frustrar.

## 7. Estados principales

Los estados deben ser memorables, con nombre claro y efecto jugable. Recomendación: mostrar duración y explicación breve.

Formato UI/texto:
Estados: Inspirado (2r), Cegado (1r), Pegajoso (2r), Nombre Anclado (escena), Quemado (3r).

### 7.1 Estados físicos
Sangrado:
Daño físico al final de ronda. Curable con vendaje, magia o descanso.

Quemado:
Daño de fuego por ronda. Puede causar Pánico menor en bestias.

Congelado:
Pierde acción menor o queda Ralentizado. Congelado completo debe ser raro.

Ralentizado:
Menos iniciativa y movimiento.

Derribado:
Pierde acción menor para levantarse. Recibe desventaja defensiva contra melee.

Aturdido:
Pierde acción principal. Debe ser muy limitado para no romper combates.

Pegajoso:
Menos evasión y movimiento. Común en slimes y masas.

Envenenado:
Daño o penalización por ronda. Diferentes venenos.

Cansado:
Reduce recuperación de Energía.

### 7.2 Estados mentales/sociales
Inspirado:
Aumenta moral, iniciativa o precisión. Bardos y líderes.

Asustado:
Menos precisión y resistencia. Puede impedir avanzar.

Confundido:
Probabilidad de perder acción menor o elegir mal objetivo. No debe ser demasiado frecuente.

Fascinado:
No actúa salvo si recibe daño o se rompe concentración. Útil contra humanoides, no bosses completos.

Culpa Prestada:
Estado de la Cámara. Reduce Presencia y resistencia mental; puede causar fallos en juramentos.

Burlado:
Provocado por Bardo o Duelista. Reduce precisión contra objetivos que no sean quien burla.

### 7.3 Estados tácticos
Marcado:
Aliados ganan precisión contra objetivo. Cartógrafo/Inspector.

Provocado:
Objetivo prioriza al provocador.

Guardia Alta:
Más defensa, menos daño.

Guardia Rota:
Menos defensa hasta fin de ronda.

Expuesto:
Recibe más daño del siguiente ataque.

Cubierto:
Recibe reducción de daño desde retaguardia o cobertura.

Enzarzado:
Está trabado con un enemigo; moverse requiere acción o tirada.

Preparando:
El enemigo o jugador carga habilidad fuerte. Puede interrumpirse.

### 7.4 Estados de memoria y nombre
Nombre Anclado:
Resistencia contra miedo, confusión, olvido y Canon. Bardos, Clérigos y quests.

Olvido Menor:
Pierde acceso temporal a una habilidad general o reduce Presencia/Ingenio. Debe durar poco.

Borrón de Nombre:
Estado peligroso de enemigos de la Cámara. Si se acumula, reduce reputación temporal en escena o impide recibir buffs de aliado. Nunca debe borrar progreso permanente sin evento narrativo pactado por diseño.

Juramento Falso:
El objetivo cree tener una obligación impuesta. Puede forzar comportamiento si no se resiste. Usar con enemigos/NPCs; en jugadores, como debuff suave, no control total.

Crónica Viva:
Estado positivo grupal. Las acciones heroicas generan Aplauso/Moral extra y resisten Borrón.

Recuerdo Despierto:
Buff o debuff temporal tras interactuar con reliquia, comida de memoria, pozo o espejo. Efectos variables.

## 8. Acciones generales disponibles para todos

### Atacar
Ataque básico con arma equipada. Bajo coste, fiable, genera recurso en algunas clases.

### Defender
Gasta o recupera según clase. Aumenta defensa hasta siguiente turno. Puede reducir daño a aliados si estás en vanguardia.

### Ayudar
Da ventaja menor a aliado en su próxima acción o ayuda a levantarse/estabilizar.

### Usar objeto
Consumibles, herramientas, bombas, comida, pergaminos. Algunos objetos requieren acción principal; otros acción menor.

### Moverse
Cambiar posición abstracta: vanguardia, retaguardia, flanco, cobertura.

### Interactuar con entorno
Cerrar puerta, tirar barril, activar campana, apagar fuego, romper cristal, mover mesa, leer inscripción.

### Preparar acción
Declara condición:
- “Si el conejo carga, esquivo”.
- “Si el escriba conjura, interrumpo”.

### Huir
Tirada o acción prolongada. Más fácil si alguien cubre retirada.

### Improvisar
Acción abierta con resolución por atributo. Muy importante para tono isekai.
Ejemplos:
- Tirar harina a una Hada de Harina para confundirla.
- Usar una campanilla contra un Topo Campanero.
- Lanzar pan duro a un slime para atraerlo.

El sistema debe admitir improvisaciones mediante comando genérico:
- improvisar [descripción]
Inicialmente puede ser manejado por scripts para casos predefinidos y fallback narrativo.

## 9. Diseño de skills

### 9.1 Categorías de skills
Ataque:
Daño directo.

Soporte:
Buff, curación, protección.

Control:
Estados, movimiento, interrupciones.

Táctica:
Marcas, análisis, preparación, terreno.

Reacción:
Se activa fuera del turno.

Pasiva:
Siempre activa o condicional.

Ritual / Preparación:
Fuera de combate o con carga.

### 9.2 Costes y enfriamientos
Para evitar spam, usar combinación de:
- Coste de recurso.
- Cooldown en rondas.
- Requisito de estado.
- Posición necesaria.
- Límite por descanso.

Ejemplo:
Sartén Meteórica:
Coste: 4 Energía + 2 Calor.
Cooldown: 3 rondas.
Efecto: daño contundente alto + Derribado si falla resistencia física.
Bonus: si objetivo es limo/masa, aplica Expuesto.

### 9.3 Skills con “telegrafía”
Los enemigos y bosses deben avisar habilidades fuertes. Los jugadores también pueden tener habilidades de preparación.

Ejemplo enemigo:
“El Gallo de Tres Auroras hincha el pecho. Tres luces se encienden en su cresta”.
Siguiente ronda: Canto Triple.
Opciones: interrumpir, cubrir o usar Silencio de Candaluz.

### 9.4 Sinergias entre clases
El combate debe premiar combinación.

Ejemplos:
- Cartógrafo marca a un enemigo, Duelista usa Final de Torneo con ventaja.
- Cocinero da Croqueta de Maná, Clérigo lanza Mediodía Compasivo antes de tiempo.
- Bardo usa Canción de Nombre Propio, grupo resiste Borrón de Nombre.
- Inspector declara Zona Heroicamente Insegura, Caballero mantiene vanguardia.
- Monje interrumpe conjuro, Invocado copia técnica debilitada.

## 10. Amenaza e IA enemiga

### 10.1 Sistema de amenaza
Cada acción genera amenaza.

Ataque básico: +daño moderado.
Curación: +valor curado x 0.8.
Provocar: +amenaza fija alta.
Buff grupal fuerte: +amenaza media.
Debuff/control: +amenaza alta contra enemigos inteligentes.
Defender: +amenaza baja.
Huir/esconderse: reduce amenaza.

Los enemigos simples atacan mayor amenaza o objetivo más cercano.
Los inteligentes priorizan sanadores, bardos, objetivos vulnerables o quien interrumpe.
Los fanáticos pueden ignorar lógica y atacar forasteros/sombríos.
Los animales pueden atacar comida, fuego, ruido o al último que les hizo daño.

### 10.2 Personalidades de IA
Bestia territorial:
Defiende zona, carga, huye si baja vida.
Ejemplo: conejo acorazado.

Limo oportunista:
Busca objetivos pegajosos, divide, huye si está en desventaja.

Feérico travieso:
Debuffs, movilidad, objetivos aleatorios, negociación posible.

Humanoide táctico:
Usa formación, protege líder, huye o se rinde.

Fanático solar:
Prioriza sombríos, invocados, bardos o clérigos rivales. Usa juramentos falsos.

Constructo antiguo:
Patrones claros, telegrafía fuerte, vulnerable a sellos o comandos.

Agente de la Cámara:
Debuffs de memoria, falsos contratos, foco en borrar nombre o aislar soporte.

Boss:
Fases, adds, entorno, objetivos no solo de daño.

### 10.3 Moral enemiga
No todos luchan hasta morir.

Moral baja provoca:
- Rendición.
- Huida.
- Negociación.
- Error táctico.
- Llamar refuerzos.

Bardos, Caballeros, Duelistas y ciertas acciones sociales pueden afectar moral.

Ejemplo:
Bandido de la Media Sonrisa puede rendirse si pierde líder y recibe Amenazar con Educación.

## 11. Dificultad y balance

### 11.1 Tipos de encuentro
Trivial:
Para ambientación o farmeo. No debe gastar muchos recursos.

Normal:
Amenaza moderada. Requiere usar 1-2 habilidades.

Difícil:
Puede derrotar a jugador descuidado. Requiere defender, controlar o usar consumibles.

Elite:
Una criatura fuerte con mecánica. Requiere entender patrón.

Boss:
Varias fases, entorno, estados, adds o objetivos especiales.

Evento:
Condiciones narrativas: proteger NPC, aguantar rondas, cerrar puerta, cantar crónica, salvar panadería.

### 11.2 Curva de daño por nivel
Para niveles 1-20:
- El jugador debe sobrevivir 4-6 golpes normales de enemigo equivalente.
- Un elite puede bajar 30-40% vida con ataque anunciado si no se defiende.
- Un boss puede castigar fuerte, pero con señales claras.

Recomendación:
Evitar one-shots salvo por mecánica muy avisada y contenido opcional.

### 11.3 Recursos y descanso
En un MUD, la recuperación no debe ser tediosa.

Descanso corto:
En posada, campamento o zona segura. Recupera parte de vida/energía/recursos.

Descanso largo:
Posada o santuario. Recupera completo, limpia estados normales.

Comida:
Buffs temporales, recuperación parcial.

Riesgo:
Descansar en dungeon puede activar eventos, emboscadas o pérdida de tiempo.

### 11.4 Economía de consumibles
Los consumibles deben ayudar, no reemplazar clases.

Poción menor:
Cura poco, acción menor o principal según balance.

Comida:
Más eficiente fuera de combate o como preparación.

Recetas de Cocinero:
Mejores y con identidad, pero requieren ingredientes.

Agua clara de capilla:
Limpia estados leves.

Tiza cívica:
Reduce riesgo de perderse o repetir trampas.

## 12. Sistema de estados por acumulación

Para algunos estados conviene usar acumulaciones.

Quemado: acumulación hasta 3, aumenta daño.
Pegajoso: acumulación hasta 3, a 3 aplica Enredado.
Borrón de Nombre: acumulación hasta 5, efectos por umbral.
Inspirado: acumulación hasta 3, mejora buffs.
Marcado: normalmente no acumula, pero puede mejorar con Cartógrafo.

Ejemplo Borrón de Nombre:
1: leve zumbido, -1 Presencia.
2: algunos NPCs dudan, -resistencia mental.
3: no puede recibir ciertos buffs de nombre.
4: riesgo de perder acción menor por desorientación.
5: evento narrativo de crisis; requiere Bardo/Clérigo/quest para limpiar. No permanente sin diseño.

## 13. Entorno como parte del combate

Las salas deben tener rasgos.

Ejemplos de rasgos de sala:
- Harina en suspensión: fuego causa explosión menor.
- Suelo pegajoso: movimiento cuesta acción menor.
- Campana agrietada: puede tocarse para daño sónico a enemigos sensibles.
- Luz de mediodía: potencia Alba, debilita Sombra, pero fortalece Cámara.
- Espejos rotos: riesgo de reflejos, mejora ilusiones.
- Agua del pozo: revela ocultos, pero puede aplicar Recuerdo Despierto.
- Barriles de mermelada: atraen slimes.
- Mesa robusta: cobertura.

Comando recomendado:
- mirar combate
Debe mostrar enemigos, aliados, posiciones, estados y elementos interactivos.

Ejemplo:
Entorno: sacos de harina, horno encendido, mesa volcada, campanilla de mostrador.
Pistas: el slime de mermelada parece atraído por el horno. La harina flota en el aire.

## 14. Combate y narrativa de nombres

### 14.1 Nombre como ancla
El “nombre” del personaje no es solo etiqueta. En Eryndor, ser recordado protege contra ciertos efectos.

Fuentes de protección:
- Canción de Bardo.
- Bendición de Clérigo.
- Registro del Gremio.
- Reputación local.
- Juramento de Caballero.
- Diario de Aventuras.
- Vínculos con NPCs.

### 14.2 Efectos de enemigos de la Cámara
Los enemigos de la Cámara no solo dañan vida. Atacan identidad táctica.

Habilidades ejemplo:
Borrón de Pluma:
Aplica Borrón de Nombre 1 y reduce Presencia.

Acta Falsa:
Marca a un aliado como “intruso”; algunos summons o NPCs no lo ayudan durante 1 ronda.

Sello del Mediodía:
Impide ocultación y fuerza luz vertical; aumenta daño Alba rígida pero reduce curación compasiva.

Culpa Prestada:
Reduce daño del objetivo si ataca a un enemigo “aparentemente inocente”.

Canon Menor:
Durante 1 ronda, impone una regla: “nadie puede curar”, “todos deben atacar al objetivo marcado”, etc. Debe estar telegrafiado y ser resistible/interrumpible.

### 14.3 Contra-juego
Bardo:
Canción de Nombre Propio, Gran Crónica del Alba.

Clérigo:
Sello de Verdad, Romper Falso Juramento.

Inspector:
Auditoría de Trampa, Formulario 13-B contra agentes legalistas.

Invocado:
Memoria de Pantalla Azul, Despertar Desubicado.

Cartógrafo:
Brújula Emocional, marcas de tinta sobre registros falsos.

Caballero:
Juramento verdadero que sobrescribe imposiciones.

Monje:
Silencio de Candaluz corta liturgias.

Duelista:
Duelo Fijado fuerza al agente a pelear sin trucos de área.

## 15. Ejemplos de enemigos iniciales

### Conejo Acorazado Joven
Nivel: 2.
Tipo: bestia.
Rol: melee simple.
Vida: baja-media.
Ataques:
- Embestida pequeña: daño físico.
- Patada de resorte: baja precisión, daño alto.
Estados:
- Asustadizo: si recibe fuego, puede huir.
Loot: placa córnea, zanahoria mordida.
Táctica: enseña defender y leer cargas.

### Hada de Harina
Nivel: 3.
Tipo: feérico.
Rol: evasión/debuff.
Ataques:
- Nube Cegadora: Cegado 1r.
- Estornudo Arcano: daño menor de Marea/Alba.
Debilidad: viento, agua, risa feérica, cerrar saco de harina.
Táctica: enseña precisión, estados y entorno.

### Slime de Mermelada
Nivel: 2-4.
Tipo: limo.
Rol: pegajoso.
Ataques:
- Pegote Dulce: Pegajoso.
- Abrazo Viscoso: daño bajo + Enzarzado.
Debilidad: frío, sal, pan duro como señuelo.
Loot: gel frutal.
Táctica: enseña control de movimiento.

### Bandido de la Media Sonrisa
Nivel: 5.
Tipo: humanoide.
Rol: táctico social.
Ataques:
- Puñalada baja.
- Arena a los ojos: Cegado menor.
- Rendición falsa: si se acepta sin Percepción, contraataque.
Moral: puede rendirse de verdad.
Táctica: enseña que no todo combate acaba en muerte.

### Escriba sin Rostro
Nivel: 12-18 según arco.
Tipo: humanoide/Cámara.
Rol: debuff memoria.
Ataques:
- Tajo de Pluma: daño físico ligero + Borrón.
- Acta Falsa: aplica Juramento Falso o Expuesto social.
- Sello Blanco: reduce buffs de grupo.
Telegrafía: saca folio que no proyecta sombra.
Contra: Bardo/Clérigo/Inspector.

## 16. Diseño de bosses iniciales

### Boss 1: Masa Madre Menor
Zona: Sótano de Masa Viva.
Nivel: 6-8.
Fases: 2.

Fase 1:
- Golpe de masa: daño contundente.
- Pegote fermentado: Pegajoso.
- Absorber migas: se cura si hay restos en sala.

Mecánica:
El jugador puede usar sacos de harina para distraerla o apagar horno para evitar crecimiento.

Fase 2:
Al 40% vida se divide en dos masas pequeñas.
Si no se derrotan rápido, se recombinan.

Recompensa:
Levadura viva, acceso a nivel inferior, receta.

### Boss 2: Conejo Acorazado Coronel
Zona: Campo Norte.
Nivel: 10-12 opcional.
Fases: 3.

Fase 1:
Carga Imperial telegrafiada.
Mordisco de mando.

Fase 2:
Llama conejos jóvenes.
Gana Guardia Alta.

Fase 3:
Patada Meteórica. Muy anunciada.
Debe defenderse, esquivarse o interrumpirse con terreno.

Humor visual:
Lleva casco natural con forma de yelmo. Nadie se ríe dos veces.

### Boss 3: Guardián del Pozo Cantante
Zona: Cámara del Pozo.
Nivel: 18-20.
Tipo: constructo solar antiguo.
Fases: 3.

Fase 1: Prueba de nombre.
Ataques de luz, notas vinculantes.
Requiere decir/afirmar nombre o tener registro.

Fase 2: Prueba de memoria.
Invoca recuerdos como adds: conejo, hada, sombra de Otilia, eco de Seralyne niña.

Fase 3: Prueba de elección.
El Guardián no quiere matar, quiere saber si el grupo protegerá el pueblo, la gota o su propia gloria.
Puede resolverse por combate, Bardo, Clérigo, Invocado o reputación local.

Recompensa:
Protección de Nombre Propio, acceso a mapa del Canon, reputación masiva.

## 17. Comandos de combate propuestos

Básicos:
- atacar [objetivo]
- skill [nombre] [objetivo]
- usar [objeto] [objetivo]
- defender
- ayudar [aliado]
- mover [posición]
- huir
- mirar combate
- estados
- objetivos

Tácticos:
- preparar [acción] si [condición]
- proteger [aliado]
- marcar [objetivo]
- interrumpir [objetivo]
- cubrir retirada
- improvisar [descripción]

Grupo:
- focus [objetivo]
- formar vanguardia
- formar retaguardia
- reagrupar
- asistir [aliado]

Calidad de vida:
- repetir
- autoataque on/off
- autodefensa [porcentaje]
- describir skill [nombre]
- cooldowns
- recursos

Ejemplo de salida de mirar combate:
Combate en Sótano de Masa Viva.
Aliados:
- Jorge, retaguardia, Vida 32/40, Energía 7/10, estados: Inspirado (2r).
- Tilo, vanguardia, Vida 55/60, Juramento 3, estados: Guardia Alta.
Enemigos:
- Masa Madre Menor, vanguardia, Vida 70%, estados: Marcada, Pegajosa.
- Slime de Mermelada, flanco, Vida 30%, preparando Pegote Dulce.
Entorno:
- Horno encendido.
- Saco de harina roto.
- Mesa volcada usable como cobertura.
Pista:
La Masa Madre parece absorber migas del suelo.

## 18. Implementación en Ranvier

### 18.1 Estructura sugerida de bundles
Crear un bundle principal:
- inheron-combat

Subcarpetas sugeridas:
- commands/combat/
- effects/
- skills/
- resources/
- behaviors/
- combatants/
- scripts/encounters/
- data/states.yml
- data/damage-types.yml
- data/classes.yml
- data/skills.yml
- data/enemies.yml

### 18.2 Entidades principales
CombatManager:
Controla encuentros, rondas, iniciativa, cola de turnos, finalización.

Combatant:
Wrapper para Player/NPC con stats de combate, recursos, estados y posición.

TurnQueue:
Orden de iniciativa, retrasos, acciones preparadas.

ActionResolver:
Resuelve impacto, daño, críticos, estados, resistencias.

StateManager:
Aplica, actualiza y expira estados.

ResourceManager:
Gestiona Energía y recursos de clase.

ThreatManager:
Registra amenaza por enemigo.

AIBehavior:
Decide acción NPC según personalidad.

CombatLogFormatter:
Convierte resultados mecánicos en texto con sabor Inheron.

EncounterScript:
Mecánicas específicas de bosses o salas.

### 18.3 Datos en YAML/JSON
Usar datos declarativos para skills, estados y enemigos.

Ejemplo skill:
```yaml
id: golpe_del_alba
name: Golpe del Alba
class: caballero_alba
level: 1
type: attack
cost:
  energy: 1
target: enemy
range: melee
damage:
  type: physical
  formula: weapon + str*0.8 + 4
bonusDamage:
  condition: target.hasTag('shadow') || target.hasTag('undead') || target.hasState('juramento_falso')
  type: light
  amount: 2
cooldown: 0
threat: 5
log:
  use: "$actor descarga un golpe envuelto en alba contra $target."
```

Ejemplo estado:
```yaml
id: pegajoso
name: Pegajoso
type: debuff
maxStacks: 3
duration: 2
effects:
  evasion: -2
  initiative: -2
onMaxStacks:
  applyState: enredado
logApply: "$target queda cubierto de una sustancia pegajosa y toma decisiones de movimiento peores."
```

Ejemplo enemigo:
```yaml
id: conejo_acorazado_joven
name: Conejo Acorazado Joven
level: 2
tags: [beast, armored, villaclara]
attributes:
  strength: 4
  dexterity: 5
  constitution: 4
  perception: 3
stats:
  health: 28
  armor: 2
  evasion: 8
behavior: beast_territorial
skills:
  - embestida_pequena
  - patada_resorte
lootTable: conejo_acorazado_t1
```

### 18.4 Tick vs turno
Ranvier suele funcionar con eventos y comandos. Propongo no depender de ticks globales rápidos, sino de un CombatManager que avance cuando:
- Todos los jugadores han actuado.
- El temporizador de turno expira.
- Un NPC actúa automáticamente.

Para combates single-player:
Al recibir comando del jugador, se resuelve su turno y luego NPCs hasta volver al jugador o terminar ronda.

Para combates multi-player:
La cola avanza de participante en participante. Se notifica al jugador activo.

### 18.5 Persistencia
Guardar en memoria durante combate:
- combatId
- roomId
- participants
- round
- turnIndex
- states
- cooldowns
- resources
- threat tables
- encounter variables

Al desconectar jugador:
- Si está en combate normal: puede quedar “desorientado” y ejecutar defensa automática X rondas.
- Si boss: definir política. Recomendado: defensa automática y luego retirada si posible.

### 18.6 Logs y mensajes
Separar logs por audiencia:
- actor: mensaje para quien actúa.
- target: mensaje para objetivo.
- room: mensaje para observadores.
- party: resumen táctico.

Ejemplo:
Actor: “Alzas el escudo y juras mantener la línea”.
Room: “Jorge planta el escudo en el suelo. Una luz baja, cálida, se abre sobre la vanguardia”.
Target enemigo: “El Conejo Acorazado Coronel te considera el problema principal. Enhorabuena discutible”.

## 19. Balance inicial niveles 1-20

### 19.1 Vida y daño aproximados
Nivel 1 jugador:
Vida 35-55 según clase.
Daño básico 5-9.
Skill fuerte 10-15.

Nivel 5 jugador:
Vida 60-90.
Daño básico 10-16.
Skill fuerte 20-30.

Nivel 10 jugador:
Vida 100-150.
Daño básico 18-28.
Skill fuerte 40-60.

Nivel 20 jugador:
Vida 180-280.
Daño básico 35-55.
Skill fuerte 80-130.

Esto es orientativo. Lo importante es relación:
- Normal enemy: 3-5 golpes del jugador.
- Elite: 8-12 golpes o mecánica.
- Boss: varias fases.

### 19.2 Accuracy y fallos
Demasiados fallos aburren. Recomendación:
- Ataques normales contra enemigo equivalente: 70-85% impacto.
- Contra evasivos: 55-70%.
- Con ventaja: 85-95%.
- Fallos deben tener logs útiles y a veces generar recurso o aprendizaje.

Ejemplo:
“Fallas por poco. La Hada de Harina deja una nube en forma de burla. Aprendes algo de su patrón: tu próxima acción contra ella gana +5 precisión”.

### 19.3 Curación
La curación debe sostener, no anular daño.

Clérigo nivel bajo:
Puede salvar errores, pero no mantener a un tanque infinito sin recursos.

Cocinero:
Mejor preparación y curas pequeñas/medias con ingredientes.

Bardo:
Prevención, moral, curación menor reactiva.

Caballero/Monje:
Autosostenimiento limitado.

### 19.4 Control
Control total debe ser raro y corto.
- Aturdido: 1 ronda, con cooldown alto.
- Fascinado: rompe con daño.
- Provocado: enemigos inteligentes pueden resistir parcialmente.
- Ralentizado/Pegajoso: comunes.
- Borrón: peligro narrativo, no stun disfrazado.

## 20. Recompensas de combate

### 20.1 XP y progreso
Recompensar por:
- Derrotar enemigos.
- Resolver sin matar.
- Usar entorno.
- Completar objetivos.
- Registrar bestiario.
- Proteger NPCs.
- Descubrir debilidades.

No hacer que matar sea siempre la mejor opción.

### 20.2 Loot con identidad
Cada enemigo debe tener loot útil:
- Conejo: placa córnea, pata irónica, zanahoria de mando.
- Slime: gel, núcleo, mermelada rara.
- Hada: harina lunar, polvo feérico.
- Escriba: tinta blanca, folio sellado, máscara lisa.

### 20.3 Bestiario como recompensa
El Archivo de Monstruos paga por información:
- Primera derrota.
- Observación de habilidad.
- Captura no letal.
- Descubrimiento de debilidad.

Esto fomenta experimentar.

## 21. Diseño de encuentro ejemplo: Panadería de Doña Marga

Sala: Sótano inicial.
Entorno:
- Sacos de harina.
- Mesa de amasado.
- Horno antiguo.
- Grieta de masa.

Enemigos:
- 2 Slimes de Mermelada.
- 1 Hada de Harina.

Objetivo:
Recuperar cucharas y sellar grieta menor.

Mecánicas:
- Si se usa fuego, harina puede explotar: daño a todos, pero expone slimes.
- Se puede lanzar pan duro para atraer slimes.
- La Hada de Harina ciega hasta que se moja o se usa viento.
- Pex puede ayudar si el jugador fue amable.

Resultados:
- Completar sin quemar sacos: Doña Marga da recompensa extra.
- Quemar media bodega: éxito, pero reputación con Doña Marga baja. Pan más caro. Dolor legítimo.

## 22. Diseño de encuentro ejemplo: Archivo Municipal

Sala: Archivo de Actas y Sellos.
Enemigo oculto: Tinta Blanca Animada.
NPC: Varo Nomenclaro.

Objetivo:
Encontrar registro de Otilia.

Mecánicas:
- No empieza como combate normal.
- Acciones sociales e investigación generan tensión.
- Si el jugador firma acta falsa, recibe Juramento Falso menor.
- Si descubre tinta blanca, la tinta se anima.

Enemigos:
- Tinta Blanca: aplica Borrón de Nombre, se esconde en documentos.
- Polillas de Pergamino: comen pistas.

Contra-juego:
- Bardo canta nombre de Otilia.
- Clérigo usa Sello de Verdad.
- Inspector usa Formulario 13-B.
- Invocado usa Memoria de Pantalla Azul.
- Cartógrafo marca ruta de tinta.

## 23. PvP futuro

No implementar PvP completo al principio. El sistema por turnos puede soportarlo, pero balance y abuso social son complejos.

Fase 1:
- Duelos consentidos en academia o arena.
- Sin pérdida permanente.
- Recompensas cosméticas/reputación.

Fase 2:
- Torneos.
- Combates de facción controlados.

Reglas:
- Consentimiento explícito.
- Sin Borrón de Nombre permanente en PvP.
- Cooldowns y consumibles normalizados si hay ranking.

## 24. Roadmap de implementación

### Fase A: Núcleo mínimo
- CombatManager por rondas.
- Atacar, defender, usar skill.
- Iniciativa.
- Vida, energía.
- Estados simples.
- 3 enemigos: rata, slime, conejo.
- 3 skills por clase inicial o solo 2 clases piloto.

### Fase B: Clases y recursos
- Implementar recursos por clase.
- 8-9 clases con habilidades 1-5.
- Posiciones abstractas.
- Threat básico.

### Fase C: Villaclara combatible
- Campo Norte.
- Arroyo Brillacepa.
- Sótano de Masa Viva nivel 1.
- Bestiario local.
- Quests con combate.

### Fase D: Estados avanzados y memoria
- Borrón de Nombre.
- Nombre Anclado.
- Juramento Falso.
- Crónica Viva.
- Enemigos de Cámara.

### Fase E: Bosses y eventos
- Masa Madre Menor.
- Conejo Acorazado Coronel.
- Guardián del Pozo Cantante.
- Encuentros con objetivos no solo matar.

### Fase F: Balance y pulido
- Logs ricos.
- Ajustes numéricos.
- Autoacciones.
- UI textual clara.
- Recompensas de bestiario.

## 25. Riesgos de diseño y soluciones

Riesgo: combate demasiado lento.
Solución: acciones por defecto, logs claros, rondas cortas, enemigos con poca vida en encuentros normales.

Riesgo: demasiados estados.
Solución: empezar con 10 estados base y añadir por fases.

Riesgo: clases difíciles de balancear.
Solución: implementar primero Caballero, Clérigo, Duelista, Bardo y Cocinero como pilares; luego ampliar.

Riesgo: humor rompa tensión.
Solución: humor en nombres, logs y detalles; mecánicas serias y consecuencias reales.

Riesgo: Borrón de Nombre frustre.
Solución: efectos temporales, contra-juego claro, uso narrativo en momentos clave.

Riesgo: jugadores spameen skill óptima.
Solución: recursos, cooldowns, resistencias, enemigos con patrones y sinergias.

Riesgo: solo importe el daño.
Solución: objetivos alternativos, recompensas por captura, bestiario, reputación y entorno.

## 26. Glosario táctico Inheron

Acción principal: acción fuerte del turno.
Acción menor: acción rápida o auxiliar.
Reacción: respuesta condicional fuera del turno.
Ronda: ciclo completo de participantes.
Vanguardia: posición frontal.
Retaguardia: posición protegida.
Flanco: posición táctica lateral.
Amenaza: prioridad que los enemigos usan para elegir objetivo.
Moral: ánimo de grupo o enemigo.
Nombre: ancla de identidad contra memoria alterada.
Canon: imposición rígida de memoria por la Cámara.
Crónica: memoria viva protegida por bardo o comunidad.
Preparando: estado que avisa habilidad fuerte.
Expuesto: vulnerable al siguiente ataque.
Marcado: objetivo señalado para precisión o efectos.

## 27. Cierre de diseño

El combate de InheronMUD debe conseguir que una pelea contra tres conejos acorazados enseñe posicionamiento, que una panadería sea una mazmorra táctica, que un bardo salve a alguien cantando su nombre, que un inspector gane tiempo con un sello absurdo pero útil, y que un enemigo de la Cámara dé más miedo borrando una firma que lanzando una bola de fuego.

La clave es mezclar claridad táctica con sabor narrativo. El jugador debe sentir que cada habilidad pertenece al mundo: que Croqueta de Maná no es solo un botón de recursos, sino una mini escena; que Defender no es esperar, sino plantar el escudo; que mirar combate no es texto muerto, sino leer una sala viva.

Si el sistema funciona, Villaclara no será solo el tutorial. Será el lugar donde el jugador aprende que en Eryndor se pelea con espada, sartén, canción, sello, mapa, juramento y, cuando todo falla, con una buena retirada dignamente pendiente.

FIN DEL DOCUMENTO DE SISTEMA DE COMBATE
