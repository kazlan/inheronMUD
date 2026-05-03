# Referencia de RanvierMUD: Clases, Habilidades y Progresión

Este documento resume el contenido actual disponible en la instalación local de RanvierMUD (bundles de ejemplo).

## 1. Clases y Razas

### Clases Disponibles
Actualmente hay **3 clases** implementadas en los bundles de ejemplo:

*   **Guerrero (Warrior):** Enfocado en el combate cuerpo a cuerpo y la tenacidad física. Utiliza **Energía** como recurso.
*   **Mago (Mage):** Eruditos de las fuerzas arcanas. Utilizan **Maná** para lanzar poderosos hechizos, aunque son físicamente más débiles.
*   **Paladín (Paladin):** Defensores de la Luz que combinan combate y sanación. Utilizan **Favor** (un recurso que se genera en combate y se disipa fuera de él).

### Razas Disponibles
*   **Nota:** Los bundles de ejemplo de RanvierMUD **no incluyen un sistema de razas por defecto**. Todos los personajes se consideran humanos o no tienen una distinción racial mecánica en este momento.

---

## 2. Hechizos y Habilidades

Las habilidades se desbloquean automáticamente al alcanzar ciertos niveles:

### Guerrero (Habilidades)
*   **Rend (Nivel 3):** Ataque sangrante que inflige daño en el tiempo.
*   **Lunge (Nivel 5):** Un ataque rápido y potente.
*   **Shield Block (Nivel 7):** Aumenta la capacidad de bloqueo para reducir el daño recibido.
*   **Second Wind (Nivel 10):** Habilidad pasiva/activa para recuperar salud en momentos críticos.

### Mago (Hechizos)
*   **Fireball (Nivel 5):** Lanza una bola de fuego que inflige gran daño mágico.

### Paladín (Habilidades/Hechizos)
*   **Judge (Nivel 3):** Sentencia al enemigo con poder sagrado.
*   **Plea (Nivel 5):** Una plegaria para sanar heridas básicas.
*   **Smite (Nivel 7):** Golpe sagrado contra el enemigo.

### Otras Habilidades (Sistema)
*   **Heal:** Hechizo de sanación básico (referenciado como hechizo de Clérigo, aunque la clase no está activa por defecto).
*   **Potion:** Efecto utilizado por objetos consumibles para restaurar salud.

---

## 3. Sistema de Experiencia y Niveles

El sistema está inspirado en las fórmulas clásicas de **World of Warcraft**.

### Cantidad de Niveles
*   El sistema está diseñado para escalar hasta el **Nivel 60**.

### Ganancia de Experiencia
*   **Experiencia de Mobs:** Los enemigos otorgan experiencia basada en su nivel con la fórmula: `45 + (5 * Nivel_del_Mob)`.

### Requerimientos para Subir de Nivel
La cantidad de experiencia necesaria para el siguiente nivel aumenta de forma no lineal:
*   **Nivel 1 -> 2:** Requiere aproximadamente 200 XP.
*   **Nivel 10 -> 11:** Requiere aproximadamente 2,200 XP.
*   **Nivel 30 -> 31:** Requiere aproximadamente 15,000 XP.

---

## 4. Dificultad de Progresión

La curva de dificultad tiene tres fases distintas:

1.  **Fase Inicial (Niveles 1-10):** Progresión estándar y rápida para introducir al jugador.
2.  **Fase de Aceleración (Niveles 11-27):** Se aplica un "factor de reducción" que hace que los niveles se sientan ligeramente más rápidos de lo que sugeriría la curva base.
3.  **El "Muro" (Niveles 30-60):** 
    *   A partir del nivel 30, se introduce un **factor de dificultad extra** que escala linealmente: `5 * (Nivel - 30)`.
    *   Esto significa que cada nivel después del 30 requiere significativamente más esfuerzo que el anterior, creando un desafío mayor para el *end-game*.

---
*Documento generado para el proyecto InheronMUD - Referencia de Investigación.*
