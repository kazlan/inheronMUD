# Skill: testrun

## Descripción
Inicia una sesión de prueba automatizada para evaluar la calidad técnica y narrativa de InheronMUD. Los testers no solo verifican bugs, sino que sirven de base para un análisis cualitativo de la experiencia de juego.

## Objetivos de Análisis (Benchmarks)
Para cada acción del tester, el Agente debe evaluar:
1. **Inmersión Narrativa**: ¿La descripción de la sala es suficientemente larga, rica y evocadora?
2. **Consistencia Espacial**: ¿Las salidas mencionadas en la descripción coinciden con las salidas técnicas?
3. **Vida del Mundo**: ¿Los NPCs interactúan, se mueven o lanzan mensajes que los hagan sentir vivos? ¿Or parecen estatuas?
4. **Feedback de Efectos**: ¿Son perceptibles los efectos ambientales o de combate? ¿Mejoran la atmósfera?
5. **Economía y Loot**: ¿Es el loot adecuado al esfuerzo? ¿El progreso de nivel es satisfactorio o frustrante?
6. **Dificultad y Reto**: ¿Los mobs son adecuados al nivel? ¿Las quests son realizables o imposibles?
7. **Habilidades y Tácticas**: ¿Los mobs usan sus habilidades especiales? ¿Son coherentes con su descripción?
8. **Diseño de Mapa**: ¿La zona se siente como un mundo variado o un pasillo monótono de enemigos?

## Procedimiento
1. **Preparación**: 
   - Asegurarse de que el servidor API está corriendo.
   - Limpiar o rotar `docs/reporte-testers.md`.
2. **Ejecución**:
   - Lanzar los clientes de prueba (`pnpm --filter engine run test:client`).
   - El Agente debe observar los logs en tiempo real o analizarlos post-mortem buscando patrones de los benchmarks anteriores.
3. **Registro Cualitativo**:
   - No registrar solo "éxito/fallo". Registrar observaciones sobre la "sensación" del juego.
   - Formato: `[Tipo: Narrativa/IA/Mapa] [Timestamp] Observación detallada`.
4. **Cierre**:
   - Tras la sesión, generar un "Informe de Sensaciones" en la parte superior de `docs/reporte-testers.md` evaluando los 6 puntos de análisis.

## Configuración del Tester
Los testers están programados para maximizar la exposición a diferentes sistemas:
- Exploración de bordes de zona.
- Interacción con scenery (mirar objetos).
- Estancia prolongada en zonas con efectos (ej. Capilla).
- Combates variados.
