import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface HotbarSlot {
  command: string;
  label: string;
}

interface HotbarProps {
  onCommand: (cmd: string) => void;
  inCombat?: boolean;
  pulse?: any[];
}

export interface HotbarHandle {
  setSlot: (num: number, cmd: string) => void;
  clearSlot: (num: number) => void;
}

const familyColors: Record<string, string> = {
  'Danza': 'var(--green-bright)',
  'Copla': 'var(--yellow)',
  'Nota': 'var(--red)',
  'Épica': 'var(--cyan)'
};

const Hotbar = forwardRef<HotbarHandle, HotbarProps>(({ onCommand, inCombat, pulse }, ref) => {
  const [slots, setSlots] = useState<(HotbarSlot | null)[]>(new Array(10).fill(null));

  useEffect(() => {
    const saved = localStorage.getItem('inheron_hotbar_v2');
    if (saved) {
      try {
        setSlots(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load hotbar', e);
      }
    }
  }, []);

  const saveHotbar = (newSlots: (HotbarSlot | null)[]) => {
    setSlots(newSlots);
    localStorage.setItem('inheron_hotbar_v2', JSON.stringify(newSlots));
  };

  useImperativeHandle(ref, () => ({
    setSlot: (num: number, cmd: string) => {
      const newSlots = [...slots];
      const index = num - 1;
      if (index >= 0 && index < 10) {
        newSlots[index] = { 
          command: cmd, 
          label: cmd.length > 10 ? cmd.substring(0, 8) + '..' : cmd 
        };
        saveHotbar(newSlots);
      }
    },
    clearSlot: (num: number) => {
      const newSlots = [...slots];
      const index = num - 1;
      if (index >= 0 && index < 10) {
        newSlots[index] = null;
        saveHotbar(newSlots);
      }
    }
  }));

  const handleSlotClick = (index: number) => {
    const slot = slots[index];
    if (slot) {
      onCommand(slot.command);
    }
  };

  if (inCombat) {
    const renderPulse = pulse || [];
    return (
      <div className="hotbar-container pulse-bar" style={{ borderColor: 'var(--red)', boxShadow: '0 0 10px rgba(255,0,0,0.2)' }}>
        <div style={{ position: 'absolute', top: '-10px', left: '10px', background: 'var(--bg-panel)', padding: '0 5px', fontSize: '0.65rem', color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Pulso de Combate
        </div>
        {renderPulse.map((skill, i) => {
          const color = skill.family ? familyColors[skill.family] || 'var(--gold)' : 'var(--text-main)';
          return (
            <div 
              key={i} 
              className="hotbar-slot occupied pulse-slot"
              onClick={() => onCommand(`pulse ${i + 1}`)}
              style={{ borderColor: color }}
              title={`${skill.name} [${skill.energyCost} EN]\nFamilia: ${skill.family || 'Ninguna'}\n${skill.description}`}
            >
              <span className="slot-number" style={{ color }}>{i + 1}</span>
              <div className="slot-cmd-label" style={{ color: 'var(--text-bright)' }}>{skill.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="hotbar-container">
      {slots.map((slot, i) => (
        <div 
          key={i} 
          className={`hotbar-slot ${slot ? 'occupied' : 'empty'}`}
          onClick={() => handleSlotClick(i)}
          title={slot ? `Command: ${slot.command}` : `Slot ${i+1} (Empty)`}
        >
          <span className="slot-number">{i + 1}</span>
          {slot ? (
            <div className="slot-cmd-label">{slot.label}</div>
          ) : (
            <div className="slot-plus">.</div>
          )}
        </div>
      ))}
    </div>
  );
});

Hotbar.displayName = 'Hotbar';
export default Hotbar;
