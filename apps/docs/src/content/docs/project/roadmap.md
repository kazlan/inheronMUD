---
title: "🗺️ Roadmap y Checklist de InheronMUD"
---

# 🗺️ Roadmap y Checklist de InheronMUD

Esta es la hoja de ruta exhaustiva del proyecto InheronMUD. Documenta la transición exitosa hacia nuestro motor Custom TypeScript y define claramente los pasos que faltan para llegar a una versión de producción ("Alpha Jugable").

---

## 🟢 MILESTONE 1: Cimientos y Arquitectura (Completado)
*El giro radical. Desacoplarnos de Ranvier y construir un motor TypeScript propio que nos permita control total y agilidad.*

- [x] **Monorepo**: Estructura base configurada (`apps/api`, `packages/engine`).
- [x] **Red y Transporte**: Servidor Fastify con WebSockets configurado en el puerto 4001.
- [x] **Modelos Base**: Entidades principales definidas (`Player`, `Room`, `NPC`, `Item`, `CronicaViva`).
- [x] **Núcleo del Motor**: Creación de la arquitectura Façade (`GameEngine`, `EntityManager`, `CommandManager`).
- [x] **Cliente CLI**: Script de conexión WebSocket con renderizado ANSI, atajos y colores clásicos de MUD.
- [x] **Auditoría de Agentes**: Reestructuración de la flota de IAs (Rana, Yunque, Zono, etc.) para que programen para el Motor TS y no para Ranvier.

---

## 🟢 MILESTONE 2: Bucle Base de Jugabilidad (Completado)
*El jugador puede existir en el mundo, moverse, interactuar y matar de forma básica.*

- [x] **Navegación espacial**: Comando `move` (`n`, `s`, `e`, `o`, `u`, `d` y diagonales).
- [x] **Percepción MUD**: Comando `look` / `l`. Estética refinada con títulos en amarillo, items en magenta y mobs en rojo/verde.
- [x] **Gestión de Inventario**: Comandos `get`, `drop`, `inventory` / `i`.
- [x] **Identidad**: Cálculo de estadísticas (`StatCalculator`) y comando `score` / `puntuacion`.
- [x] **Combate Básico**: Comando `kill` / `matar`. Simulador de resolución de combate automático basado en atributos.
- [x] **Pruebas de Humo**: Simulador automatizado (`test-smoke.ts`) actualizado para validar el flujo sin levantar el cliente.
- [x] **Mundo de Demostración**: Villaclara construida (Plaza, Gremio, Forja, Colinas) aplicando las "Mejores Prácticas" de escritura MUD.

---

## 🟢 MILESTONE 3: Ingestión de Contenido y Persistencia (Completado)
*Reemplazar los datos "hardcodeados" por un sistema robusto de carga y guardado.*

- [x] Sistema de factoría (`WorldFactory`) capaz de poblar el mundo instanciando entidades.
- [x] **Data Loaders (Yunque)**: Escribir parsers para leer Salas, NPCs e Ítems desde archivos YAML (`/data/areas/...`) en lugar de `world.ts`.
- [x] **Hot-Reload Global**: Recargar áreas dinámicamente al crear o modificar archivos en `/data/areas`.
- [x] **Persistencia (Base de Datos)**: Integrar SQLite usando Prisma ORM.
- [x] **Guardado de Jugador**: Guardar y cargar el estado del `Player` (inventario, sala actual, stats, HP) en BD automáticamente.
- [x] **Guardado de Crónica Viva**: Persistir las flags de memoria en la base de datos para que las misiones sobrevivan a reinicios del servidor.

---

## 🟢 MILESTONE 4: Sistemas Avanzados y Progresión (Completado)
*Las mecánicas que convierten a InheronMUD en un RPG profundo.*

- [x] **Combate Real-Time (Ticks)**: Convertir el `kill` (ahora instantáneo) en un sistema asíncrono gestionado por *ticks* con mensajes dinámicos, críticas, esquivas y bloqueos.
- [x] **Comandos Tácticos**: Comandos `flee` (huir) y `heal` (curarse) asíncronos en tiempo real.
- [x] **Sistema de Habilidades**: Framework de `skills` configurables puramente en YAML (`skills.yml`, `classes.yml`) que interpretan tiradas de dados (N d M + X) y efectos variados.
- [x] **Sistema de Equipamiento**: Comandos `equip` y `unequip`. Integración con el sistema de combate (daño extra según arma).
- [x] **Motor de Diálogo y Misiones**: Interacción con NPCs (`talk`, `ask`). Indicadores visuales de misión `[!]` y `[?]` integrados en el comando `look`.
- [x] **Identificación Visual Táctica**: Coloreado de mobs por dificultad (nivel relativo) y objetos por rareza (común, bueno, raro... hasta legendario en naranja).
- [x] **Economía (Bolso)**: Comandos de tienda (`buy`, `sell`, `list`) gestionados por mercaderes con persistencia de monedas (`coins`).
- [x] **Respawn Dinámico**: Motor `RespawnManager` basado en configuraciones YAML (`spawners.yml`) con soporte para variantes raras de monstruos (bosses).

---

## 🟢 MILESTONE 5: Multijugador y Onboarding (Completado)
*Abrir las puertas al mundo y habilitar la red cooperativa.*

- [x] **Flujo de Conexión (Login)**: Pantalla de inicio de sesión/registro vía WebSocket enlazada a cuentas en base de datos.
- [x] **Creación de Personaje**: Menú interactivo al crear cuenta nueva para elegir Raza y Clase (con generación de atributos y skills 100% Data-Driven desde YAML).
- [x] **Sistema de Experiencia**: Recompensas de XP tras los combates por turnos, sistema de escalado, subida de nivel automática y mejora pasiva de stats.
- [x] **Broadcasting (Sincronización de Sala)**: Emisión de eventos espaciales de movimiento y conexión de jugadores.
- [x] **Comunicaciones (Chat)**: Sistema de `say`, `tell`, `yell` y canales persistentes por roles.
- [x] **IA de NPCs Autónoma**: Mobs con rutinas y comportamiento dinámico mediante flags (`wandering`, `patrol`, `agresivo`, `social`, `cobarde`).

---

## 🟡 MILESTONE 6: Interfaz Gráfica y Consolidación (En progreso)
*Conectar el motor robusto a una experiencia de usuario moderna y fluida.*

- [ ] **Cliente Web**: Adaptación del frontend en React (`apps/web`) para interpretar los nuevos comandos, canales de chat y estado multi-sesión.
- [ ] **Sistema de Inventario Ampliado**: Implementación final de reliquias, afijos de equipo y loot tables basado en el documento de sistemas.
- [ ] **Motor de Misiones y Facciones**: Transición del sistema de Crónica Viva a un QuestManager guiado por datos (YAML) para arcos largos.
