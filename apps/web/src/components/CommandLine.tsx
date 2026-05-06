import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

interface CommandLineProps {
  onCommand: (cmd: string) => void;
  attributes?: any;
}

export interface CommandLineHandle {
  focus: () => void;
}

const CommandLine = forwardRef<CommandLineHandle, CommandLineProps>(({ onCommand, attributes }, ref) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory(prev => [input.trim(), ...prev]);
    setHistoryIdx(-1);
    onCommand(input.trim());
    setInput('');
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistoryIdx(prev => {
        const next = Math.min(prev + 1, history.length - 1);
        if (history[next]) setInput(history[next]);
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistoryIdx(prev => {
        const next = prev - 1;
        if (next < 0) {
          setInput('');
          return -1;
        }
        if (history[next]) setInput(history[next]);
        return next;
      });
    }
  }, [history]);

  let statusRender = null;
  if (attributes && attributes.promptSettings) {
    const p = attributes.promptSettings;
    const derived = attributes.derived || {};
    const hp = derived.hpCurrent ?? attributes.health?.current ?? 0;
    const hpMax = derived.hpMax ?? attributes.health?.max ?? 100;
    const en = derived.energyCurrent ?? attributes.energy?.current ?? 0;
    const enMax = derived.energyMax ?? attributes.energy?.max ?? 100;
    const isBard = attributes.class === 'bardo_cronica_viva';
    
    const emojiHp = p.emoji ? '❤' : 'HP:';
    const emojiEn = p.emoji ? (isBard ? '🎵' : '✦') : (isBard ? 'Voz:' : 'EN:');
    const emojiTrama = p.emoji ? '📜' : 'Trama:';
    const emojiAplauso = p.emoji ? '👏' : 'Aplauso:';
    
    const showBardState = isBard && attributes.bardState && (p.trama || p.aplauso);

    statusRender = (
      <div style={{ display: 'flex', gap: '8px', padding: '0 8px', fontSize: '0.8rem', opacity: 0.8, alignItems: 'center' }}>
        {p.hp && <span style={{ color: 'var(--red)' }} title="Salud">{emojiHp} {hp}/{hpMax}</span>}
        {p.resource && <span style={{ color: 'var(--green-bright)' }} title="Recurso">{emojiEn} {en}/{enMax}</span>}
        {showBardState && (
          <div style={{ display: 'flex', gap: '6px', marginLeft: '4px', borderLeft: '1px solid var(--gold-dim)', paddingLeft: '8px' }}>
            {p.trama && <span style={{ color: 'var(--cyan)' }} title="Trama">{emojiTrama} {attributes.bardState.tramaMax || 1}</span>}
            {p.aplauso && <span style={{ color: 'var(--magenta)' }} title="Aplausos">{emojiAplauso} {attributes.bardState.aplauso || 0}</span>}
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="command-line-wrapper" onSubmit={handleSubmit}>
      {statusRender}
      <span className="command-prompt">⟩</span>
      <input
        ref={inputRef}
        type="text"
        className="command-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter command..."
        autoComplete="off"
        spellCheck={false}
      />
    </form>
  );
});

CommandLine.displayName = 'CommandLine';

export default CommandLine;
