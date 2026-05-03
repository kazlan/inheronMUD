interface QuestDetailProps {
  quest: any;
  onClose: () => void;
  onCommand: (cmd: string) => void;
}

export default function QuestDetail({ quest, onClose, onCommand }: QuestDetailProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!quest) return null;

  const title = quest.title || quest.config?.title || 'Misión Desconocida';
  const desc = quest.description || quest.config?.description || '';
  const questId = quest.id || quest.config?.id || '';
  const objectives = quest.objectives || [];
  const rewards = quest.rewards || {};

  const execAction = (cmd: string, confirm = false) => {
    if (confirm && !window.confirm(`¿Estás seguro de que quieres ${cmd}?`)) return;
    onCommand(cmd);
    onClose();
  };

  return (
    <div className="item-detail fade-in quest-detail-view">
      <button className="item-detail-back" onClick={onClose}>
        ← Volver al Diario
      </button>

      <div className="item-detail-header">
        <h3 className="item-detail-name" style={{ color: 'var(--gold)' }}>{title}</h3>
        {desc && <p className="item-detail-desc" style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>{desc}</p>}
      </div>

      <div className="item-detail-stats">
        <div className="item-actions-title">Objetivos</div>
        {objectives.length > 0 ? (
          objectives.map((obj: any, idx: number) => (
            <div className={`quest-objective-row ${obj.completed ? 'completed' : ''}`} key={obj.id || idx} style={{ marginBottom: '0.6rem', padding: '0.4rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: obj.completed ? 'var(--essence-teal)' : 'var(--text-main)' }}>
                  {obj.completed ? '✓' : '○'} {obj.description}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {obj.currentAmount} / {obj.requiredAmount}
                </span>
              </div>
              {!obj.completed && (
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.1)', marginTop: '4px', width: '100%' }}>
                  <div style={{ height: '100%', background: 'var(--blue-gem)', width: `${(obj.currentAmount / obj.requiredAmount) * 100}%` }}></div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin objetivos específicos.</div>
        )}
      </div>

      {(rewards.experience || rewards.currency || rewards.items) && (
        <div className="item-detail-rewards" style={{ marginTop: '1rem', padding: '0.8rem', border: '1px solid var(--gold-dim)', background: 'rgba(201, 168, 76, 0.05)' }}>
          <div className="item-actions-title" style={{ fontSize: '0.7rem' }}>Recompensas</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.8rem' }}>
            {rewards.experience && <span style={{ color: 'var(--stat-sabiduria)' }}>✧ {rewards.experience} XP</span>}
            {rewards.currency && <span style={{ color: 'var(--gold)' }}>🪙 {rewards.currency} Monedas</span>}
            {rewards.items && rewards.items.length > 0 && <span style={{ color: 'var(--blue-bright)' }}>🎁 {rewards.items.length} Objetos</span>}
          </div>
        </div>
      )}

      <div className="item-detail-actions" style={{ marginTop: '1.5rem' }}>
        <div className="item-actions-title">Acciones</div>
        <button className="item-action-btn" onClick={() => execAction(`quest log ${questId}`)}>
          📖 Consultar Notas
        </button>
        <button className="item-action-btn" onClick={() => execAction(`quest complete ${questId}`)}>
          ✅ Entregar Misión
        </button>
        <div className="item-actions-divider" />
        <button className="item-action-btn danger" onClick={() => execAction(`quest drop ${questId}`, true)}>
          🗑️ Abandonar
        </button>
      </div>
    </div>
  );
}
