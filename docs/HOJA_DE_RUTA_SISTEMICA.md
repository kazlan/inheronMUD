# HOJA DE RUTA SISTÉMICA: InheronMUD
**Timestamp:** 2026-05-05T22:35:00
**Estado:** Planificación Avanzada post-Combate/Quests

---

## 🚀 Milestone 0: Cimientos y Operación (EN CURSO)
Sistemas transversales que permiten el desarrollo y la estabilidad del proyecto.

- [x] **Autodocumentación (TypeDoc + Starlight)**
  - [x] Generación de referencia técnica desde JSDoc.
  - [x] Portal web "Códice de Inheron" unificado.
  - [x] Automatización de sincronización de manuales.
- [x] **Herramientas Admin y Debug (`AdminManager`)**
  - [x] Comandos de teletransporte (`goto`, `summon`).
  - [x] Manipulación de estado (`set-flag`, `give-item`, `spawn`).
  - [x] Visualizador de "Ficha Oculta" (`debug-player`) y estado de sala (`inspect-room`).
- [x] **Validación de Integridad de Datos**
  - [x] Validador de esquemas YAML (Zod) para áreas, NPCs e ítems.
  - [x] Verificador de enlaces de salidas (`exits`) y referencias cruzadas.
- [x] **Clientes Bot (Automatización)**
  - [x] Script de humo para pruebas de carga y flujo básico.

---

## 🛡️ Milestone 1: Identidad y Supervivencia (Core Loop)
Definir quién es el jugador, cómo crece y qué pasa cuando falla.

- [ ] **Personajes, Clases y Progresión (1-60)**
  - [x] Sistema básico de niveles y XP.
  - [x] Implementación y bucle core de la clase Bardo (Voz, Trama, Armonías).
  - [ ] Creación de personaje extendida (Orígenes y Trasfondos).
  - [ ] Árboles de habilidades y talentos por clase.
  - [ ] Especializaciones (subclases) a nivel 30.
- [ ] **Inventario y Equipo Avanzado**
  - [x] Slots de equipo básicos.
  - [ ] Sistema de peso/capacidad de carga.
  - [ ] Rareza de objetos y "Reliquias que despiertan" (ítems narrativos).
  - [ ] Durabilidad y reparación.
- [ ] **Muerte, Derrota y Recuperación**
  - [x] Respawn básico.
  - [ ] Mecánica de "Despertar en Capilla" con consecuencias narrativas.
  - [ ] Sistema de heridas temporales y recuperación por servicios.

---

## 🌍 Milestone 2: Un Mundo que Respira (Inmersión)
Hacer que el entorno y sus habitantes se sientan vivos y reactivos.

- [ ] **Exploración Textual y Salas Interactivas**
  - [x] Navegación por puntos cardinales.
  - [x] Sistema de `scenery` interactivo básico.
  - [ ] Descripciones dinámicas (Clima, Hora, Estado de Quest).
  - [ ] Comandos sensoriales (`escuchar`, `oler`, `buscar`).
- [ ] **NPCs Vivos y Rutinas**
  - [x] Diálogos basados en nodos y flags.
  - [ ] Sistema de rutinas diarias (horarios y desplazamientos).
  - [ ] Memoria de NPCs (reacción a acciones pasadas del jugador).
- [ ] **Reputación y Memoria Social**
  - [ ] Sistema de afinidad por facción y zona.
  - [ ] Estados sociales (héroe, deudor, sospechoso).
  - [ ] Consecuencias económicas y de diálogo por reputación.
- [ ] **Tiempo y Calendario**
  - [x] Reloj interno del motor.
  - [ ] Calendario de Inheron (festividades y eventos estacionales).
  - [ ] Ciclo día/noche con impacto mecánico.

---

## 💰 Milestone 3: Economía y Vida Civil (Hubs)
Actividades fuera del combate que dan profundidad al día a día en Villaclara.

- [ ] **Economía y Servicios**
  - [x] Compra/venta básica con mercaderes.
  - [ ] Servicios de posada, identificación y transporte.
  - [ ] Mercado ambulante y stock limitado de objetos raros.
- [ ] **Crafting y Profesiones de Sabor**
  - [ ] Cocina de Mazmorra (buffs y raciones).
  - [ ] Alquimia Solar y Herboristería.
  - [ ] Cartografía Viva (revelar mapa mediante exploración).
- [ ] **Tablones y Rumores**
  - [ ] Sistema de tablones de anuncios por zona.
  - [ ] Correo entre jugadores y de NPCs.
  - [ ] Difusión dinámica de rumores basados en eventos globales.

---

## ⚔️ Milestone 4: Desafíos de Élite (Endgame & Social)
Contenido para grupos y desafíos complejos.

- [ ] **Mazmorras e Instancias**
  - [ ] Soporte para mazmorras instanciadas.
  - [ ] Mecánicas de puzzles ambientales y trampas.
  - [ ] Bosses con fases y mecánicas especiales.
- [ ] **Party y Cooperación**
  - [ ] Comandos de grupo (formar, invitar, compartir quest).
  - [ ] Roles de combate definidos (Tanque, Healer, DPS).
  - [ ] Gestión de amenaza (Aggro).
- [ ] **Bestiario y Compañeros**
  - [ ] Archivo de Monstruos (desbloquear debilidades).
  - [ ] Sistema de Mascotas y Familiares (Pex y otros).

---

## 📔 Milestone 5: Legado y Crónica (Meta-progreso)
El impacto del jugador en el lore y el reconocimiento de sus hazañas.

- [ ] **Sistema Social y Resolución No Violenta**
  - [ ] Comandos de persuasión, intimidación y negociación.
  - [ ] Duelos verbales y juicios.
- [ ] **Logros, Títulos y Crónicas**
  - [ ] Registro de hitos mundiales.
  - [ ] Títulos honoríficos con impacto en el mundo.
- [ ] **Mapas y Navegación**
  - [ ] Interfaz de mapa textual dinámica.
  - [ ] Marcadores diegéticos en el mapa.

---

## 📜 Próximos Pasos Inmediatos
1. **Diseñar el documento técnico de "Personajes, clases y progresión 1-60".**
2. **Implementar el sistema de Tiempo y Calendario** (ya que afecta a casi todos los demás sistemas).
3. **Expandir el CommandManager** con comandos sensoriales básicos (`oler`, `escuchar`).

---
> [!NOTE]
> Este documento se basa en el análisis de "Sistemas pendientes para juego completo y prioridad de diseño.md" y el estado actual del repositorio `inheronMUD`.
