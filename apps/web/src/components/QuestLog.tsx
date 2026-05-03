import React, { useState } from 'react';
import QuestDetail from './QuestDetail';

interface QuestLogProps {
  quests?: any; // Can be array or CronicaViva object
  onCommand: (cmd: string) => void;
}

export default function QuestLog({ quests, onCommand }: QuestLogProps) {
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [questAcceptId, setQuestAcceptId] = useState('');

  // Normalize data: CronicaViva object or Legacy Array
  const isCronica = quests && typeof quests === 'object' && !Array.isArray(quests);
  const activeQuests = isCronica ? (quests.activeQuests || []) : (quests || []);
  const activeArcs = isCronica ? (quests.activeArcs || []) : [];
  const memoryFlags = isCronica ? (quests.memoryFlags || []) : [];

  if (selectedQuest) {
    return (
      <QuestDetail 
        quest={selectedQuest} 
        onClose={() => setSelectedQuest(null)} 
        onCommand={onCommand} 
      />
    );
  }

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (questAcceptId.trim()) {
      onCommand(`quest accept ${questAcceptId.trim()}`);
      setQuestAcceptId('');
    }
  };

  return (
    <div className="list-container fade-in quest-log-container">
      {/* Search / Accept Section */}
      <div className="glass-panel" style={{ marginBottom: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tablón de Anuncios</span>
          <button 
            className="item-action-btn" 
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
            onClick={() => onCommand('quest list')}
          >
            🔍 Buscar Quests
          </button>
        </div>
        <form onSubmit={handleAccept} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            className="command-input" 
            placeholder="ID de la misión..." 
            value={questAcceptId}
            onChange={(e) => setQuestAcceptId(e.target.value)}
            style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', border: '1px solid var(--gold-dim)', background: 'rgba(0,0,0,0.2)' }}
          />
          <button type="submit" className="quick-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
            Aceptar
          </button>
        </form>
      </div>

      {/* Story Arcs Section */}
      {activeArcs.length > 0 && (
        <>
          <div className="item-actions-title" style={{ color: 'var(--arcane-purple)', textShadow: '0 0 8px var(--arcane-glow)' }}>✦ Arcos de Historia</div>
          <div style={{ marginBottom: '1rem' }}>
            {activeArcs.map((arc: any) => (
              <div key={arc.id} className="list-item arc-item" style={{ borderLeftColor: 'var(--arcane-purple)', background: 'rgba(168, 85, 247, 0.05)' }}>
                <div className="list-item-content">
                  <div className="list-item-title">{arc.title}</div>
                  <div className="list-item-sub">{arc.description}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--arcane-purple)', marginTop: '4px' }}>
                    Progreso: {arc.currentQuestIndex + 1} / {arc.questIds.length}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Active Quests Section */}
      <div className="item-actions-title">📜 Misiones Activas</div>
      
      {(!activeQuests || activeQuests.length === 0) ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', fontStyle: 'italic' }}>
          Tu diario de aventuras está vacío por ahora.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {activeQuests.map((q: any, i: number) => {
            const title = q.title || q.config?.title || 'Misión Desconocida';
            const desc = q.description || q.config?.description || '';
            const status = q.status || 'ACTIVE';
            
            return (
              <div 
                key={q.id || i} 
                className={`list-item quest-status-${status.toLowerCase()}`}
                onClick={() => setSelectedQuest(q)}
              >
                <div className="list-item-content">
                  <div className="list-item-title">
                    <span style={{ color: 'var(--gold)', marginRight: '0.4rem' }}>★</span>
                    {title}
                  </div>
                  <div className="list-item-sub">{desc}</div>
                </div>
                {status === 'READY_TO_TURN_IN' && (
                  <div className="quest-ready-badge">¡LISTA!</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Memory Flags (Crónica Viva) Section - Subtle */}
      {memoryFlags.length > 0 && (
        <div style={{ marginTop: '2rem', opacity: 0.6 }}>
          <div className="item-actions-title" style={{ fontSize: '0.65rem' }}>✧ Crónica Viva (Eventos)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {memoryFlags.slice(-5).map((flag: string) => (
              <span key={flag} style={{ fontSize: '0.6rem', padding: '2px 6px', background: 'var(--gold-dim)', borderRadius: '10px', color: 'var(--text-bright)' }}>
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
            {memoryFlags.length > 5 && <span style={{ fontSize: '0.6rem' }}>...</span>}
          </div>
        </div>
      )}
    </div>
  );
}
