import React, { useEffect, useRef } from 'react';
import { AnsiUp } from 'ansi_up';
import type { ContextEntity } from './ContextPanel';

const ansiUp = new AnsiUp();
ansiUp.use_classes = false;
ansiUp.escape_html = false;

// ──────────────────────────────────────────────────────────────
// MUD Color Tags Parsing
// ──────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  red: '#e53935',
  blue: '#3b82f6',
  green: '#4ade80',
  yellow: '#facc15',
  cyan: '#2dd4bf',
  magenta: '#d946ef',
  white: '#f3f4f6',
  gray: '#9ca3af',
  grey: '#9ca3af',
  black: '#111827',
  gold: '#c9a84c'
};

function parseMudColors(text: string): string {
  let parsed = text;
  for (const [color, hex] of Object.entries(COLOR_MAP)) {
    const openRe = new RegExp(`<${color}>`, 'gi');
    const closeRe = new RegExp(`</${color}>`, 'gi');
    parsed = parsed.replace(openRe, `<span style="color: ${hex};">`).replace(closeRe, '</span>');
  }
  return parsed;
}

interface Log {
  id: number;
  type: string;
  text: string;
  isAnsi?: boolean;
}

interface Props {
  logs: Log[];
  onEntityClick?: (entity: ContextEntity) => void;
  onCommand?: (cmd: string) => void;
  npcs?: any[];
}

// ──────────────────────────────────────────────────────────────
// Exits line detection: [Exits: north south east]
// Handles locked/closed exits wrapped in parens: (north)
// ──────────────────────────────────────────────────────────────
const EXITS_RE = /\[\s*Exits:\s+([^\]]+)\]/i;
const DIRECTIONS = new Set(['north','south','east','west','up','down','northeast','northwest','southeast','southwest','ne','nw','se','sw']);

function parseExits(text: string): string[] | null {
  // Strip ANSI/HTML first
  const clean = text.replace(/<[^>]+>/g, '').replace(/\x1b\[[0-9;]*m/g, '').trim();
  const m = EXITS_RE.exec(clean);
  if (!m) return null;
  const parts = m[1].trim().split(/\s+/);
  // Check at least one is a known direction (or parenthesised one)
  const hasDir = parts.some(p => DIRECTIONS.has(p.replace(/[()]/g, '').toLowerCase()));
  return hasDir ? parts : null;
}

const DIR_LABELS: Record<string, string> = {
  north: 'N', south: 'S', east: 'E', west: 'O',
  up: 'U', down: 'D',
  northeast: 'NE', northwest: 'NO', southeast: 'SE', southwest: 'SO',
  ne: 'NE', nw: 'NO', se: 'SE', sw: 'SO',
};

function ExitsLine({ exits, onCommand }: { exits: string[]; onCommand?: (cmd: string) => void }) {
  return (
    <div className="log-entry text exits-line">
      <span className="exits-label">Exits:</span>
      {exits.map((exit, i) => {
        const locked = exit.startsWith('(') && exit.endsWith(')');
        const dir = exit.replace(/[()]/g, '').toLowerCase();
        const short = DIR_LABELS[dir] ?? dir;
        return (
          <button
            key={i}
            className={`exit-btn ${locked ? 'exit-locked' : ''}`}
            onClick={() => !locked && onCommand?.(dir)}
            title={locked ? `${dir} (locked/closed)` : dir}
            disabled={locked}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Entity detection: [NPC] / [Item] / [Player]
// ──────────────────────────────────────────────────────────────
const ENTITY_RE = /\[([^\]]+)\]\s+(.+)/;

function extractColor(html: string): string | undefined {
  const m = html.match(/color:\s*([^;"']+)/i);
  return m ? m[1].trim() : undefined;
}

function parseEntity(rawText: string): ContextEntity | null {
  const html = ansiUp.ansi_to_html(rawText);
  const clean = html.replace(/<[^>]+>/g, '').replace(/\x1b\[[0-9;]*m/g, '');
  const m = ENTITY_RE.exec(clean);
  if (!m) return null;

  const labelRaw = m[1].trim().toLowerCase();
  let name = m[2].trim();
  
  // If the name contains a dash (e.g. "Name - Description"), take only the name
  if (name.includes(' - ')) {
    name = name.split(' - ')[0].trim();
  }
  
  const keyword = name.replace(/^\[[!?]\]\s*/, '').split(/\s+/)[0].toLowerCase();

  let type: ContextEntity['type'] | null = null;
  if      (labelRaw.includes('npc') || labelRaw.includes('mob'))        type = 'npc';
  else if (labelRaw.includes('item') || labelRaw.includes('resource'))  type = 'item';
  else if (labelRaw.includes('player'))                                  type = 'player';

  if (!type) return null;

  const bracketHtml = html.match(/\[([^\]]+)\]/)?.[1] ?? '';
  const accentColor = extractColor(bracketHtml);

  return { type, name, keyword, raw: rawText, accentColor };
}

// ──────────────────────────────────────────────────────────────
// Single log line renderer
// ──────────────────────────────────────────────────────────────
function LogLine({
  log,
  onEntityClick,
  onCommand,
  npcs
}: {
  log: Log;
  onEntityClick?: (e: ContextEntity) => void;
  onCommand?: (cmd: string) => void;
  npcs?: any[];
}) {
  // 1. Exits line?
  if (onCommand) {
    const exits = parseExits(log.text);
    if (exits) return <ExitsLine exits={exits} onCommand={onCommand} />;
  }

  const handleTextClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'B' || target.tagName === 'STRONG') {
      const text = target.innerText.trim();
      const keyword = text.split(/\s+/)[0].toLowerCase();
      
      if (keyword && onCommand) {
        // Try to find if this keyword belongs to an NPC in the room
        const npcMatch = npcs?.find(n => 
          n.name.toLowerCase().includes(keyword) || 
          n.id.toLowerCase().includes(keyword)
        );

        let cmd = `look ${keyword}`;
        if (npcMatch) {
          const isMob = npcMatch.isMob || npcMatch.flags?.includes('MOB');
          if (!isMob) {
            const isVendor = npcMatch.behaviors?.shop || 
                            npcMatch.behaviors?.vendor || 
                            npcMatch.name.toLowerCase().includes('vendedor') ||
                            npcMatch.name.toLowerCase().includes('mercader');
            cmd = isVendor ? `list ${keyword}` : `talk ${keyword}`;
          }
        }

        onCommand(cmd);
        e.stopPropagation(); // Prevent parent clicks (like entity menu)
      }
    }
  };

  // 2. Entity line?
  const entity = onEntityClick ? parseEntity(log.text) : null;
  if (entity && log.isAnsi) {
    return (
      <div
        className={`log-entry ${log.type} entity-link`}
        dangerouslySetInnerHTML={{ __html: parseMudColors(ansiUp.ansi_to_html(log.text)) }}
        onClick={(e) => {
          handleTextClick(e);
          if (!e.defaultPrevented) onEntityClick!(entity);
        }}
        title={`Click to interact with ${entity.name}`}
        style={{ cursor: 'pointer' }}
      />
    );
  }

  return (
    <div 
      className={`log-entry ${log.type}`} 
      dangerouslySetInnerHTML={{ __html: parseMudColors(log.isAnsi ? ansiUp.ansi_to_html(log.text) : log.text) }} 
      onClick={handleTextClick}
    />
  );
}

// ──────────────────────────────────────────────────────────────
export default function Viewport({ logs, onEntityClick, onCommand, npcs }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="viewport-container" ref={containerRef}>
      {logs.map(log => (
        <LogLine 
          key={log.id} 
          log={log} 
          onEntityClick={onEntityClick} 
          onCommand={onCommand} 
          npcs={npcs}
        />
      ))}
    </div>
  );
}
