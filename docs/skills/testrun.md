# Skill: testrun

## Descripción
Inicia una sesión de prueba automatizada con dos jugadores tester que interactúan con el mundo de InheronMUD durante un tiempo determinado (por defecto 15 minutos).

## Procedimiento
1. **Preparación**: 
   - Asegurarse de que el servidor API está corriendo (`pnpm --filter api run dev`).
   - Crear/Limpiar el archivo `docs/reporte-testers.md`.
2. **Ejecución**:
   - Lanzar dos instancias del cliente de prueba (`pnpm --filter engine run test:client`).
   - Los testers deben explorar, combatir e interactuar con el entorno.
   - Cualquier error, comportamiento extraño o bug debe ser registrado inmediatamente en `docs/reporte-testers.md`.
3. **Registro de Hallazgos**:
   - Formato: Checklist (`- [ ]`).
   - Timestamp obligatorio: `[YYYY-MM-DD HH:mm:ss]`.
   - Orden: Lo más reciente arriba (al principio del archivo).
4. **Cierre**:
   - Tras 15 minutos, detener los clientes.
   - Escribir un análisis final resumido en la parte superior de `docs/reporte-testers.md`.

## Configuración del Tester
Los testers simulan:
- Movimiento aleatorio entre áreas.
- Ataque a mobs cercanos.
- Uso de comandos abreviados (k, l, i).
- Interacción con objetos del escenario.
