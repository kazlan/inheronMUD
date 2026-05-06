import React from 'react';

interface PulseOption {
  name: string;
  reason: string;
  type?: string;
  skillId?: string;
}

interface PulsePanelProps {
  options: PulseOption[];
  onOptionClick: (index: number) => void;
  inCombat: boolean;
}

export default function PulsePanel({ options, onOptionClick, inCombat }: PulsePanelProps) {
  if (!inCombat || options.length === 0) return null;

  const getBucketColor = (type?: string) => {
    switch (type) {
      case 'damage': return 'var(--hp-color)';
      case 'buff': return 'var(--blue-bright)';
      case 'heal': return 'var(--green-bright)';
      case 'utility': return 'var(--gold)';
      case 'reaction': return 'var(--cyan)';
      case 'control': return 'var(--arcane-purple)';
      case 'sustain': return 'var(--gold)';
      case 'environment': return 'var(--green)';
      case 'memory': return 'var(--gold-bright)';
      default: return 'var(--gold)';
    }
  };

  const getBucketIcon = (type?: string) => {
    switch (type) {
      case 'damage': return '🟥';
      case 'buff': return '🟦';
      case 'heal': return '🟩';
      case 'utility': return '◻️';
      case 'reaction': return '⚡';
      case 'control': return '🟪';
      case 'sustain': return '🟨';
      case 'environment': return '🌿';
      case 'memory': return '📜';
      default: return '✨';
    }
  };

  return (
    <div className="pulse-panel fade-in">
      <div className="pulse-header">
        <span className="pulse-icon">⚡</span>
        <span className="pulse-title">PULSO TÁCTICO</span>
      </div>
      <div className="pulse-options">
        {options.map((opt, i) => (
          <button 
            key={i} 
            className="pulse-option-btn glass-panel"
            onClick={() => onOptionClick(i + 1)}
            style={{ '--pulse-color': getBucketColor(opt.type) } as React.CSSProperties}
          >
            <div className="pulse-option-top">
              <span className="pulse-option-icon">{getBucketIcon(opt.type)}</span>
              <span className="pulse-option-index">{i + 1}</span>
              <span className="pulse-option-name">{opt.name}</span>
            </div>
            <div className="pulse-option-reason">{opt.reason}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
