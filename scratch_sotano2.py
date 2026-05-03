import os
import random

base_path = "c:/Users/perse/OneDrive/Documentos/1. PROYECTOS/inheronMUD/ranvier-test/bundles/bundle-aethelgard/areas/catacumbas"

rooms_yaml = """
- id: pasillo_trampa
  title: "El Puente de la Confesión"
  coordinates: [0, 11, -1]
  description: >-
    Un puente de piedra estrecho que cruza un abismo oscuro. Al otro lado se ven unas escaleras 
    que descienden hacia las profundidades de la prisión inquisitorial.
    Las baldosas del puente parecen inestables. Cuidado donde pisas.
    
    El norte te lleva de vuelta al trono de Osric. Al sur están las escaleras de bajada, si logras cruzar.
  exits:
    - direction: north
      roomId: catacumbas:trono_falso_santo
    - direction: south
      roomId: catacumbas:entrada_sotano_2
  behaviors:
    trampa_suelo: true

- id: foso_pinchos
  title: "Foso de Pinchos Ensangrentados"
  coordinates: [0, 11, -2]
  description: >-
    Has caído por el puente falso. El fondo de este foso está cubierto de púas de hierro 
    manchadas con sangre vieja. Restos de otros aventureros menos afortunados yacen aquí.
    
    Unas ásperas rocas permiten trepar hacia arriba (al norte) de vuelta al trono.
  npcs: ["catacumbas:horror_abismal"]
  exits:
    - direction: up
      roomId: catacumbas:trono_falso_santo

- id: entrada_sotano_2
  title: "Entrada a la Prisión Inquisitorial (Sótano 2)"
  coordinates: [0, 12, -2]
  description: >-
    El aire aquí es denso, cargado con el eco de lamentos eternos. Las paredes de piedra gris 
    están reforzadas con bandas de hierro negro. A tu alrededor hay jaulas colgantes vacías.
    
    Hacia el sur se abre la nave principal de la prisión. Arriba está el puente de la confesión.
  exits:
    - direction: up
      roomId: catacumbas:pasillo_trampa
    - direction: south
      roomId: catacumbas:s2_nave_central
"""

# Generate S2 Rooms
s2_rooms = []
s2_rooms.append("""
- id: s2_nave_central
  title: "Nave Central de la Prisión"
  coordinates: [0, 13, -2]
  description: >-
    El eje de la prisión. Antorchas azules iluminan este enorme vestíbulo. 
    Hacia el este se lee un letrero: "Bloque A: Herejes". Hacia el oeste: "Bloque B: Brujos". 
    Al sur, un camino bloqueado por pesados portones lleva a las cámaras de interrogatorio.
    
    Tienes caminos al norte, sur, este y oeste.
  npcs: ["catacumbas:s2_inquisidor_sombra"]
  exits:
    - direction: north
      roomId: catacumbas:entrada_sotano_2
    - direction: south
      roomId: catacumbas:s2_puertas_interrogatorio
    - direction: east
      roomId: catacumbas:s2_bloque_a_1
    - direction: west
      roomId: catacumbas:s2_bloque_b_1
""")

# Bloque A (10 rooms)
for i in range(1, 6):
    s2_rooms.append(f"""
- id: s2_bloque_a_{i}
  title: "Pasillo del Bloque A - Sector {i}"
  coordinates: [{i}, 13, -2]
  description: >-
    Un lúgubre pasillo de celdas. Los barrotes están oxidados y el suelo pringoso.
    
    Al sur está la celda A-{i}.
  exits:
    - direction: west
      roomId: catacumbas:{'s2_nave_central' if i == 1 else f's2_bloque_a_{i-1}'}
    - direction: {'east' if i < 5 else 'none'}
      roomId: catacumbas:s2_bloque_a_{i+1}
    - direction: south
      roomId: catacumbas:s2_celda_a_{i}
""")
    # Remove none exit
    s2_rooms[-1] = s2_rooms[-1].replace("""    - direction: none\n      roomId: catacumbas:s2_bloque_a_6\n""", "")

    s2_rooms.append(f"""
- id: s2_celda_a_{i}
  title: "Celda A-{i}"
  coordinates: [{i}, 14, -2]
  description: >-
    Una celda asquerosa. Hay paja podrida en un rincón y marcas de uñas en la pared.
    
    Salida al norte.
  npcs: ["catacumbas:s2_prisionero_demente"]
  exits:
    - direction: north
      roomId: catacumbas:s2_bloque_a_{i}
""")

# Bloque B (10 rooms)
for i in range(1, 6):
    s2_rooms.append(f"""
- id: s2_bloque_b_{i}
  title: "Pasillo del Bloque B - Sector {i}"
  coordinates: [{-i}, 13, -2]
  description: >-
    Pasillo sombrío y frío. El Bloque B está en peores condiciones que el A.
    
    Al sur está la celda B-{i}.
  npcs: ["catacumbas:s2_guardia_carcelero"]
  exits:
    - direction: east
      roomId: catacumbas:{'s2_nave_central' if i == 1 else f's2_bloque_b_{i-1}'}
    - direction: {'west' if i < 5 else 'none'}
      roomId: catacumbas:s2_bloque_b_{i+1}
    - direction: south
      roomId: catacumbas:s2_celda_b_{i}
""")
    # Remove none exit
    s2_rooms[-1] = s2_rooms[-1].replace("""    - direction: none\n      roomId: catacumbas:s2_bloque_b_6\n""", "")

    s2_rooms.append(f"""
- id: s2_celda_b_{i}
  title: "Celda B-{i}"
  coordinates: [{-i}, 14, -2]
  description: >-
    Celda en penumbras, manchada de hollín mágico y marcas de fuego.
    
    Salida al norte.
  npcs: ["catacumbas:s2_prisionero_demente"]
  exits:
    - direction: north
      roomId: catacumbas:s2_bloque_b_{i}
""")

# Interrogation Rooms (6 rooms)
s2_rooms.append("""
- id: s2_puertas_interrogatorio
  title: "Puertas del Tormento"
  coordinates: [0, 14, -2]
  description: >-
    Unas pesadas puertas acorazadas custodian la zona de interrogatorio. 
    Se escuchan gritos ahogados desde el sur.
    
    Norte a la nave, sur a las cámaras de interrogatorio.
  exits:
    - direction: north
      roomId: catacumbas:s2_nave_central
    - direction: south
      roomId: catacumbas:s2_camara_interrogatorio_1

- id: s2_camara_interrogatorio_1
  title: "Cámara de la Verdad"
  coordinates: [0, 15, -2]
  description: >-
    Sillas con pinchos, mesas estiradoras y cadenas. La brutalidad inquisitorial en su máxima expresión.
    
    Norte a las puertas, sur más adentro, este al foso de agua.
  npcs: ["catacumbas:s2_torturador_ciego"]
  exits:
    - direction: north
      roomId: catacumbas:s2_puertas_interrogatorio
    - direction: south
      roomId: catacumbas:s2_camara_interrogatorio_2
    - direction: east
      roomId: catacumbas:s2_foso_ahogamiento

- id: s2_foso_ahogamiento
  title: "Foso de Ahogamiento"
  coordinates: [1, 15, -2]
  description: >-
    Un pozo profundo lleno de agua sucia y fría. 
    
    Salida al oeste.
  exits:
    - direction: west
      roomId: catacumbas:s2_camara_interrogatorio_1

- id: s2_camara_interrogatorio_2
  title: "Cámara del Silencio"
  coordinates: [0, 16, -2]
  description: >-
    A diferencia de la anterior, esta sala está inquietantemente silenciosa. Hay una Doncella de Hierro en el centro.
    
    Al norte la otra cámara, al oeste la zona de despellejamiento, al sur el pabellón del Alcaide.
  exits:
    - direction: north
      roomId: catacumbas:s2_camara_interrogatorio_1
    - direction: west
      roomId: catacumbas:s2_sala_despellejamiento
    - direction: south
      roomId: catacumbas:s2_pabellon_alcaide

- id: s2_sala_despellejamiento
  title: "Sala de Despellejamiento"
  coordinates: [-1, 16, -2]
  description: >-
    Ganchos de carnicero cuelgan del techo. El suelo es una rejilla para drenar sangre.
    
    Salida al este.
  npcs: ["catacumbas:s2_torturador_ciego"]
  exits:
    - direction: east
      roomId: catacumbas:s2_camara_interrogatorio_2
""")

# Warden's Office & Boss (5 rooms)
s2_rooms.append("""
- id: s2_pabellon_alcaide
  title: "Pabellón del Gran Inquisidor"
  coordinates: [0, 17, -2]
  description: >-
    La decoración cambia de brutalidad cruda a un lujo morboso. Alfombras rojas sobre piedra negra.
    
    Norte a las cámaras, sur a los aposentos, este a la biblioteca prohibida.
  npcs: ["catacumbas:s2_guardia_carcelero", "catacumbas:s2_guardia_carcelero"]
  exits:
    - direction: north
      roomId: catacumbas:s2_camara_interrogatorio_2
    - direction: south
      roomId: catacumbas:s2_antesala_mordecai
    - direction: east
      roomId: catacumbas:s2_biblioteca_prohibida

- id: s2_biblioteca_prohibida
  title: "Biblioteca Prohibida"
  coordinates: [1, 17, -2]
  description: >-
    Estanterías llenas de grimorios y libros de tortura anatómica.
    
    Salida al oeste.
  npcs: ["catacumbas:s2_inquisidor_sombra"]
  exits:
    - direction: west
      roomId: catacumbas:s2_pabellon_alcaide

- id: s2_antesala_mordecai
  title: "Antesala de Mordecai"
  coordinates: [0, 18, -2]
  description: >-
    Una gran puerta doble de ébano bloquea el paso hacia el jefe de la prisión. 
    Dos enormes braseros arden con fuego verde.
    
    Norte al pabellón, sur al despacho del Inquisidor.
  exits:
    - direction: north
      roomId: catacumbas:s2_pabellon_alcaide
    - direction: south
      roomId: catacumbas:s2_despacho_inquisidor

- id: s2_despacho_inquisidor
  title: "Despacho del Gran Inquisidor"
  coordinates: [0, 19, -2]
  description: >-
    Una sala opulenta dominada por un enorme escritorio de caoba cubierto de sentencias de muerte. 
    Detrás del escritorio, un trono de hierro forjado.
    
    Norte para huir. Al sur hay un pequeño pasadizo hacia el ascensor.
  npcs: ["catacumbas:s2_gran_inquisidor_mordecai"]
  exits:
    - direction: north
      roomId: catacumbas:s2_antesala_mordecai
    - direction: south
      roomId: catacumbas:s2_ascensor_s3

- id: s2_ascensor_s3
  title: "Hueco del Ascensor (Hacia Sótano 3)"
  coordinates: [0, 20, -2]
  description: >-
    Un antiguo sistema de poleas y plataformas que baja hacia las zonas inundadas. 
    El ascensor está esperando.
    
    (Fin del Sótano 2). Al norte vuelves al despacho.
  exits:
    - direction: north
      roomId: catacumbas:s2_despacho_inquisidor
""")

# Total rooms created here for S2 + transition: 3 + 1 (Nave) + 10 (A) + 10 (B) + 5 (Inter) + 5 (Warden) = 34 rooms.
# The user asked for "40 habitaciones", so let's add 6 more general torture/cells to reach exactly 40.
# Bloque C (6 rooms)
for i in range(1, 4):
    s2_rooms.append(f"""
- id: s2_bloque_c_{i}
  title: "Bloque de Aislamiento C - {i}"
  coordinates: [2, 13+{i}, -2]
  description: >-
    Celdas de aislamiento total sin luz.
    
    Norte y sur recorren el bloque.
  npcs: ["catacumbas:s2_prisionero_demente"]
  exits:
    - direction: {'north' if i > 1 else 'none'}
      roomId: catacumbas:{f's2_bloque_c_{i-1}' if i > 1 else 'none'}
    - direction: {'south' if i < 3 else 'none'}
      roomId: catacumbas:s2_bloque_c_{i+1}
""")
    if i == 1:
        s2_rooms[-1] = s2_rooms[-1].replace("    - direction: none\n      roomId: catacumbas:none\n", "    - direction: north\n      roomId: catacumbas:s2_nave_central\n")
    if i == 3:
        s2_rooms[-1] = s2_rooms[-1].replace("    - direction: none\n      roomId: catacumbas:s2_bloque_c_4\n", "")

    s2_rooms.append(f"""
- id: s2_aislamiento_celda_{i}
  title: "Pozo de Aislamiento {i}"
  coordinates: [3, 13+{i}, -2]
  description: >-
    Un agujero ciego en la pared.
    
    Oeste para salir.
  exits:
    - direction: west
      roomId: catacumbas:s2_bloque_c_{i}
""")

# Fix nave central to connect to Bloque C (east is already Bloque A, we can put Bloque C to the Northeast? Wait, Bloque A is East [1, 13].
# We can connect Bloque C to the South of Bloque A-5 or just to Nave Central.
s2_rooms[0] = s2_rooms[0].replace("""
  exits:
    - direction: north
      roomId: catacumbas:entrada_sotano_2""", """
  exits:
    - direction: north
      roomId: catacumbas:entrada_sotano_2
    - direction: southeast
      roomId: catacumbas:s2_bloque_c_1""")


rooms_yaml += "".join(s2_rooms)


npcs_yaml = """
- id: horror_abismal
  name: "Horror Abismal"
  level: 12
  keywords: ["horror", "abismal", "monstruo"]
  description: "Una amalgama de cuerpos empalados en el foso de pinchos que ha cobrado vida."
  behaviors:
    combat: true
    aggro: true
    lootable: true
  attributes:
    health: 200
    strength: 20
  loot:
    - item: aethelgard:pocion_salud_mayor
      chance: 100

- id: s2_guardia_carcelero
  name: "Guardia Carcelero"
  level: 9
  keywords: ["guardia", "carcelero", "inquisidor"]
  description: "Un celador de la prisión, armado con una pesada porra de hierro."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 110
    strength: 12
  equipment:
    wield: "catacumbas:s2_porra_hierro"
  loot:
    - item: catacumbas:s2_porra_hierro
      chance: 20

- id: s2_prisionero_demente
  name: "Prisionero Demente"
  level: 7
  keywords: ["prisionero", "demente", "loco"]
  description: "Un pobre desgraciado que perdió la cabeza tras décadas de tortura."
  behaviors:
    combat: true
    aggro: true
    lootable: true
  attributes:
    health: 60
    strength: 6

- id: s2_torturador_ciego
  name: "Torturador Ciego"
  level: 11
  keywords: ["torturador", "ciego", "verdugo"]
  description: "Un gigante musculoso con un saco de cuero en la cabeza, empuñando un látigo sangriento."
  behaviors:
    combat: true
    aggro: true
    lootable: true
  attributes:
    health: 180
    strength: 18
  equipment:
    wield: "catacumbas:s2_latigo_puas"
  loot:
    - item: catacumbas:s2_latigo_puas
      chance: 30

- id: s2_inquisidor_sombra
  name: "Inquisidor de las Sombras"
  level: 13
  keywords: ["inquisidor", "sombra", "mago"]
  description: "Un sacerdote espectral que flota a centímetros del suelo, murmurando condenas."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 130
    strength: 15
  equipment:
    wield: "catacumbas:s2_tomo_condena"
  loot:
    - item: catacumbas:s2_tomo_condena
      chance: 20

- id: s2_gran_inquisidor_mordecai
  name: "Gran Inquisidor Mordecai"
  level: 18
  keywords: ["mordecai", "gran", "inquisidor", "jefe", "boss"]
  description: "El señor del Sótano 2. Un fanático religioso envuelto en armadura de hierro ardiente y cadenas."
  behaviors:
    combat: true
    lootable: true
  attributes:
    health: 600
    strength: 35
  equipment:
    wield: "catacumbas:s2_gran_hacha_verdugo"
    head: "catacumbas:s2_mascara_hierro"
  loot:
    - item: catacumbas:s2_gran_hacha_verdugo
      chance: 100
    - item: catacumbas:s2_mascara_hierro
      chance: 100
"""

items_yaml = """
- id: s2_porra_hierro
  name: "Porra de Hierro"
  type: WEAPON
  keywords: ["porra", "hierro", "maza"]
  description: "Una vara de hierro sólido usada para doblegar prisioneros."
  metadata:
    slot: "wield"
    minDamage: 10
    maxDamage: 16
    speed: 2.5

- id: s2_latigo_puas
  name: "Látigo de Púas"
  type: WEAPON
  keywords: ["latigo", "puas", "arma"]
  description: "Un látigo de cuero grueso con púas metálicas entretejidas."
  metadata:
    slot: "wield"
    minDamage: 12
    maxDamage: 22
    speed: 1.8
    stats:
      agility: 5

- id: s2_tomo_condena
  name: "Tomo de la Condena"
  type: WEAPON
  keywords: ["tomo", "condena", "libro"]
  description: "Un grimorio pesado. Puedes usarlo como foco mágico o para golpear herejes."
  metadata:
    slot: "wield"
    minDamage: 5
    maxDamage: 10
    speed: 3.0
    stats:
      mana: 40
      strength: 2

- id: s2_gran_hacha_verdugo
  name: "Gran Hacha del Verdugo"
  type: WEAPON
  keywords: ["gran", "hacha", "verdugo", "mordecai"]
  description: "El hacha colosal de Mordecai, manchada con la sangre de mil condenados."
  metadata:
    slot: "wield"
    quality: "epic"
    minDamage: 30
    maxDamage: 55
    speed: 4.5
    stats:
      strength: 15

- id: s2_mascara_hierro
  name: "Máscara de Hierro Fundido"
  type: ARMOR
  keywords: ["mascara", "hierro", "fundido", "mordecai"]
  description: "Una pesada máscara inquisitorial que oculta el rostro e infunde terror."
  metadata:
    slot: "head"
    quality: "epic"
    stats:
      armor: 25
      strength: 5
"""

with open(base_path + "/rooms.yml", "a", encoding="utf-8") as f:
    f.write(rooms_yaml)

with open(base_path + "/npcs.yml", "a", encoding="utf-8") as f:
    f.write(npcs_yaml)

with open(base_path + "/items.yml", "a", encoding="utf-8") as f:
    f.write(items_yaml)

# Now, we need to create the script for the room trap.
# We will create scripts/room/trampa_suelo.js
script_path = base_path + "/scripts/rooms/"
os.makedirs(script_path, exist_ok=True)

trampa_script = '''
'use strict';

const { Broadcast, Damage } = require('ranvier');

module.exports = {
  listeners: {
    enter: state => function (player) {
      if (player.isNpc) {
        return;
      }
      
      // La trampa tiene 50% de probabilidad de activarse
      if (Math.random() < 0.5) {
        Broadcast.sayAt(player, "<red>¡CRAC! Las baldosas del puente ceden bajo tu peso.</red>");
        Broadcast.sayAt(player, "<yellow>¡Caes al vacío hacia un foso lleno de púas oxidadas!</yellow>");
        
        // Daño por caída
        const damage = new Damage({
          attribute: 'health',
          amount: 50,
          attacker: null,
          source: this
        });
        damage.commit(player);
        
        // Mover al jugador al foso
        const fosoRoom = state.RoomManager.getRoom('catacumbas:foso_pinchos');
        if (fosoRoom) {
          player.moveTo(fosoRoom, () => {
             state.CommandManager.get('look').execute('', player);
          });
        }
      } else {
        Broadcast.sayAt(player, "<green>El puente cruje, pero logras mantener el equilibrio y cruzar a salvo.</green>");
      }
    }
  }
};
'''

with open(script_path + "trampa_suelo.js", "w", encoding="utf-8") as f:
    f.write(trampa_script)

print("Sotano 2 added successfully!")
