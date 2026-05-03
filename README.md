# InheronMUD

<p align="center">
  <img src="visual Assets/01_promotional/inheronmud_hero_web_horizontal_no_text.png" alt="InheronMUD Hero Image" width="800"/>
</p>

![Status: En Desarrollo](https://img.shields.io/badge/Estado-En_Desarrollo-yellow?style=for-the-badge)
![Motor: Custom TS](https://img.shields.io/badge/Motor-Custom_TypeScript-blue?style=for-the-badge)
![Stack: Node.js](https://img.shields.io/badge/Stack-Node.js-green?style=for-the-badge)
![Arquitectura: Monorepo](https://img.shields.io/badge/Arquitectura-Monorepo_pnpm-red?style=for-the-badge)

InheronMUD es un MUD (Multi-User Dungeon) de nueva generación, diseñado bajo un esquema "Premium Isekai". Combina la nostalgia de los juegos basados en texto clásicos con una arquitectura backend moderna, persistencia en tiempo real, combate dinámico y un enfoque profundo en la narrativa (Crónica Viva) y la identidad de los objetos (Reliquias y Memoria).

## 🚀 Estado Actual y Roadmap

### Milestone 1: Cimientos y Arquitectura ✅
- Monorepo con `pnpm`, dividiendo `apps/api` (WebSockets/Fastify) y `packages/engine` (núcleo del juego).
- Flota de IAs configurada para trabajar sobre el nuevo stack.

### Milestone 2: Bucle Base de Jugabilidad ✅
- Sistema espacial (salas, salidas, comando `move`, `look`).
- Inventario y recolección de objetos (`get`, `drop`).
- Sistema estadístico de razas/clases (`score`).
- Sistema de combate por turnos/ticks automáticos (`kill`).

### Milestone 3: Ingestión de Contenido y Persistencia ✅
- Población del mundo mediante archivos YAML (`areas/villaclara/rooms.yml`, etc.).
- **Hot-Reload:** El motor detecta cambios en los YAML y actualiza el mundo *en caliente* sin reiniciar.
- **Persistencia SQLite:** Usando Prisma ORM, se guardan instantáneamente el inventario, vida, equipo y "flags" de la *Crónica Viva* del jugador.

### Milestone 4: Sistemas Avanzados 🔄 (En progreso)
- **Combate en Tiempo Real**: Comandos asíncronos (`flee`, `heal`), mensajes críticos y evasión. ✅
- **Sistema de Equipamiento**: Sistema de ranuras (`weapon`, `head`, etc.) con impacto real en los atributos derivados (`StatCalculator`). ✅
- **Diálogos y Misiones**: Motor de `talk` condicionado por la memoria, con marcadores visuales `[!]` y `[?]` en el mundo. ✅
- **Identificadores Visuales y Tácticos**: Rarezas de equipo coloreadas (común a legendario) y niveles relativos de MOBs coloreados por peligrosidad. ✅
- **Economía**: *(En progreso)* Moneda en base de datos (`coins`), pendientes comandos de tienda (`buy`, `sell`).

### Milestone 5: Multijugador y Onboarding ⏳ (Pendiente)
- Login y creación de personajes vía WebSocket.
- Broadcasting espacial (sincronización entre jugadores en la misma sala).
- Chat de sala (`say`) y global (`gossip`).

---

## 🏗️ Arquitectura del Motor

El núcleo de InheronMUD (`packages/engine`) está diseñado en **TypeScript puro**, totalmente agnóstico de la capa de transporte (WebSockets, TCP, o HTTP). Sigue patrones estructurados de diseño de software:

- **GameEngine (Facade/Mediator):** Orquesta los diferentes managers y el *Game Loop* asíncrono.
- **EntityManager (Registry):** Gestiona la instanciación e indexación en memoria de `Player`, `NPC`, `Room` e `Item`.
- **CommandManager:** Interpreta las acciones de los jugadores y emite eventos al motor y modificaciones a las entidades.
- **CombatManager:** Suscrito al Game Loop, gestiona aggro, daño, evasiones y narración de impactos.
- **DataLoader y WorldFactory:** Lee archivos `.yml` estructurados y levanta/actualiza el estado del mundo sobre la marcha (Hot-reload).
- **Prisma SQLite:** Capa de almacenamiento en local/desarrollo (`dev.db`).

## 🛠️ Cómo ejecutar

1. Instalar dependencias globales: `npm install -g pnpm`
2. Instalar dependencias: `pnpm install`
3. Generar cliente de BD: `cd packages/engine && npx prisma generate && npx prisma db push`
4. Levantar servidor MUD (API WebSocket): `cd apps/api && pnpm dev`
5. Levantar el cliente CLI (Terminal): `cd apps/api && node src/client.js`

¡Adéntrate en Villaclara, viaja hacia el norte para enfrentarte a la Plaga Acorazada, o habla con el Anciano Sabio en la plaza principal!
