import React, { useState } from 'react';
import ItemDetail from './ItemDetail';

interface EquipmentProps {
  equipment?: any;
  onCommand: (cmd: string) => void;
}

export default function Equipment({ equipment = {}, onCommand }: EquipmentProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (selectedItem) {
    return (
      <ItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onCommand={onCommand}
        isEquipped={true}
      />
    );
  }

  if (!equipment || typeof equipment !== 'object') {
    return (
      <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem' }}>
        No hay datos de equipo.
      </div>
    );
  }

  const slots = [
    'head', 'neck', 'chest', 'back', 'arms', 'wrists', 'hands',
    'finger1', 'finger2', 'waist', 'legs', 'feet', 'wield', 'held'
  ];

  const slotNames: Record<string, string> = {
    head: 'Cabeza', neck: 'Cuello', chest: 'Pecho', back: 'Espalda', arms: 'Brazos', wrists: 'Muñecas', hands: 'Manos',
    finger1: 'Dedo 1', finger2: 'Dedo 2', waist: 'Cintura', legs: 'Piernas', feet: 'Pies', wield: 'Arma', held: 'Sostenido'
  };

  return (
    <div className="list-container fade-in">
      {slots.map(slot => {
        const item = equipment[slot];
        return (
          <div
            key={slot}
            className={`list-item ${item ? 'active' : ''}`}
            onClick={() => item && setSelectedItem(item)}
            style={{ cursor: item ? 'pointer' : 'default' }}
          >
            <div className="list-item-content">
              <div className="list-item-sub">{slotNames[slot] || slot}</div>
              <div className="list-item-title" style={{ color: item ? 'var(--text-bright)' : 'var(--text-muted)' }}>
                {item ? item.name : '— vacío —'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
