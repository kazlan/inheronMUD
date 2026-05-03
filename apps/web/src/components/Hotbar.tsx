import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface HotbarSlot {
  command: string;
  label: string;
}

interface HotbarProps {
  onCommand: (cmd: string) => void;
}

export interface HotbarHandle {
  setSlot: (num: number, cmd: string) => void;
  clearSlot: (num: number) => void;
}

const Hotbar = forwardRef<HotbarHandle, HotbarProps>(({ onCommand }, ref) => {
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
