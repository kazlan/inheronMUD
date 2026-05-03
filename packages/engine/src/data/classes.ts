import { Stats } from '../models/player.model';

export interface Class {
  id: string;
  name: string;
  description: string;
  primaryStats: (keyof Stats)[];
  statBonuses: Partial<Stats>;
  startingSkills: string[];
}

export const CLASSES: Class[] = [
  {
    id: 'caballero_alba',
    name: 'Caballero del Alba',
    description: 'Protector radiante y ejecutor de juramentos.',
    primaryStats: ['fuerza', 'constitucion'],
    statBonuses: { fuerza: 1, constitucion: 1 },
    startingSkills: ['golpe_alba', 'provocacion']
  },
  {
    id: 'cocinero_mazmorra',
    name: 'Cocinero de Mazmorra',
    description: 'Soporte que utiliza ingredientes de monstruos.',
    primaryStats: ['constitucion', 'ingenio'],
    statBonuses: { constitucion: 1, ingenio: 1 },
    startingSkills: ['sarten_meteorica', 'marinada_monstruo']
  },
  {
    id: 'cartografo_vivo',
    name: 'Cartógrafo Vivo',
    description: 'Explorador que revela secretos y controla el mapa.',
    primaryStats: ['percepcion', 'ingenio'],
    statBonuses: { percepcion: 1, ingenio: 1 },
    startingSkills: ['leer_sala', 'tinta_persistente']
  },
  {
    id: 'bardo_cronica',
    name: 'Bardo de Crónica Viva',
    description: 'Custodio de la memoria y la moral del grupo.',
    primaryStats: ['presencia', 'sabiduria'],
    statBonuses: { presencia: 1, sabiduria: 1 },
    startingSkills: ['cancion_nombre', 'burla_dramatica']
  },
  {
    id: 'invocado_desubicado',
    name: 'Invocado Desubicado',
    description: 'Clase flexible con habilidades de otro mundo.',
    primaryStats: ['ingenio', 'presencia'],
    statBonuses: { ingenio: 1, presencia: 1 },
    startingSkills: ['improvisacion_maestra', 'resonancia_latente']
  }
];
