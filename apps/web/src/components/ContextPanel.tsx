import React from 'react';

export type EntityType = 'npc' | 'item' | 'player';

export interface ContextEntity {
  type: EntityType;
  name: string;
  keyword: string; // first keyword used for commands
  raw: string;     // raw label text e.g. "[NPC] Capitán Vane"
  accentColor?: string; // CSS color extracted from server ANSI label (encodes difficulty)
  uuid?: string;   // Unique ID for exact tracking (if available from room data)
}

// ──────────────────────────────────────────────────────────────
// Action definitions per entity type
// ──────────────────────────────────────────────────────────────
const NPC_ACTIONS = [
  { label: '👁 Ver',    cmd: (k: string) => `look ${k}` },
  { label: '💬 Hablar', cmd: (k: string) => `say hola` },
  { label: '🛒 Comprar', cmd: (k: string) => `list ${k}` },
  { label: '📋 Misión',  cmd: (k: string) => `quest ${k}` },
];

const MOB_ACTIONS = [
  { label: '👁 Ver',    cmd: (k: string) => `look ${k}` },
  { label: '⚔ Atacar', cmd: (k: string) => `kill ${k}` },
  { label: '⚖ Juzgar',  cmd: (k: string) => `judge ${k}` },
];

const ITEM_ACTIONS = [
  { label: '👁 Ver',   cmd: (k: string) => `look ${k}` },
  { label: '🖐 Usar',    cmd: (k: string) => `use ${k}` },
  { label: '✨ Tocar',  cmd: (k: string) => `tocar ${k}` },
  { label: '🖐 Coger',   cmd: (k: string) => `get ${k}` },
  { label: '🎒 Equipar', cmd: (k: string) => `equip ${k}` },
  { label: '📦 Tirar',  cmd: (k: string) => `drop ${k}` },
  { label: '🔎 Examinar',  cmd: (k: string) => `examine ${k}` },
];

const PLAYER_ACTIONS = [
  { label: '👁 Ver',    cmd: (k: string) => `look ${k}` },
  { label: '👋 Saludar',  cmd: (k: string) => `say hola ${k}` },
  { label: '🤝 Agrupar',  cmd: (k: string) => `group ${k}` },
];

function actionsFor(entity: ContextEntity) {
  const liveData = (entity as any).liveData || {};
  const isMob = liveData.isMob || (entity.raw && entity.raw.toLowerCase().includes('[mob]'));

  if (entity.type === 'npc') {
    return isMob ? MOB_ACTIONS : NPC_ACTIONS;
  }
  if (entity.type === 'player') return PLAYER_ACTIONS;

  const metadata = liveData.metadata || {};
  const isImmovable = metadata.noPickup === true;
  const isRoomItem = (entity as any).isRoomItem;
  
  return ITEM_ACTIONS.filter(action => {
    // 1. Hide 'Get' for immovable objects
    if (action.label.includes('Get') && isImmovable) return false;
    
    // 2. Hide 'Equip' and 'Drop' for items in the room (must get them first)
    if ((action.label.includes('Equip') || action.label.includes('Drop')) && isRoomItem) return false;

    // 3. Special handling for 'Use' vs 'Tocar'
    const name = entity.name.toLowerCase();
    const isOrb = name.includes('orbe');
    
    if (action.label.includes('Use') && isOrb) return false;
    if (action.label.includes('Tocar') && !isOrb) return false;
    
    // 4. Hide 'Use'/'Tocar' if not usable (basic check)
    const isUsable = 'usable' in (liveData.behaviors || {});
    if ((action.label.includes('Use') || action.label.includes('Tocar')) && !isUsable && !isOrb) return false;

    return true;
  });
}

function typeColor(entity: ContextEntity) {
  const liveData = (entity as any).liveData || {};
  if (liveData.consiColor) return liveData.consiColor;

  // Prefer server-sent color (encodes difficulty)
  if (entity.accentColor) return entity.accentColor;
  if (entity.type === 'npc')    return 'var(--gold)';
  if (entity.type === 'item')   return 'var(--blue-gem)';
  return '#81c784';
}

function typeLabel(entity: ContextEntity) {
  if (entity.type === 'npc') {
    const liveData = (entity as any).liveData || {};
    if (liveData.isMob) return 'MOB';
    if (entity.raw && entity.raw.toLowerCase().includes('[mob]')) return 'MOB';
    return 'NPC';
  }
  if (entity.type === 'item')   return 'Item';
  return 'Player';
}

// ──────────────────────────────────────────────────────────────
interface Props {
  entity: ContextEntity | null;
  onCommand: (cmd: string) => void;
  onClose: () => void;
}

export default function ContextPanel({ entity, onCommand, onClose }: Props) {
  if (!entity) return null;

  const actions = actionsFor(entity);
  const color = typeColor(entity);

  return (
    <div className="context-panel glass-panel">
      {/* Header */}
      <div className="context-panel-header">
        <span style={{ color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
          {typeLabel(entity)}
        </span>
        <button className="context-close-btn" onClick={onClose} title="Close">✕</button>
      </div>

      {/* Name */}
      <div className="context-panel-name" style={{ color }}>
        {entity.name}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid var(--gold-dim)', marginBottom: '0.6rem' }} />

      {/* Action buttons */}
      <div className="context-actions-grid">
        {actions.map(a => (
          <button
            key={a.label}
            className="context-action-btn"
            onClick={() => onCommand(a.cmd(entity.keyword))}
            title={a.cmd(entity.keyword)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
