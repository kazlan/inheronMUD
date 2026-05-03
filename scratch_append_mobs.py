import os

npcs = """
- id: araña_sepulcral
  name: "Araña Sepulcral"
  level: 5
  keywords: ["araña", "sepulcral", "bestia"]
  description: "Una enorme araña pálida adaptada a la oscuridad. Su veneno disuelve la carne muerta y viva por igual."
  behaviors:
    combat: true
    aggro: true
    lootable: true
  attributes:
    health: 60
    strength: 5
  loot:
    - item: aethelgard:pocion_salud_menor
      chance: 15

- id: necrófago_hambriento
  name: "Necrófago Hambriento"
  level: 7
  keywords: ["necrofago", "hambriento", "monstruo"]
  description: "Un humanoide retorcido que se alimenta de cadáveres. Sus garras están manchadas de sangre vieja."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 90
    strength: 10
  loot:
    - item: aethelgard:pocion_salud_menor
      chance: 20

- id: nigromante_novicio
  name: "Nigromante Novicio"
  level: 9
  keywords: ["nigromante", "novicio", "hereje"]
  description: "Un joven cultista con los ojos vendados que canaliza energía a través de un báculo de hueso."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 80
    strength: 5
  equipment:
    wield: "catacumbas:baculo_nigromante"
  loot:
    - item: catacumbas:baculo_nigromante
      chance: 20
    - item: catacumbas:pergamino_sombras
      chance: 25

- id: caballero_caido
  name: "Caballero Caído"
  level: 11
  keywords: ["caballero", "caido", "muerto"]
  description: "Un antiguo héroe de Aethelgard reanimado por magia oscura. Su armadura está abollada pero sigue siendo letal."
  behaviors:
    combat: true
    aggro: true
    lootable: true
  attributes:
    health: 150
    strength: 15
  equipment:
    wield: "catacumbas:espadon_oxidado"
    chest: "catacumbas:cota_malla_rota"
  loot:
    - item: catacumbas:espadon_oxidado
      chance: 25
    - item: catacumbas:cota_malla_rota
      chance: 15
    - item: aethelgard:pocion_salud_menor
      chance: 40

- id: osric_falso_santo
  name: "Osric el Falso Santo"
  level: 15
  keywords: ["osric", "falso", "santo", "jefe", "boss"]
  description: "El arquitecto original de estas catacumbas. Ahora es un liche envuelto en harapos papales que levita sobre el suelo."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 400
    strength: 25
  equipment:
    wield: "catacumbas:cetro_corrupcion"
  loot:
    - item: catacumbas:cetro_corrupcion
      chance: 100
    - item: catacumbas:corona_hereje
      chance: 100
"""

items = """
- id: baculo_nigromante
  name: "Báculo de Hueso Tallado"
  type: WEAPON
  keywords: ["baculo", "hueso", "nigromante"]
  description: "Un báculo hecho a partir de una espina dorsal humana rematado con un cráneo."
  metadata:
    slot: "wield"
    minDamage: 8
    maxDamage: 14
    speed: 3.0
    stats:
      mana: 20

- id: espadon_oxidado
  name: "Espadón Cruzado Oxidado"
  type: WEAPON
  keywords: ["espadon", "cruzado", "oxidado"]
  description: "Un mandoble pesado que requiere mucha fuerza para ser blandido."
  metadata:
    slot: "wield"
    minDamage: 18
    maxDamage: 30
    speed: 4.0
    stats:
      strength: 3

- id: cetro_corrupcion
  name: "Cetro de la Corrupción Absoluta"
  type: WEAPON
  keywords: ["cetro", "corrupcion", "absoluta", "osric"]
  description: "El arma de Osric. Un cetro dorado corrompido por vetas de cristal negro que pulsa con energía necrótica."
  metadata:
    slot: "wield"
    quality: "epic"
    minDamage: 25
    maxDamage: 45
    speed: 3.5
    stats:
      health: -20
      strength: 10
      mana: 50

- id: corona_hereje
  name: "Corona del Hereje"
  type: ARMOR
  keywords: ["corona", "hereje", "osric"]
  description: "Una corona de plata ennegrecida con espinas dirigidas hacia adentro."
  metadata:
    slot: "head"
    quality: "epic"
    stats:
      armor: 10
      mana: 30
"""

base = "c:/Users/perse/OneDrive/Documentos/1. PROYECTOS/inheronMUD/ranvier-test/bundles/bundle-aethelgard/areas/catacumbas"

with open(base + "/npcs.yml", "a", encoding="utf-8") as f:
    f.write(npcs)

with open(base + "/items.yml", "a", encoding="utf-8") as f:
    f.write(items)
