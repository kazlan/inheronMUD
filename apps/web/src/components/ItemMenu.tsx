import React, { useEffect, useRef } from 'react';

interface ItemMenuProps {
  item: any;
  position: { x: number; y: number };
  onClose: () => void;
  onCommand: (cmd: string) => void;
  isEquipped?: boolean;
}

export default function ItemMenu({ item, position, onClose, onCommand, isEquipped = false }: ItemMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!item) return null;

  const isPotion = item.behaviors && 'usable' in item.behaviors && (item.name.toLowerCase().includes('potion') || item.name.toLowerCase().includes('drink'));
  const isScroll = item.behaviors && 'usable' in item.behaviors && (item.name.toLowerCase().includes('scroll') || item.name.toLowerCase().includes('recite'));

  const handleAction = (action: string, confirm: boolean = false) => {
    if (confirm) {
      if (!window.confirm(`Are you sure you want to ${action} ${item.name}?`)) {
        return;
      }
    }
    
    let cmd = '';
    const itemName = item.name.split(' ')[0].toLowerCase(); // Use first keyword usually

    switch (action) {
      case 'examine': cmd = `examine ${item.name}`; break;
      case 'equip': cmd = `wear ${item.name}`; break;
      case 'remove': cmd = `remove ${item.name}`; break;
      case 'quaff': cmd = `quaff ${item.name}`; break;
      case 'recite': cmd = `recite ${item.name}`; break;
      case 'drop': cmd = `drop ${item.name}`; break;
      case 'destroy': cmd = `destroy ${item.name}`; break;
      default: cmd = `${action} ${item.name}`;
    }

    onCommand(cmd);
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="context-menu"
      style={{ 
        left: Math.min(position.x, window.innerWidth - 180), 
        top: Math.min(position.y, window.innerHeight - 250) 
      }}
    >
      <div style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem', color: 'var(--gold)', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.2rem' }}>
        {item.name}
      </div>
      
      <div className="context-menu-item" onClick={() => handleAction('examine')}>
        <span>🔍</span> Examine
      </div>

      {item.isEquippable && !isEquipped && (
        <div className="context-menu-item" onClick={() => handleAction('equip')}>
          <span>⚔️</span> Equip
        </div>
      )}

      {isEquipped && (
        <div className="context-menu-item" onClick={() => handleAction('remove')}>
          <span>🛡️</span> Remove
        </div>
      )}

      {isPotion && (
        <div className="context-menu-item" onClick={() => handleAction('quaff')}>
          <span>🧪</span> Quaff (Drink)
        </div>
      )}

      {isScroll && (
        <div className="context-menu-item" onClick={() => handleAction('recite')}>
          <span>📜</span> Recite
        </div>
      )}

      <div className="context-menu-divider" />

      <div className="context-menu-item" onClick={() => handleAction('drop', true)}>
        <span>♻️</span> Drop
      </div>

      <div className="context-menu-item danger" onClick={() => handleAction('destroy', true)}>
        <span>💀</span> Destroy
      </div>
    </div>
  );
}
