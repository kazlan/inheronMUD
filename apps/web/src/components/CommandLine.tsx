import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';

interface CommandLineProps {
  onCommand: (cmd: string) => void;
}

export interface CommandLineHandle {
  focus: () => void;
}

const CommandLine = forwardRef<CommandLineHandle, CommandLineProps>(({ onCommand }, ref) => {
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

  return (
    <form className="command-line-wrapper" onSubmit={handleSubmit}>
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
