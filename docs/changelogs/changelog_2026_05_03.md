# 📄 Registro de Cambios Exhaustivo - Sesión 03-05-2026

## [03-05-2026] - Gran Consolidación: Del Corazón del Sistema a la Expansión del Mundo

### 🛠️ Mundo y Contenido (La Gran Expansión)
- **Generación Masiva de Zonas**: Implementación de +150 habitaciones para el inicio del juego:
    - **Villaclara**: Refinamiento del hub principal.
    - **Bosque de los Ecos**: 64 habitaciones de espesura mágica con generación procedural.
    - **Llanuras de Ámbar**: 64 habitaciones de exploración abierta.
- **Interconectividad**: Enlazado total de las zonas periféricas con el hub central mediante puntos de transición lógicos.

### 🧠 Inteligencia Artificial y Vida en el Mundo
- **Motor de IA (AIManager)**: Creación de un sistema de ticks dedicado para el comportamiento de NPCs.
- **Ecosistema de Mobs**: Implementación de 5 estados de IA basados en flags YAML:
    - `wandering`: Los mobs exploran sus zonas de forma autónoma.
    - `patrol`: Rutas de vigilancia fijas mediante `patrolPath`.
    - `agresivo`: Inicio de combate por proximidad.
    - `social`: Comportamiento de manada/ayuda entre mobs similares.
    - `cobarde`: Mecánica de huida táctica cuando la vida es crítica (<30%).
- **Directivas Creativas**: Actualización de los manuales de los agentes (`Loro`, `Zono`, `Torta`, `Yunque`) para el uso de estas nuevas herramientas.

### 📡 Comunicación y Socialización
- **Sistema de Chat Multicapa**: Implementación completa de comandos `say` (local), `tell` (privado), `yell` (regional) y canales globales.
- **Administración de Canales**: CRUD de canales in-game para administradores (crear, borrar, mutear, expulsar, asignar OPs).
- **Broadcasting Espacial**: Sincronización de eventos de sala ("X entra", "Y sale", "Z conecta") para todos los jugadores presentes.
- **Escucha de NPCs**: Gancho `listenRules` para que los NPCs reaccionen a palabras clave en el chat.

### 🎭 Identidad y Progresión (El Alma del RPG)
- **Flujo de Login y Creación**: Implementación del ciclo completo de entrada y creación de cuenta/personaje vía WebSocket.
- **Estadísticas Data-Driven**: Los stats ahora dependen estrictamente de Raza y Clase, cargados dinámicamente desde YAML (sin reparto manual de puntos, siguiendo el diseño original).
- **Sistema de Experiencia**: Preparada la lógica de ganancia de XP, escalado de niveles y subida automática de atributos.
- **Normalización de Dados**: Ajuste del sistema de combate para soportar valores planos (diceCount 0) mediante modificadores.

### ⚙️ Arquitectura y Persistencia
- **Esquema de Datos (Prisma)**: Ampliación de la base de datos para soportar:
    - Roles de usuario (`USER`, `ADMIN`).
    - Persistencia de canales y sus configuraciones de moderación.
    - Flags de memoria para misiones.
- **Gestores Desacoplados**: Introducción de `ChatManager` y `AIManager` para mantener el `GameEngine` limpio y modular.
- **Mantenimiento Técnico**: Resolución de errores de sintaxis en el `EntityManager` y optimización de los parsers de YAML.

---
*Fin del registro de sesión. InheronMUD ha evolucionado de un motor base a un entorno multijugador vivo y estructurado.*
