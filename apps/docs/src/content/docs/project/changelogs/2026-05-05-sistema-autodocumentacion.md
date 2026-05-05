---
title: "Changelog: Sistema de Autodocumentación \"Códice de Inheron\""
---

# Changelog: Sistema de Autodocumentación "Códice de Inheron"
**Fecha:** 2026-05-05
**Agente:** Antigravity (Engine Architect / Documentation Master)

## 🚀 Resumen
Se ha implementado un sistema completo de documentación técnica y narrativa para InheronMUD, unificando la referencia del código con los manuales de diseño en un portal web moderno y profesional.

## 🛠️ Cambios Realizados

### 1. Documentación Técnica (TypeDoc)
- Configuración de **TypeDoc** en la raíz del proyecto para documentar `packages/engine`.
- Actualización de `packages/engine/src/index.ts` para exportar todos los managers y modelos críticos (AIManager, ChatManager, SkillManager, etc.), asegurando su visibilidad en la documentación.
- Generación automática de referencia técnica en formato Markdown compatible con Starlight.

### 2. Portal "Códice del Mundo" (Starlight)
- Creación de una nueva aplicación en `apps/docs` utilizando el framework **Starlight (Astro)**.
- Diseño de una página de inicio (Splash) personalizada con estética isekai.
- Configuración de navegación inteligente (Sidebar) con secciones para:
  - **Empezando:** Roadmap y bienvenida.
  - **Lore y Mundo:** Guías de viaje y ambientación.
  - **Manuales y Guías:** Instrucciones técnicas para YAML y sistemas.
  - **Referencia Técnica (API):** Documentación automática del motor.
  - **Meta:** Changelogs y reportes de testers.

### 3. Automatización y Pipeline
- Creación de `scripts/sync-docs.js` (Node.js) para el mantenimiento del portal:
  - **Slugificación:** Normalización de nombres de archivos (ej: "Guía YAML" -> "guia-yaml").
  - **Inyección de Frontmatter:** Procesamiento automático para añadir títulos requeridos por Starlight.
  - **Sincronización:** Copia recursiva de la carpeta raíz `/docs` hacia el portal.
- Añadidos scripts al `package.json` raíz:
  - `docs:api`: Genera la referencia técnica.
  - `docs:build`: Ejecuta la generación y sincronización completa.
  - `docs:dev`: Lanza el portal en modo desarrollo.

### 🤖 Nueva Skill de Agente
- Se ha definido la skill `mantener_codice_inheron` en `agents/documentation-master/skill-sistema-autodocumentacion.md`, permitiendo a los agentes IA mantener el sistema actualizado de forma autónoma.

## 📈 Impacto
- **Para Desarrolladores:** Acceso inmediato a la firma de métodos y clases del motor.
- **Para Diseñadores:** Un lugar centralizado para leer guías de YAML y lore.
- **Para IA/Agentes:** Una base de conocimiento estructurada y siempre sincronizada.

---
*Fin del reporte del 2026-05-05*
