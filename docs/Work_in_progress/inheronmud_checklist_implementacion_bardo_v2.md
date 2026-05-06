# InheronMUD — Checklist de implementación del Bardo de Crónica Viva

**Documento de trabajo técnico**  
**Ámbito:** Motor necesario para implementar el Bardo de Crónica Viva, niveles 1–39, y el sistema reactivo Pulso de Combate.  
**Estado:** checklist accionable para implementación.

---

## 1. Datos base de clase

- [ ] Crear clase `bardo_cronica_viva`.
- [ ] Añadir atributos principales:
  - [ ] Presencia.
  - [ ] Ingenio.
  - [ ] Percepción.
  - [ ] Destreza secundaria.
  - [ ] Sabiduría secundaria.
- [ ] Definir equipo permitido:
  - [ ] Instrumentos.
  - [ ] Daga.
  - [ ] Espada ligera.
  - [ ] Ropa ligera.
  - [ ] Talismanes de voz.
- [ ] Añadir progresión base 1–19.
- [ ] Añadir elección de especialización a nivel 20.
- [ ] Añadir progresión 21–39 para:
  - [ ] Cantor del Alba.
  - [ ] Maestro del Contrapunto.
  - [ ] Cronista de Nombres.

---

## 2. Recursos nuevos

- [ ] Implementar recurso `voz`.
  - [ ] Máximo: `100 + presencia * 5 + bonuses`.
  - [ ] Regeneración por ronda: `8 + floor(presencia / 2)`.
  - [ ] Costes modificables por estados como `voz_quebrada`.
- [ ] Implementar recurso `estrofa`.
  - [ ] Rango 0–5.
  - [ ] Gana +1 al usar familia distinta.
  - [ ] Pierde -1 por repetir la misma familia 3 veces.
  - [ ] Umbral especial a Estrofa 3.
- [ ] Implementar recurso `aplauso`.
  - [ ] Máximo 3 inicial.
  - [ ] Máximo 4 a nivel 10.
  - [ ] Máximo 5 desde nivel 20 si procede.
  - [ ] Ganancia por eventos notables.

---

## 3. Estado persistente del Bardo

- [ ] Añadir `bardState` al personaje.

```yaml
bardState:
  voz: 84
  estrofa: 2
  aplauso: 1
  tramaMax: 3
  lastFamilyUsed: copla
  repeatedFamilyCount: 1
  freeSustainAvailable: false
  specialization: null
```

- [ ] Guardar `lastFamilyUsed`.
- [ ] Guardar contador de repetición de familia.
- [ ] Guardar si `Primer Estribillo` ya se activó en este combate.
- [ ] Guardar uso gratuito de `Sostener Compás`.
- [ ] Resetear correctamente al terminar combate.

---

## 4. Familias de habilidades

- [ ] Añadir campo `family` a skills/hechizos.
- [ ] Soportar estas familias:
  - [ ] `nota`
  - [ ] `danza`
  - [ ] `copla`
  - [ ] `himno`
  - [ ] `balada`
  - [ ] `relato`
  - [ ] `contraestrofa`
  - [ ] `coda`
  - [ ] `nucleo`
- [ ] Hook al usar skill:
  - [ ] calcular ganancia/pérdida de Estrofa.
  - [ ] activar umbral Estrofa 3.
  - [ ] aplicar penalización por repetición.

---

## 5. Sistema de Trama

- [ ] Implementar límite de hilos activos.
  - [ ] Nivel 1–9: 3.
  - [ ] Nivel 10–19: 4.
  - [ ] Nivel 20+: 5, ajustable por especialización.
- [ ] Añadir `threadWeight` a efectos.
- [ ] Validar antes de aplicar un nuevo efecto bardo.
- [ ] Permitir efectos de peso 0.
- [ ] Permitir efectos mayores de peso 2.
- [ ] Mostrar error si la Trama está llena.
- [ ] Crear comando o vista para listar Trama activa.

Mensaje sugerido:

```text
Tu Trama ya sostiene demasiados hilos. Debes dejar caer uno o usar Cambiar el Hilo.
```

---

## 6. EffectsManager ampliado

- [ ] Soportar buffs.
- [ ] Soportar debuffs.
- [ ] Soportar efectos de sala.
- [ ] Soportar marcas narrativas.
- [ ] Soportar duración por rondas.
- [ ] Soportar duración por escena.
- [ ] Soportar duración por combate.
- [ ] Soportar ticks al inicio del turno.
- [ ] Soportar ticks al final del turno.
- [ ] Soportar modificadores numéricos:
  - [ ] Precisión.
  - [ ] Evasión.
  - [ ] Iniciativa.
  - [ ] Concentración.
  - [ ] Resistencia mental.
  - [ ] Resistencia a interrupción.
  - [ ] Resistencia a Borrón.
  - [ ] Resistencia a Olvido.
  - [ ] Curación recibida.
  - [ ] Coste de Voz.
- [ ] Guardar `sourceSkillId`.
- [ ] Guardar `sourcePlayerId`.
- [ ] Guardar `sustainedCount`.
- [ ] Guardar `canEcho`.
- [ ] Guardar `family`.
- [ ] Guardar `tags`.
- [ ] Permitir reglas condicionales en efectos.

---

## 7. Sostener Compás

- [ ] Crear skill `bardo.sostener_compas.1`.
- [ ] Permitir uso como acción menor.
- [ ] Permitir uso como acción principal.
- [ ] Acción menor:
  - [ ] coste 6 Voz.
  - [ ] prolonga 1 efecto menor +1 ronda.
- [ ] Acción principal:
  - [ ] coste 10 Voz.
  - [ ] congela hasta 2 efectos menores.
  - [ ] o prolonga 1 efecto mayor.
  - [ ] o convierte hasta 2 efectos que expiran en Eco.
- [ ] Implementar coste creciente:
  - [ ] 1ª vez: 6.
  - [ ] 2ª vez: 9.
  - [ ] 3ª vez: 14.
  - [ ] 4ª bloqueada antes de nivel 20.
- [ ] Integrar con uso gratuito de Primer Estribillo.
- [ ] Añadir mensajes de éxito/fallo.

---

## 8. Cambiar el Hilo

- [ ] Crear skill `bardo.cambiar_hilo.1`.
- [ ] Desbloquear nivel 10.
- [ ] Acción menor.
- [ ] Coste 8 Voz.
- [ ] Permitir seleccionar efecto bardo propio activo.
- [ ] Retirar efecto.
- [ ] Ganar +1 Estrofa.
- [ ] Aplicar reducción de coste `-4 Voz` a la próxima skill de familia distinta.
- [ ] Validar que no retire efectos no bardos.
- [ ] Mostrar mensaje claro.

---

## 9. Sistema de Ecos

- [ ] Crear lógica `echoOnExpire`.
- [ ] Un efecto deja Eco si:
  - [ ] fue sostenido al menos una vez.
  - [ ] estaba activo con Estrofa 3+.
  - [ ] la skill indica `echoOnExpire`.
  - [ ] un talento/especialización lo permite.
- [ ] Duración base del Eco: 1 ronda.
- [ ] Implementar ecos iniciales:
  - [ ] `eco_paso_liria`
  - [ ] `eco_himno_primera_chapa`
  - [ ] `eco_remiendo`
  - [ ] `eco_copla_pegadiza`
  - [ ] `eco_verso_fennel`
- [ ] Asegurar que ecos no ocupan Trama salvo excepción.
- [ ] Mostrar mensaje al expirar un efecto con Eco.

---

## 10. Sistema de Armonías

- [ ] Crear `HarmonyService`.
- [ ] Recalcular armonías:
  - [ ] al aplicar efecto.
  - [ ] al expirar efecto.
  - [ ] al sostener efecto.
  - [ ] al inicio/final de ronda.
- [ ] Implementar `Armonía de Vanguardia`.
  - [ ] Himno de la Primera Chapa + Paso de Liria.
  - [ ] +1 Iniciativa.
  - [ ] primer movimiento sin penalización.
- [ ] Implementar `Armonía de Ridículo`.
  - [ ] Copla Pegadiza + Síncopa Burlona sobre mismo enemigo.
  - [ ] fallo enemigo genera Estrofa.
  - [ ] fallo fuerte genera Aplauso una vez por combate.
- [ ] Implementar `Armonía de Remiendo`.
  - [ ] Balada de Remiendo + Himno del Valor Prestado.
  - [ ] siguiente curación +15%.
  - [ ] reduce Asustado.
- [ ] Implementar `Armonía de Nombre`.
  - [ ] Verso de Fennel + Relato Fidedigno o pista registrada.
  - [ ] +1 resistencia contra Borrón/Olvido.
  - [ ] resistir memoria genera Aplauso.
- [ ] Mostrar activación/desactivación al jugador.

---

## 11. Estados iniciales

- [ ] Implementar `zumbido`.
- [ ] Implementar `distraido`.
- [ ] Implementar `burlado`.
- [ ] Implementar `inspirado_leve`.
- [ ] Implementar `moral`.
- [ ] Implementar `resonancia_sala`.
- [ ] Implementar `voz_quebrada`.
- [ ] Implementar `irritado_leve`.
- [ ] Implementar `ritmo_cortado`.
- [ ] Implementar `balada_remiendo`.
- [ ] Implementar `rumor_sembrado`.
- [ ] Implementar `expuesto`.
- [ ] Implementar `nombre_anclado_menor`.
- [ ] Implementar `nombre_anclado`.
- [ ] Implementar `fuera_de_compas`.
- [ ] Implementar `mala_suerte`.
- [ ] Implementar `calor_en_la_voz`.
- [ ] Implementar `cadencia_trampa`.
- [ ] Implementar `tinta_de_voz`.

---

## 12. Skills base nivel 1–10

- [ ] `bardo.nota_cortante.1`
- [ ] `bardo.paso_liria.1`
- [ ] `bardo.copla_pegadiza.1`
- [ ] `bardo.estrofa_creciente`
- [ ] `bardo.sostener_compas.1`
- [ ] `bardo.canto_resonancia.1`
- [ ] `bardo.himno_primera_chapa.1`
- [ ] `bardo.sincopa_burlona.1`
- [ ] `bardo.corte_maelis.1`
- [ ] `bardo.balada_remiendo.1`
- [ ] `bardo.rumor_andante.1`
- [ ] `bardo.primer_estribillo`
- [ ] `bardo.cambiar_hilo.1`

---

## 13. Skills base nivel 11–19

- [ ] `bardo.nota_cortante.2`
- [ ] `bardo.paso_liria.2`
- [ ] `bardo.copla_mala_suerte.1`
- [ ] `bardo.himno_valor_prestado.1`
- [ ] `bardo.verso_fennel.1`
- [ ] `bardo.contraestrofa.1`
- [ ] `bardo.relato_fidedigno.1`
- [ ] `bardo.coda_inoportuna.1`
- [ ] `bardo.ensayo_general`

---

## 14. Especializaciones

- [ ] Crear selección de especialización al nivel 20.
- [ ] Crear validación de elección única.
- [ ] Guardar `specialization` en `bardState` o clase.
- [ ] Permitir leer especialización en skills.
- [ ] Añadir comandos/UI de elección.
- [ ] Añadir mensajes narrativos de elección.

### Cantor del Alba

- [ ] `bardo.spec.cantor_alba.voz_calida`
- [ ] `bardo.cantor.himno_orencio.1`
- [ ] `bardo.balada_remiendo.2`
- [ ] `bardo.cantor.coro_protector.1`
- [ ] `bardo.voz_entrenada`
- [ ] `bardo.cantor.nana_alba_serena.1`
- [ ] `bardo.himno_primera_chapa.2`
- [ ] `bardo.estrofa_sostenida`
- [ ] `bardo.cantor.luz_ante_testigos.1`
- [ ] `bardo.cantor.coro_viaje.1`
- [ ] `bardo.cantor.talento_calor_voz`
- [ ] `bardo.nota_cortante.3`
- [ ] `bardo.himno_valor_prestado.2`
- [ ] `bardo.copla_retorno.1`
- [ ] `bardo.cantor.himno_orencio.2`
- [ ] `bardo.cantor.bendicion_estribillo.1`
- [ ] `bardo.cancion_sala.1`
- [ ] `bardo.cantor.nana_alba_serena.2`
- [ ] `bardo.cantor.coro_presentes.1`
- [ ] `bardo.cronica_compartida.1`

### Maestro del Contrapunto

- [ ] `bardo.spec.maestro_contrapunto.caos_con_compas`
- [ ] `bardo.contrapunto.contrapunto_maelis.1`
- [ ] `bardo.sincopa_burlona.2`
- [ ] `bardo.contrapunto.traspie_branno.1`
- [ ] `bardo.voz_entrenada`
- [ ] `bardo.contrapunto.paso_sincopado.1`
- [ ] `bardo.copla_mala_suerte.2`
- [ ] `bardo.estrofa_sostenida`
- [ ] `bardo.contrapunto.risa_branno.1`
- [ ] `bardo.contrapunto.contraestrofa_burlona.1`
- [ ] `bardo.contrapunto.talento_caos_compas`
- [ ] `bardo.nota_cortante.3`
- [ ] `bardo.paso_liria.3`
- [ ] `bardo.copla_retorno.1`
- [ ] `bardo.contrapunto.contrapunto_maelis.2`
- [ ] `bardo.contrapunto.fuga_traspie.1`
- [ ] `bardo.cancion_sala.1`
- [ ] `bardo.contrapunto.cadencia_trampa.1`
- [ ] `bardo.contrapunto.aplauso_desviado.1`
- [ ] `bardo.cronica_compartida.1`

### Cronista de Nombres

- [ ] `bardo.spec.cronista_nombres.tinta_de_voz`
- [ ] `bardo.cronista.verso_nombre_verdadero.1`
- [ ] `bardo.verso_fennel.2`
- [ ] `bardo.cronista.pregunta_eco.1`
- [ ] `bardo.voz_entrenada`
- [ ] `bardo.cronista.copla_contra_borron.1`
- [ ] `bardo.rumor_andante.2`
- [ ] `bardo.estrofa_sostenida`
- [ ] `bardo.cronista.testigo_improbable.1`
- [ ] `bardo.relato_fidedigno.2`
- [ ] `bardo.cronista.talento_tinta_voz`
- [ ] `bardo.nota_cortante.3`
- [ ] `bardo.cronista.tinta_aire.1`
- [ ] `bardo.copla_retorno.1`
- [ ] `bardo.cronista.verso_nombre_verdadero.2`
- [ ] `bardo.cronista.balada_ysolde.1`
- [ ] `bardo.cancion_sala.1`
- [ ] `bardo.cronista.ultima_nota_ysolde.1`
- [ ] `bardo.cronista.refran_inborrable.1`
- [ ] `bardo.cronica_compartida.1`

---

## 15. Sistema de sala y exploración

- [ ] Añadir `room.tags`.
- [ ] Añadir rasgos:
  - [ ] `acoustic`
  - [ ] `public`
  - [ ] `memory`
  - [ ] `dungeon_living`
  - [ ] `archive`
  - [ ] `holy`
  - [ ] `water`
  - [ ] `campanas`
  - [ ] `taberna`
  - [ ] `campo_abierto`
- [ ] Añadir `room.memoryDifficulty`.
- [ ] Añadir `room.echo`.
- [ ] Añadir `room.tension`.
- [ ] Añadir `room.soundClue`.
- [ ] Añadir `room.hiddenClue`.
- [ ] Permitir efectos temporales de sala.
- [ ] Permitir que `Canto de Resonancia` revele pistas.
- [ ] Permitir que `Canción de Sala` aplique efectos contextuales.

---

## 16. NPC, diálogo y Crónica

- [ ] Permitir que `Rumor Andante` interactúe con topics de NPC.
- [ ] Permitir que `Pregunta con Eco` revele contradicciones.
- [ ] Permitir que `Testigo Improbable` cree testigos temporales.
- [ ] Permitir que `Tinta de Voz` marque pistas como protegidas.
- [ ] Permitir que `Relato Fidedigno` registre acciones notables.
- [ ] Permitir que `Crónica Compartida` lea hazañas recientes.
- [ ] Añadir flags:
  - [ ] `anchored_by_bard`
  - [ ] `temporary_witness`
  - [ ] `notable_action`
  - [ ] `recent_clue_discovered`
  - [ ] `memory_protected`

---

## 17. Pulso de Combate

- [ ] Crear `ReactiveSkillService`.
- [ ] Añadir definición `reactive` a skills.
- [ ] Añadir `bucket`.
- [ ] Añadir `basePriority`.
- [ ] Añadir condiciones.
- [ ] Añadir razones de recomendación.
- [ ] Añadir filtro de disponibilidad.
- [ ] Añadir scoring por:
  - [ ] recursos.
  - [ ] estados propios.
  - [ ] estados enemigos.
  - [ ] estados aliados.
  - [ ] sala.
  - [ ] Trama.
  - [ ] Estrofa.
  - [ ] Aplauso.
  - [ ] cooldowns.
- [ ] Añadir diversidad por buckets.
- [ ] Mostrar 6 opciones.
- [ ] Permitir elegir con `1–6`.
- [ ] Permitir `usar 1`, `rapida 2`.
- [ ] Permitir cambiar objetivo: `1 slime`.
- [ ] Mantener comandos manuales.
- [ ] Añadir comando `pulso`.
- [ ] Añadir modos:
  - [ ] táctico.
  - [ ] ofensivo.
  - [ ] defensivo.
  - [ ] soporte.
  - [ ] explorador.
  - [ ] manual.
- [ ] Guardar preferencia de modo por jugador.
- [ ] No sugerir acciones que el personaje no sabe que existen.

---

## 18. Reactive YAML inicial del Bardo

- [ ] Añadir reactive a `Nota Cortante`.
- [ ] Añadir reactive a `Paso de Liria`.
- [ ] Añadir reactive a `Copla Pegadiza`.
- [ ] Añadir reactive a `Sostener Compás`.
- [ ] Añadir reactive a `Canto de Resonancia`.
- [ ] Añadir reactive a `Himno de la Primera Chapa`.
- [ ] Añadir reactive a `Síncopa Burlona`.
- [ ] Añadir reactive a `Corte de Maelis`.
- [ ] Añadir reactive a `Balada de Remiendo`.
- [ ] Añadir reactive a `Rumor Andante`.
- [ ] Añadir reactive a `Coda Inoportuna`.
- [ ] Añadir reactive a skills de especialización.

---

## 19. Acciones de combate

- [ ] Confirmar soporte de:
  - [ ] acción principal.
  - [ ] acción menor.
  - [ ] reacción.
- [ ] Añadir validación de uso por turno.
- [ ] Añadir trigger de reacción:
  - [ ] enemigo empieza conjuro.
  - [ ] aliado recibe estado.
  - [ ] aliado baja de vida.
  - [ ] enemigo debuffado usa skill.
- [ ] Añadir cola de acciones preparadas.
- [ ] Añadir intents visibles/no visibles para Pulso.

---

## 20. UI textual

- [ ] Mostrar recursos compactos:

```text
PV 42/58 · Voz 84/125 · Estrofa 2/5 · Aplauso 1/4 · Trama 3/4
```

- [ ] Mostrar Trama activa:

```text
🎵 Trama activa
1. Himno de la Primera Chapa — grupo — 2r
2. Copla Pegadiza — Conejo Acorazado — 2r
3. Balada de Remiendo — Tilo — 3r
```

- [ ] Mostrar Armonías activas.
- [ ] Mostrar efectos con duración.
- [ ] Mostrar ticks de curación.
- [ ] Mostrar expiración.
- [ ] Mostrar Ecos.
- [ ] Mostrar sugerencias de Pulso.
- [ ] Mostrar razón al usar `pulso`.

---

## 21. Mensajes de combate

- [ ] Mensajes al lanzar cada skill.
- [ ] Mensajes al impactar.
- [ ] Mensajes al fallar.
- [ ] Mensajes al aplicar estado.
- [ ] Mensajes al sostener.
- [ ] Mensajes al activar armonía.
- [ ] Mensajes al ganar Estrofa.
- [ ] Mensajes al ganar Aplauso.
- [ ] Mensajes al dejar Eco.
- [ ] Mensajes de repercusión.
- [ ] Mensajes de Pulso.

---

## 22. Repercusión

- [ ] Implementar `voz_quebrada`.
- [ ] Implementar fallo crítico de Nota Cortante.
- [ ] Implementar fallo de Canto de Resonancia en dungeon:
  - [ ] avanzar reloj de mazmorra.
- [ ] Implementar rumor torcido en Rumor Andante.
- [ ] Implementar Atención de Cámara para efectos de nombre.
- [ ] Implementar límites para evitar abuso de memoria/anti-Borrón.

---

## 23. Balance inicial

- [ ] Revisar daño de Nota Cortante.
- [ ] Revisar curación de Balada de Remiendo.
- [ ] Revisar duración de Copla Pegadiza.
- [ ] Revisar potencia de Himno de la Primera Chapa.
- [ ] Revisar coste de Sostener Compás.
- [ ] Revisar generación de Aplauso.
- [ ] Revisar límite de Trama.
- [ ] Revisar bosses:
  - [ ] CC reducido.
  - [ ] Expuesto reducido.
  - [ ] interrupciones reducidas.
  - [ ] Borrón protegido por mecánicas.
- [ ] Evitar stack infinito.
- [ ] Evitar que Bardo cure más que Clérigo.
- [ ] Evitar que Bardo controle más que una clase dedicada sin setup.

---

## 24. Tests unitarios

- [ ] Voz se calcula bien.
- [ ] Voz regenera por ronda.
- [ ] Estrofa sube al cambiar familia.
- [ ] Estrofa no sube con Sostener Compás.
- [ ] Estrofa baja por repetición.
- [ ] Aplauso se gana por evento notable.
- [ ] Trama bloquea efectos al superar límite.
- [ ] `threadWeight` funciona.
- [ ] Sostener Compás aumenta duración.
- [ ] Coste creciente funciona.
- [ ] Cambiar el Hilo elimina efecto y da Estrofa.
- [ ] Ecos aparecen al expirar.
- [ ] Armonía de Vanguardia se activa.
- [ ] Armonía de Ridículo se activa.
- [ ] Balada de Remiendo hace ticks.
- [ ] Canto de Resonancia aplica efecto de sala.
- [ ] Corte de Maelis reduce conjuro.
- [ ] Primer Estribillo se activa una vez por combate.
- [ ] Pulso sugiere Coda cuando enemigo está Distraído.
- [ ] Pulso sugiere Sostener si un efecto expira.
- [ ] Pulso no sugiere Corte si no ve preparación enemiga.

---

## 25. Tests de integración

- [ ] Combate solo nivel 1 contra enemigo simple.
- [ ] Combate grupo nivel 5 con Himno + Copla.
- [ ] Combate nivel 8 usando Balada de Remiendo.
- [ ] Combate nivel 10 usando Trama 4/4.
- [ ] Combate con Pulso activado.
- [ ] Combate con Pulso manual.
- [ ] Combate contra elite con CC reducido.
- [ ] Combate contra boss con políticas anti-control.
- [ ] Escena social con Rumor Andante.
- [ ] Sala con Canto de Resonancia.
- [ ] Pista protegida por Cronista.
- [ ] NPC estabilizado por Cantor.
- [ ] Enemigo controlado por Maestro del Contrapunto.

---

## 26. Orden recomendado de implementación

### Fase 1: Núcleo técnico

- [ ] Recursos Voz/Estrofa/Aplauso.
- [ ] Familias de skills.
- [ ] EffectsManager ampliado.
- [ ] Trama.
- [ ] Duraciones/ticks/modificadores.

### Fase 2: Bardo 1–10

- [ ] Nota Cortante.
- [ ] Paso de Liria.
- [ ] Copla Pegadiza.
- [ ] Estrofa Creciente.
- [ ] Sostener Compás.
- [ ] Canto de Resonancia.
- [ ] Himno de la Primera Chapa.
- [ ] Síncopa Burlona.
- [ ] Corte de Maelis.
- [ ] Balada de Remiendo.
- [ ] Rumor Andante.
- [ ] Primer Estribillo.
- [ ] Cambiar el Hilo.

### Fase 3: Pulso de Combate básico

- [ ] ReactiveSkillService.
- [ ] Scoring simple.
- [ ] 6 opciones.
- [ ] selección 1–6.
- [ ] razones básicas.

### Fase 4: Bardo 11–19

- [ ] upgrades y nuevas skills.
- [ ] Coda Inoportuna.
- [ ] Verso de Fennel.
- [ ] Relato Fidedigno.

### Fase 5: Especialización 20–39

- [ ] elección de spec.
- [ ] Cantor.
- [ ] Maestro del Contrapunto.
- [ ] Cronista.

### Fase 6: Pulso avanzado

- [ ] buckets.
- [ ] modos.
- [ ] entorno.
- [ ] restricciones de conocimiento.
- [ ] tooltips/razones extendidas.

---

## 27. Veredicto

Para que el Bardo cobre vida necesitamos tres motores pequeños trabajando juntos:

1. **Motor de recursos y Trama**, para que el Bardo trence efectos.
2. **Motor de efectos ampliado**, para que buffs, debuffs, ecos, sala y memoria existan de verdad.
3. **Pulso de Combate**, para que el jugador vea oportunidades tácticas sin memorizar una biblioteca con laúd.

Cuando eso esté, el Bardo no será solo una clase. Será el primer ejemplo claro de cómo InheronMUD quiere pelear: leyendo la escena, no solo pulsando “ataque”.


---

## Revisión incorporada tras Ojo Externo

- [ ] Añadir `NotableActionBuffer` antes de implementar habilidades que consuman hazañas.
- [ ] Aclarar `Voz Quebrada`: afecta a Voz, no bloquea Aplauso salvo tag específico.
- [ ] Añadir política de purga/resistencia para efectos sostenidos.
- [ ] Añadir limpieza de Trama al morir, desconectarse o abandonar combate.
- [ ] Reducir MVP: Bardo 1-5, Trama básica, Pulso con 3 sugerencias.
- [ ] Añadir vista compacta de UI para no saturar el texto.
- [ ] Añadir restricciones de rendimiento para `ReactiveSkillService`.
- [ ] Dar al Cronista de Nombres funciones útiles en zonas sin pistas.

---

## 28. NotableActionBuffer

- [ ] Crear servicio `NotableActionBuffer`.
- [ ] Guardar eventos notables durante X rondas o hasta fin de escena.
- [ ] Soportar eventos:
  - [ ] `critical_hit`
  - [ ] `saved_ally`
  - [ ] `interrupted_major_action`
  - [ ] `resisted_memory_effect`
  - [ ] `protected_name`
  - [ ] `discovered_clue`
  - [ ] `stabilized_npc`
  - [ ] `environment_exploit`
  - [ ] `boss_mechanic_resolved`
- [ ] Añadir campos mínimos:
  - [ ] `id`
  - [ ] `type`
  - [ ] `actorId`
  - [ ] `targetId`
  - [ ] `sceneId`
  - [ ] `roomId`
  - [ ] `round`
  - [ ] `importance`
  - [ ] `tags`
  - [ ] `expiresInRounds`
  - [ ] `consumedBy`
- [ ] Evitar doble consumo de Aplauso por el mismo evento salvo excepción.
- [ ] Permitir que `Relato Fidedigno` consuma eventos.
- [ ] Permitir que `Crónica Compartida` lea eventos recientes.
- [ ] Permitir que `Pulso` sugiera habilidades basadas en eventos notables.

---

## 29. Voz Quebrada y Aplauso

- [ ] `voz_quebrada` aumenta coste de Voz.
- [ ] `voz_quebrada` aplica penalización a DC vocal si procede.
- [ ] `voz_quebrada` no bloquea habilidades que cuestan solo Aplauso.
- [ ] Añadir tag `voice_required` para habilidades de Aplauso que sí dependan de la voz.
- [ ] Añadir mensaje al jugador explicando la diferencia.

---

## 30. Purgas, resistencias y bosses

- [ ] Si una skill es resistida, no crea hilo de Trama.
- [ ] Si aplica efecto parcial, crear hilo solo si el parcial lo declara.
- [ ] Si un efecto bardo es purgado:
  - [ ] liberar hilo inmediatamente.
  - [ ] recalcular Armonías.
  - [ ] no dejar Eco salvo `echoOnPurge`.
  - [ ] mostrar mensaje.
- [ ] Si un boss purga efectos al cambiar fase:
  - [ ] avisar antes si es posible.
  - [ ] liberar hilos.
  - [ ] compensar con +1 Estrofa si era efecto sostenido, una vez por fase.
- [ ] `Pulso` debe detectar purga anunciada y bajar prioridad de sostener.

---

## 31. UI compacta y niveles de detalle

- [ ] Vista compacta por defecto:

```text
PV 42/58 · Voz 84/125 · 🎶2 · 👏1 · Trama 3/4
```

- [ ] Comando `estado bardo` para vista táctica.
- [ ] Comando `barddebug` para vista técnica/admin.
- [ ] Mostrar recursos con iconos solo si el cliente lo permite.
- [ ] En texto puro, usar alternativa:

```text
PV 42/58 · Voz 84/125 · Estrofa 2 · Aplauso 1 · Trama 3/4
```

---

## 32. Rendimiento de Pulso de Combate

- [ ] `ReactiveSkillService` debe evaluar solo skills aprendidas y disponibles.
- [ ] Precalcular contexto una vez por turno.
- [ ] Cachear sugerencias por actor/turno.
- [ ] Invalidar cache al cambiar:
  - [ ] recursos;
  - [ ] efectos;
  - [ ] objetivo;
  - [ ] sala;
  - [ ] ronda;
  - [ ] acción notable disponible.
- [ ] MVP: máximo 3 sugerencias.
- [ ] Completo: máximo 6 sugerencias.
- [ ] Presupuesto recomendado:
  - [ ] máximo 24 skills evaluadas por turno.
  - [ ] máximo 8 condiciones por skill.
  - [ ] objetivo 5 ms.
  - [ ] límite duro 20 ms.
- [ ] Si supera límite, mostrar sugerencias básicas.

---

## 33. Limpieza de Trama

- [ ] Al morir el Bardo:
  - [ ] marcar efectos como `sourceInactive`.
  - [ ] expirar buffs/debuffs normales al final de ronda.
  - [ ] eliminar efectos de sala inmediatamente.
  - [ ] conservar anclajes persistentes si tienen `persistentAnchor`.
  - [ ] recalcular Armonías.
  - [ ] desactivar Pulso.
- [ ] Al desconectarse:
  - [ ] no sostener automáticamente salvo macro explícita.
  - [ ] dejar que efectos expiren naturalmente.
- [ ] Al abandonar combate:
  - [ ] expirar efectos de combate.
  - [ ] mantener efectos de escena si lo declaran.

---

## 34. Cronista de Nombres en zonas sin pistas

- [ ] `Pregunta con Eco` puede revelar patrón enemigo si no hay pistas.
- [ ] `Tinta en el Aire` puede marcar enemigo y dar +1 precisión aliada.
- [ ] `Testigo Improbable` puede anclar una sala u objeto como testigo menor.
- [ ] `Copla contra el Borrón` funciona como resistencia mental genérica menor.
- [ ] `Verso de Nombre Verdadero` protege contra control mental común.
- [ ] `Balada de Ysolde` protege contra miedo/sombra/memoria aunque no haya Cámara.

---

## 35. MVP revisado recomendado

### Fase MVP Bardo 1-5

- [ ] Crear clase `bardo_cronica_viva`.
- [ ] Implementar `Voz`.
- [ ] Implementar `Estrofa`.
- [ ] Añadir `Aplauso` solo como placeholder visible, sin consumo complejo todavía.
- [ ] Implementar Trama básica de 3 hilos.
- [ ] Implementar estados mínimos:
  - [ ] `zumbido`
  - [ ] `distraido`
  - [ ] `moral`
  - [ ] `paso_liria`
  - [ ] `resonancia_sala`
- [ ] Implementar skills:
  - [ ] `Nota Cortante I`
  - [ ] `Paso de Liria I`
  - [ ] `Copla Pegadiza I`
  - [ ] `Estrofa Creciente`
  - [ ] `Sostener Compás`
  - [ ] `Canto de Resonancia I`
  - [ ] `Himno de la Primera Chapa I`
- [ ] Implementar Pulso con 3 sugerencias:
  - [ ] ofensiva;
  - [ ] soporte;
  - [ ] defensa/mantenimiento.
- [ ] Tests MVP:
  - [ ] Estrofa sube al cambiar familia.
  - [ ] Trama bloquea cuarto hilo.
  - [ ] Sostener aumenta duración.
  - [ ] Pulso propone Himno si no hay buff grupal.
  - [ ] Pulso propone Copla contra enemigo peligroso.
  - [ ] Canto de Resonancia detecta rasgo de sala.
