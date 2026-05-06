# Changelog InheronMUD — 2026-05-06

## 🚀 Nuevas Funcionalidades y Mejoras

### 🎵 Mecánicas del Bardo y Regeneración
- **Fórmula de Voz (Recurso)**: Se ha implementado la fórmula oficial según el documento de diseño: `8 + floor(Presencia / 2)` por tick.
- **Regeneración Dinámica**: 
    - En combate: 100% de la fórmula.
    - Fuera de combate: **1.5x** de la fórmula para una recuperación acelerada.
- **Salud**: Mantenida en 1% (combate) y 5% (fuera de combate) de la salud máxima.

### ⚡ Pulso de Combate (UX/UI)
- **Panel Táctico Fijo**: Las sugerencias de combate ya no aparecen en el chat log (spam). Ahora se muestran en un panel fijo justo encima del prompt.
- **Optimización de Opciones**: Limitado el número de sugerencias a las **4 mejores opciones**, facilitando la lectura y el uso de botones.
- **Visuales Premium**: Color coding por tipo de acción (Ataque, Defensa, Sanación, etc.) y animaciones de entrada/salida.
- **Interactividad**: Las opciones son clickeables y responden a comandos rápidos (1-4).

### 🛠️ Comandos de Administración
- **Fuzzy Logic en Subcomandos**: Los subcomandos de `admin` ahora admiten abreviaturas.
    - `adm r` -> `admin room`
    - `adm ref` -> `admin refresh`
    - `adm go` -> `admin goto`
- **Mensajes de Ayuda**: Se ha mejorado el feedback cuando un subcomando no se reconoce, mostrando las opciones válidas.

### 🎒 Gestión de Objetos (Wildcards)
- **Comodín 'all'**: Añadido soporte para `get all` y `drop all`.
- **Comodín '.' (Contenedores)**: Implementado `get . cofre` para recoger todo el contenido de un objeto contenedor de forma masiva.

## 🔧 Correcciones Técnicas
- **Fastify Startup**: Corregido el orden de registro de rutas WebSocket en `server.ts` para asegurar que el socket esté disponible desde el inicio del servidor.
- **Keyboard Focus**: Reforzada la persistencia del foco en el CommandLine tras clics en el viewport y cambios de escena.

## 📖 Documentación y Arquitectura
- **Sistema de Ayuda Externalizado**: Se ha desacoplado el contenido de ayuda del código fuente (`CommandManager.ts`).
    - ** help.yml**: Nuevo archivo en `data/system/help.yml` que centraliza todos los manuales.
    - **Hot-Reloading**: Implementada la recarga en caliente para manuales de ayuda. Cualquier edición en el YAML se refleja instantáneamente en el juego sin reiniciar servidores.
- **Manuales del Bardo**: Añadida documentación exhaustiva para la clase Bardo y sus mecánicas (Voz, Estrofa, Aplauso, Trama).
- **Sincronización**: Actualizada la **Hoja de Ruta Sistémica** con el progreso del Milestone 0 y 1.
