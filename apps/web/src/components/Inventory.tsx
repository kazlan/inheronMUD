import React, { useState } from 'react';
import ItemDetail from './ItemDetail';

interface InventoryProps {
  inventory?: any[];
  onCommand: (cmd: string) => void;
}

export default function Inventory({ inventory = [], onCommand }: InventoryProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (selectedItem) {
    return (
      <ItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onCommand={onCommand}
      />
    );
  }

  if (!inventory || !Array.isArray(inventory) || inventory.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
        Tu inventario está vacío.
      </div>
    );
  }

  return (
    <div className="list-container fade-in">
      {inventory.map((item, i) => {
        if (!item) return null;
        return (
          <div
            key={item.uuid || i}
            className="list-item"
            onClick={() => setSelectedItem(item)}
          >
            <div className="list-item-content">
              <div className="list-item-title">{item.name || 'Objeto desconocido'}</div>
              <div className="list-item-sub">{item.description || ''}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
