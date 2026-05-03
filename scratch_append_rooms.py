import os

rooms_yaml = """
- id: cruce_tumbas
  title: "Cruce de las Tumbas"
  coordinates: [0, 0, -1]
  description: >-
    El pasillo se ensancha formando un cruce. En cada esquina hay estatuas de ángeles llorando con los rostros desfigurados. 
    Una densa niebla baja cubre los tobillos, ocultando el suelo irregular.
    
    Hacia el norte, este y oeste se extienden pasillos que se pierden en la oscuridad. Hacia el sur vuelves al altar impío.
  exits:
    - direction: south
      roomId: catacumbas:altar_impio
    - direction: north
      roomId: catacumbas:pasillo_norte
    - direction: west
      roomId: catacumbas:tumba_olvidada_1
    - direction: east
      roomId: catacumbas:tumba_olvidada_2

- id: tumba_olvidada_1
  title: "Tumba Olvidada (Oeste)"
  coordinates: [-1, 0, -1]
  description: >-
    Una pequeña tumba saqueada. Los sarcófagos están abiertos y sus tapas rotas en el suelo.
    
    Solo hay salida hacia el este.
  npcs: ["catacumbas:necrófago_hambriento"]
  exits:
    - direction: east
      roomId: catacumbas:cruce_tumbas

- id: tumba_olvidada_2
  title: "Tumba Olvidada (Este)"
  coordinates: [1, 0, -1]
  description: >-
    Otra pequeña tumba. Aquí el olor a muerte es menos fuerte, pero el aire es helado. 
    Hay marcas de garras en las paredes.
    
    La única salida es al oeste.
  npcs: ["catacumbas:esqueleto_guardian"]
  exits:
    - direction: west
      roomId: catacumbas:cruce_tumbas

- id: pasillo_norte
  title: "Pasillo de los Lamentos"
  coordinates: [0, 1, -1]
  description: >-
    El viento que recorre este largo pasillo suena como susurros agonizantes. 
    Las antorchas de las paredes están apagadas y cubiertas de telarañas grises.
    
    Hacia el norte continúa el pasillo, con criptas familiares a este y oeste. Al sur está el cruce.
  exits:
    - direction: south
      roomId: catacumbas:cruce_tumbas
    - direction: north
      roomId: catacumbas:pasillo_norte_2
    - direction: east
      roomId: catacumbas:cripta_familiar_2
    - direction: west
      roomId: catacumbas:cripta_familiar_1

- id: cripta_familiar_1
  title: "Cripta de los Valerius"
  coordinates: [-1, 1, -1]
  description: >-
    Una elegante cripta perteneciente a la familia Valerius. El mármol blanco está extrañamente inmaculado comparado con el resto del osario.
    
    Puedes regresar al este.
  exits:
    - direction: east
      roomId: catacumbas:pasillo_norte

- id: cripta_familiar_2
  title: "Cripta de los Thorne"
  coordinates: [1, 1, -1]
  description: >-
    La cripta de la familia Thorne está completamente destrozada. Hay huesos esparcidos por doquier, como si algo grande los hubiera masticado y escupido.
    
    Vuelve al oeste para salir.
  npcs: ["catacumbas:araña_sepulcral"]
  exits:
    - direction: west
      roomId: catacumbas:pasillo_norte

- id: pasillo_norte_2
  title: "Bifurcación de las Fosas"
  coordinates: [0, 2, -1]
  description: >-
    El suelo aquí se vuelve de tierra compactada. Un fuerte olor a descomposición indica que las fosas comunes están cerca.
    
    El camino principal sigue al norte. Al este y oeste hay enormes fosos hundidos en el suelo. Al sur está el pasillo.
  npcs: ["catacumbas:acólito_muerto"]
  exits:
    - direction: south
      roomId: catacumbas:pasillo_norte
    - direction: north
      roomId: catacumbas:antesala_laboratorio
    - direction: east
      roomId: catacumbas:fosa_comun_norte
    - direction: west
      roomId: catacumbas:fosa_comun_sur

- id: fosa_comun_sur
  title: "Fosa Común (Sector Sur)"
  coordinates: [-1, 2, -1]
  description: >-
    Un enorme socavón lleno de cadáveres apilados sin respeto alguno. Montañas de huesos forman un macabro laberinto inestable.
    
    Vuelve al este para regresar al pasillo seguro.
  npcs: ["catacumbas:necrófago_hambriento", "catacumbas:necrófago_hambriento"]
  exits:
    - direction: east
      roomId: catacumbas:pasillo_norte_2

- id: fosa_comun_norte
  title: "Fosa Común (Sector Norte)"
  coordinates: [1, 2, -1]
  description: >-
    Esta fosa parece ser más antigua. Muchos de los esqueletos llevan armaduras oxidadas de guardias de Aethelgard.
    
    Regresa al oeste.
  npcs: ["catacumbas:esqueleto_guardian", "catacumbas:esqueleto_guardian"]
  exits:
    - direction: west
      roomId: catacumbas:pasillo_norte_2

- id: antesala_laboratorio
  title: "Antesala del Embalsamador"
  coordinates: [0, 3, -1]
  description: >-
    Las paredes de tierra vuelven a ser de piedra tallada, esta vez con baldosas cerámicas manchadas de icor y productos químicos desecados.
    
    Una gran puerta doble de madera podrida se abre hacia el norte. Al sur regresas a las fosas.
  exits:
    - direction: south
      roomId: catacumbas:pasillo_norte_2
    - direction: north
      roomId: catacumbas:laboratorio_nigromante

- id: laboratorio_nigromante
  title: "Laboratorio de Nigromancia"
  coordinates: [0, 4, -1]
  description: >-
    Varias mesas de operaciones de metal están dispuestas en esta amplia sala. Herramientas quirúrgicas oxidadas y frascos con órganos flotando en formol llenan las estanterías.
    
    Hay salidas en todas las direcciones cardinales. Al norte un almacén, al este y oeste salas menores, al sur la antesala.
  npcs: ["catacumbas:nigromante_novicio"]
  exits:
    - direction: south
      roomId: catacumbas:antesala_laboratorio
    - direction: north
      roomId: catacumbas:almacen_cuerpos
    - direction: east
      roomId: catacumbas:sala_embalsamar_2
    - direction: west
      roomId: catacumbas:sala_embalsamar_1

- id: sala_embalsamar_1
  title: "Sala de Drenaje"
  coordinates: [-1, 4, -1]
  description: >-
    Una pequeña sala con canaletas en el suelo que convergen en un pozo oscuro. El olor a químicos preservantes marea.
    
    Un pasillo estrecho sigue al norte, y al este está el laboratorio.
  exits:
    - direction: east
      roomId: catacumbas:laboratorio_nigromante
    - direction: north
      roomId: catacumbas:pasillo_oscuro_1

- id: sala_embalsamar_2
  title: "Almacén de Herramientas Macabras"
  coordinates: [1, 4, -1]
  description: >-
    Sierras para huesos, pinzas enormes y agujas curvas decoran las paredes de esta cámara de tortura disfrazada de clínica.
    
    Puedes ir al oeste hacia el laboratorio o al norte por un pasillo lateral.
  exits:
    - direction: west
      roomId: catacumbas:laboratorio_nigromante
    - direction: north
      roomId: catacumbas:pasillo_oscuro_2

- id: almacen_cuerpos
  title: "Almacén de Cuerpos Frescos"
  coordinates: [0, 5, -1]
  description: >-
    Los cadáveres están apilados como leña contra las paredes. El frío mágico que emana del suelo mantiene la carne en un estado de semi-conservación.
    
    Hacia el norte se vislumbra una gran capilla. Al sur vuelves al laboratorio.
  npcs: ["catacumbas:necrófago_hambriento"]
  exits:
    - direction: south
      roomId: catacumbas:laboratorio_nigromante
    - direction: north
      roomId: catacumbas:capilla_corrupta

- id: pasillo_oscuro_1
  title: "Pasillo Lateral Oeste"
  coordinates: [-1, 5, -1]
  description: >-
    Un pasadizo claustrofóbico que rodea el almacén central.
    
    Al norte hay una pequeña celda, al sur la sala de drenaje.
  exits:
    - direction: south
      roomId: catacumbas:sala_embalsamar_1
    - direction: north
      roomId: catacumbas:celda_sacrificio_1

- id: pasillo_oscuro_2
  title: "Pasillo Lateral Este"
  coordinates: [1, 5, -1]
  description: >-
    El suelo aquí está cubierto de moho negro y resbaladizo.
    
    Al norte hay una celda, al sur vuelves a las herramientas.
  exits:
    - direction: south
      roomId: catacumbas:sala_embalsamar_2
    - direction: north
      roomId: catacumbas:celda_sacrificio_2

- id: capilla_corrupta
  title: "Capilla de la Herejía"
  coordinates: [0, 6, -1]
  description: >-
    Bancos de iglesia de madera podrida están alineados frente a un altar profanado. Tapices con símbolos del Falso Santo cuelgan del techo abovedado.
    
    Hacia el norte se alzan unas enormes puertas de hierro fundido. Al este y oeste hay pequeñas celdas de sacrificio. Al sur está el almacén de cuerpos.
  npcs: ["catacumbas:acólito_muerto", "catacumbas:nigromante_novicio"]
  exits:
    - direction: south
      roomId: catacumbas:almacen_cuerpos
    - direction: north
      roomId: catacumbas:puertas_mausoleo
    - direction: east
      roomId: catacumbas:celda_sacrificio_2
    - direction: west
      roomId: catacumbas:celda_sacrificio_1

- id: celda_sacrificio_1
  title: "Celda de Sacrificio Izquierda"
  coordinates: [-1, 6, -1]
  description: >-
    Una celda llena de instrumentos de flagelación. Un esqueleto aún está encadenado al muro.
    
    Al este está la capilla, al sur el pasillo estrecho.
  exits:
    - direction: east
      roomId: catacumbas:capilla_corrupta
    - direction: south
      roomId: catacumbas:pasillo_oscuro_1

- id: celda_sacrificio_2
  title: "Celda de Sacrificio Derecha"
  coordinates: [1, 6, -1]
  description: >-
    Paredes salpicadas de sangre seca. Hay un pozo en el centro que despide un hedor terrible.
    
    Al oeste está la capilla, al sur el pasillo estrecho.
  exits:
    - direction: west
      roomId: catacumbas:capilla_corrupta
    - direction: south
      roomId: catacumbas:pasillo_oscuro_2

- id: puertas_mausoleo
  title: "Frente a las Puertas del Mausoleo"
  coordinates: [0, 7, -1]
  description: >-
    Te encuentras ante unas colosales puertas de hierro negro talladas con bajorrelieves de almas torturadas. El paso está abierto.
    
    Avanzando al norte te adentrarás en las profundidades del Jefe. Al este y oeste hay grietas en la pared que parecen guaridas de bestias. Al sur está la capilla.
  npcs: ["catacumbas:caballero_caido"]
  exits:
    - direction: south
      roomId: catacumbas:capilla_corrupta
    - direction: north
      roomId: catacumbas:pasillo_final
    - direction: east
      roomId: catacumbas:guarida_arana_2
    - direction: west
      roomId: catacumbas:guarida_arana_1

- id: guarida_arana_1
  title: "Nido de Sedas Oeste"
  coordinates: [-1, 7, -1]
  description: >-
    El suelo y las paredes están completamente cubiertos de gruesas y pegajosas telas de araña blancas. 
    Restos de víctimas envueltas en capullos cuelgan del techo.
    
    La única salida es al este.
  npcs: ["catacumbas:araña_sepulcral", "catacumbas:araña_sepulcral"]
  exits:
    - direction: east
      roomId: catacumbas:puertas_mausoleo

- id: guarida_arana_2
  title: "Nido de Sedas Este"
  coordinates: [1, 7, -1]
  description: >-
    Igual que el nido oeste, este lugar es una trampa mortal de sedas de araña y huesos secos.
    
    Regresa al oeste antes de que te atrapen.
  npcs: ["catacumbas:araña_sepulcral"]
  exits:
    - direction: west
      roomId: catacumbas:puertas_mausoleo

- id: pasillo_final
  title: "El Descenso Final"
  coordinates: [0, 8, -1]
  description: >-
    Una larga escalinata que desciende en espiral hacia un abismo brillante. 
    Un coro fantasmal parece cantar desde las profundidades, helando la sangre en tus venas.
    
    Arriba (al sur) puedes volver a las puertas. Al norte te espera la antesala.
  exits:
    - direction: south
      roomId: catacumbas:puertas_mausoleo
    - direction: north
      roomId: catacumbas:antesala_osric

- id: antesala_osric
  title: "Antesala del Falso Santo"
  coordinates: [0, 9, -1]
  description: >-
    Dos inmensas estatuas de guerreros arrodillados flanquean la entrada final. 
    El aire aquí es tan frío que tu aliento se congela al instante. Sientes una presencia de poder abrumador justo delante.
    
    Al norte se abre el trono del jefe. Al sur puedes intentar escapar.
  npcs: ["catacumbas:caballero_caido", "catacumbas:caballero_caido"]
  exits:
    - direction: south
      roomId: catacumbas:pasillo_final
    - direction: north
      roomId: catacumbas:trono_falso_santo

- id: trono_falso_santo
  title: "Trono del Falso Santo"
  coordinates: [0, 10, -1]
  description: >-
    El núcleo de la cripta. Un trono construido a partir de lápidas rotas y huesos profanados se alza en el centro de esta vasta cámara circular. 
    Cristales necróticos oscuros iluminan la estancia, pulsando al ritmo del inexistente corazón del señor del osario.
    
    La única escapatoria es hacia el sur.
  npcs: ["catacumbas:osric_falso_santo"]
  exits:
    - direction: south
      roomId: catacumbas:antesala_osric
"""

# Modify altar_impio exit to point to cruce_tumbas instead of leaving it dead-end except for secret passage
# Wait, altar_impio originally had "direction: north" -> Wait, altar impio had north? No, it was a dead end.
# In my script I defined cruce_tumbas exits: south -> altar_impio. So I must add north exit to altar_impio!

base_path = "c:/Users/perse/OneDrive/Documentos/1. PROYECTOS/inheronMUD/ranvier-test/bundles/bundle-aethelgard/areas/catacumbas/rooms.yml"

with open(base_path, "a", encoding="utf-8") as f:
    f.write(rooms_yaml)

print("Rooms appended successfully.")
