import { Room, Exit } from '../models/room.model';
import { NPC } from '../models/npc.model';
import { Item, ItemType } from '../models/item.model';

export const INITIAL_ROOMS = [
  {
    id: 'villaclara_plaza',
    name: 'Plaza del Alba Chica',
    description: 'Adoquines blanqueados por el sol forman un amplio círculo en el centro del pueblo. En el medio se alza la estatua de mármol de un caballero solar, cuya espada pulida refleja la luz diurna. El murmullo de voces lejanas se mezcla con el olor a especias dulces que flota en la brisa cálida.',
    exits: [
      { direction: 'north', targetRoomId: 'villaclara_campo_norte' },
      { direction: 'south', targetRoomId: 'villaclara_pozo' },
      { direction: 'east', targetRoomId: 'villaclara_panaderia' },
      { direction: 'west', targetRoomId: 'villaclara_gremio' }
    ]
  },
  {
    id: 'villaclara_panaderia',
    name: 'Panadería Panbendito',
    description: 'El intenso aroma a masa madre y levadura satura esta pequeña estancia enharinada. Cuatro hornos de piedra rústica crepitan con calor de brasa, iluminando las paredes de adobe con destellos anaranjados. Sacos de grano de lino apilados dejan apenas un pasillo estrecho hacia el mostrador de roble.',
    exits: [
      { direction: 'west', targetRoomId: 'villaclara_plaza' },
      { direction: 'south', targetRoomId: 'villaclara_forja' }
    ]
  },
  {
    id: 'villaclara_pozo',
    name: 'El Pozo Cantante',
    description: 'Piedras milenarias, resbaladizas y cubiertas de espeso musgo esmeralda, delimitan el brocal de este pozo hundido. Una nota musical baja y cristalina reverbera desde las profundidades oscuras cada pocos segundos. El aire en esta depresión es notablemente más frío, oliendo a tierra húmeda y ozono.',
    exits: [
      { direction: 'north', targetRoomId: 'villaclara_plaza' },
      { direction: 'east', targetRoomId: 'villaclara_forja' }
    ]
  },
  {
    id: 'villaclara_gremio',
    name: 'Gremio de Aventureros',
    description: 'Banderines carmesí cuelgan del alto techo de madera, meciéndose con las corrientes de aire. Taburetes gastados rodean mesas redondas donde el tintineo de jarras de metal acompaña carcajadas ahogadas. El penetrante olor a cerveza enana y cuero curtido lo impregna todo.',
    exits: [
      { direction: 'east', targetRoomId: 'villaclara_plaza' },
      { direction: 'north', targetRoomId: 'villaclara_tablon' }
    ]
  },
  {
    id: 'villaclara_tablon',
    name: 'El Tablón de Contratos',
    description: 'Centenares de pergaminos sujetos con clavos oxidados cubren por completo esta pared de corcho. Un tenue olor a lacre y tinta seca rodea el lugar. El sonido de las discusiones en la sala principal del gremio llega aquí de forma amortiguada.',
    exits: [
      { direction: 'south', targetRoomId: 'villaclara_gremio' }
    ]
  },
  {
    id: 'villaclara_forja',
    name: 'Forja del Yunque Quebrado',
    description: 'El sofocante calor de una fragua al rojo vivo golpea como una pared física. Chispas brillantes saltan en el aire seco, iluminando un taller desordenado lleno de armaduras a medio terminar. El sonido metálico de herramientas golpeando acero resuena con un ritmo casi hipnótico.',
    exits: [
      { direction: 'north', targetRoomId: 'villaclara_panaderia' },
      { direction: 'west', targetRoomId: 'villaclara_pozo' }
    ]
  },
  {
    id: 'villaclara_campo_norte',
    name: 'Campo Norte',
    description: 'Llanuras de hierba plateada y alta se mecen rítmicamente bajo el cielo abierto. El viento silba incesantemente al rasgar las espigas, transportando el frescor matutino. A lo lejos, una cordillera de colinas dentadas e irregulares dibuja una barrera natural en el horizonte norte.',
    exits: [
      { direction: 'south', targetRoomId: 'villaclara_plaza' },
      { direction: 'north', targetRoomId: 'colinas_inicio' }
    ]
  },
  {
    id: 'colinas_inicio',
    name: 'Colinas de los Conejos Acorazados',
    description: 'Montículos de tierra removida salpican esta colina escarpada y rocosa. El sonido constante de rasguños contra la piedra emana de docenas de pequeños túneles oscuros. Un olor terroso y rancio advierte de la presencia de territorio salvaje.',
    exits: [
      { direction: 'south', targetRoomId: 'villaclara_campo_norte' },
      { direction: 'down', targetRoomId: 'colinas_madriguera' }
    ]
  },
  {
    id: 'colinas_madriguera',
    name: 'Madriguera Principal',
    description: 'Una caverna subterránea excavada con sorprendente precisión geométrica. Huesos roídos y piezas de armaduras oxidadas ensucian el suelo de tierra apisonada. El aire es denso y caliente, vibrando con siseos amenazantes que resuenan en la oscuridad.',
    exits: [
      { direction: 'up', targetRoomId: 'colinas_inicio' }
    ]
  }
];

export const INITIAL_NPCS = [
  {
    id: 'npc_doña_marga',
    name: 'Doña Marga',
    description: 'Una mujer robusta con los brazos enharinados y una mirada que impone tanto respeto como su pan.',
    stats: { fuerza: 8, destreza: 5, constitucion: 10, ingenio: 7, sabiduria: 6, presencia: 9, percepcion: 6 },
    behaviorId: 'merchant_baker',
    roomId: 'villaclara_panaderia'
  },
  {
    id: 'npc_pex',
    name: 'Pex',
    description: 'Un slime de color mermelada que parece extremadamente interesado en tus pertenencias metálicas.',
    stats: { fuerza: 3, destreza: 8, constitucion: 5, ingenio: 4, sabiduria: 3, presencia: 5, percepcion: 8 },
    behaviorId: 'friendly_slime',
    roomId: 'villaclara_panaderia'
  },
  {
    id: 'npc_maestro_gremio',
    name: 'Grom',
    description: 'Un orco viejo con más cicatrices que dientes, revisando libros de contabilidad con unas gafas de lectura diminutas.',
    stats: { fuerza: 15, destreza: 6, constitucion: 12, ingenio: 10, sabiduria: 14, presencia: 12, percepcion: 9 },
    behaviorId: 'guild_master',
    roomId: 'villaclara_gremio'
  },
  {
    id: 'npc_yunque_vivo',
    name: 'Ignis el Yunque',
    description: 'Un enorme yunque de acero oscuro que parece respirar. Dos pequeños ojos brillantes asoman en su superficie metálica.',
    stats: { fuerza: 20, destreza: 1, constitucion: 20, ingenio: 8, sabiduria: 15, presencia: 10, percepcion: 12 },
    behaviorId: 'merchant_blacksmith',
    roomId: 'villaclara_forja'
  },
  {
    id: 'npc_conejo_acorazado_1',
    name: 'Conejo Acorazado',
    description: 'Un conejo de gran tamaño con un yelmo de hierro oxidado encajado en la cabeza.',
    stats: { fuerza: 4, destreza: 7, constitucion: 6, ingenio: 3, sabiduria: 2, presencia: 3, percepcion: 9 },
    behaviorId: 'hostile_beast',
    roomId: 'villaclara_campo_norte'
  },
  {
    id: 'npc_conejo_acorazado_2',
    name: 'Conejo Acorazado Veterano',
    description: 'Este conejo no solo lleva yelmo, sino también pequeñas hombreras de cuero roídas.',
    stats: { fuerza: 6, destreza: 8, constitucion: 8, ingenio: 3, sabiduria: 3, presencia: 4, percepcion: 10 },
    behaviorId: 'hostile_beast',
    roomId: 'colinas_inicio'
  },
  {
    id: 'npc_conejo_general',
    name: 'El General Pelusa',
    description: 'Un conejo gigantesco, del tamaño de un lobo, portando una coraza abollada y blandiendo una zanahoria afilada como una lanza.',
    stats: { fuerza: 12, destreza: 10, constitucion: 15, ingenio: 5, sabiduria: 4, presencia: 12, percepcion: 10 },
    behaviorId: 'hostile_boss',
    roomId: 'colinas_madriguera'
  }
];

export const INITIAL_ITEMS = [
  {
    id: 'item_pan_bendito',
    name: 'Pan Bendito',
    description: 'Un panecillo caliente que restaura un poco de vida y calma el espíritu.',
    type: ItemType.CONSUMABLE,
    roomId: 'villaclara_panaderia'
  },
  {
    id: 'item_espada_cobre',
    name: 'Espada de Cobre del Gremio',
    description: 'Una espada básica entregada a los iniciados del gremio. Fiable, aunque poco glamurosa.',
    type: ItemType.EQUIPMENT,
    roomId: 'villaclara_plaza'
  },
  {
    id: 'item_contrato_conejos',
    name: 'Contrato: Plaga Acorazada',
    description: 'Un pergamino oficial del gremio que ofrece una recompensa por abatir al General Pelusa.',
    type: ItemType.QUEST,
    roomId: 'villaclara_tablon'
  },
  {
    id: 'item_martillo_pesado',
    name: 'Martillo de Fragua Quebrado',
    description: 'Un martillo de herrero excesivamente pesado con el mango astillado. Sirve como arma contundente improvisada.',
    type: ItemType.EQUIPMENT,
    roomId: 'villaclara_forja'
  }
];
