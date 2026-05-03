import React, { useEffect } from 'react';

interface SlideInPanelProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideInPanel({ title, isOpen, onClose, children }: SlideInPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div className={`slide-in-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="slide-in-panel-container" onClick={(e) => e.stopPropagation()}>
        <div className="slide-in-header">
          <div className="slide-in-title">{title}</div>
          <button className="close-btn" onClick={onClose} aria-label="Close panel">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="slide-in-content">
          {children}
        </div>
      </div>
    </div>
  );
}
