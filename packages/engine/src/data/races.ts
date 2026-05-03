import { Stats } from '../models/player.model';

export interface Race {
  id: string;
  name: string;
  description: string;
  statBonuses: Partial<Stats>;
  racialTrait: {
    name: string;
    description: string;
  };
}

export const RACES: Race[] = [
  {
    id: 'humano_altherion',
    name: 'Humano de Altherion',
    description: 'Habitantes del reino solar. Acostumbrados a gremios y academias.',
    statBonuses: { presencia: 1 },
    racialTrait: {
      name: 'Adaptabilidad Solar',
      description: 'Reduce la duración de estados mentales o sociales leves.'
    }
  },
  {
    id: 'humano_arvell',
    name: 'Humano de Arvell',
    description: 'Gentes de llanura y milicias. Prácticos y resistentes.',
    statBonuses: { constitucion: 1 },
    racialTrait: {
      name: 'Terquedad de Campana',
      description: 'Gana resistencia al miedo cuando la vida es baja.'
    }
  },
  {
    id: 'eldaryn',
    name: 'Eldáryn de Hojaluna',
    description: 'Sensibles a pactos, nombres y promesas rotas.',
    statBonuses: { sabiduria: 1 },
    racialTrait: {
      name: 'Oído de Hoja',
      description: 'Detecta pistas feéricas y resiste el olvido menor.'
    }
  },
  {
    id: 'duergrin',
    name: 'Duergrin',
    description: 'Enanos runistas, artesanos y tenaces.',
    statBonuses: { constitucion: 1 },
    racialTrait: {
      name: 'Hueso de Yunque',
      description: 'Reduce el daño físico cuando defiende.'
    }
  },
  {
    id: 'forastero',
    name: 'Forastero Planar',
    description: 'Llegado de otro mundo con una lógica extravagante.',
    statBonuses: { ingenio: 1 },
    racialTrait: {
      name: 'Lógica de Otro Mundo',
      description: 'Puede repetir una tirada de improvisación o resistencia a memoria.'
    }
  }
];
