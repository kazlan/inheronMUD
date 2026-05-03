import React, { useEffect } from 'react';

interface ItemDetailProps {
  item: any;
  onClose: () => void;
  onCommand: (cmd: string) => void;
  isEquipped?: boolean;
}

export default function ItemDetail({ item, onClose, onCommand, isEquipped = false }: ItemDetailProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  const hasUsable = item.behaviors && 'usable' in item.behaviors;
  const isPotion = hasUsable && (item.name?.toLowerCase().includes('potion') || item.name?.toLowerCase().includes('drink'));
  const isScroll = hasUsable && (item.name?.toLowerCase().includes('scroll'));

  const execAction = (cmd: string, confirm = false) => {
    if (confirm && !window.confirm(`¿Estás seguro de que quieres ${cmd}?`)) return;
    onCommand(cmd);
    onClose();
  };

  const itemName = item.keywords?.[0] || item.name?.split(' ').pop()?.toLowerCase() || item.name;

  return (
    <div className="item-detail fade-in">
      <button className="item-detail-back" onClick={onClose}>
        ← Volver
      </button>

      <div className="item-detail-header">
        <h3 className="item-detail-name">{item.name}</h3>
        {item.description && (
          <p className="item-detail-desc">{item.description}</p>
        )}
      </div>

      {item.metadata && (
        <div className="item-detail-stats">
          {item.metadata.slot && (
            <div className="item-stat-row">
              <span className="item-stat-label">Espacio</span>
              <span className="item-stat-value">{item.metadata.slot}</span>
            </div>
          )}
          {item.metadata.level && (
            <div className="item-stat-row">
              <span className="item-stat-label">Nivel</span>
              <span className="item-stat-value">{item.metadata.level}</span>
            </div>
          )}
          {item.metadata.stats && Object.entries(item.metadata.stats).map(([stat, val]) => (
            <div className="item-stat-row" key={stat}>
              <span className="item-stat-label">{stat}</span>
              <span className="item-stat-value">+{String(val)}</span>
            </div>
          ))}
          {item.metadata.minDamage != null && (
            <div className="item-stat-row">
              <span className="item-stat-label">Daño</span>
              <span className="item-stat-value">{item.metadata.minDamage}–{item.metadata.maxDamage}</span>
            </div>
          )}
        </div>
      )}

      <div className="item-detail-actions">
        <div className="item-actions-title">Acciones</div>

        <button className="item-action-btn" onClick={() => execAction(`look ${itemName}`)}>
          🔍 Examinar
        </button>

        {item.isEquippable && !isEquipped && (
          <button className="item-action-btn" onClick={() => execAction(`wear ${itemName}`)}>
            ⚔️ Equipar
          </button>
        )}

        {isEquipped && (
          <button className="item-action-btn" onClick={() => execAction(`remove ${itemName}`)}>
            🛡️ Quitar
          </button>
        )}

        {isPotion && (
          <button className="item-action-btn" onClick={() => execAction(`quaff ${itemName}`)}>
            🧪 Beber
          </button>
        )}

        {isScroll && (
          <button className="item-action-btn" onClick={() => execAction(`recite ${itemName}`)}>
            📜 Recitar
          </button>
        )}

        {hasUsable && !isPotion && !isScroll && (
          <button className="item-action-btn" onClick={() => execAction(`use ${itemName}`)}>
            ✨ Usar
          </button>
        )}

        <div className="item-actions-divider" />

        <button className="item-action-btn danger" onClick={() => execAction(`drop ${itemName}`, true)}>
          ♻️ Soltar
        </button>
      </div>
    </div>
  );
}
