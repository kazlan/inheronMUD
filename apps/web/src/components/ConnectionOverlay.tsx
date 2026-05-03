import React from 'react';
import LoginPanel from './LoginPanel';

interface ConnectionOverlayProps {
  isConnected: boolean;
  onCommand: (cmd: string) => void;
  logs: any[];
  onPasswordSent?: () => void;
  isLifting?: boolean;
}

export default function ConnectionOverlay({ isConnected, onCommand, logs, onPasswordSent, isLifting = false }: ConnectionOverlayProps) {
  return (
    <div className={`connection-overlay ${isLifting ? 'lifting' : ''}`}>
      <div className="overlay-content">
        <div className="overlay-branding">
          <img 
            src="/ui/inheronmud_logo_transparent.png" 
            alt="InheronMUD Logo" 
            className="overlay-logo"
          />
          {!isConnected && (
            <div className="connection-status">
              <span className="status-dot disconnected"></span>
              Connection Lost
            </div>
          )}
        </div>

        <div className="overlay-login-container glass-panel">
          <LoginPanel isConnected={isConnected} onCommand={onCommand} logs={logs} onPasswordSent={onPasswordSent} />
        </div>
        
        <div className="overlay-footer">
          Waiting for the mists of Inheron to clear...
        </div>
      </div>
    </div>
  );
}
