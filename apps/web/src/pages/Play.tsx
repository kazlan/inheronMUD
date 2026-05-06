import React, { useState, useCallback, useRef } from 'react';
import CharacterSheet from '../components/CharacterSheet';
import Equipment from '../components/Equipment';
import Viewport from '../components/Viewport';
import CommandLine from '../components/CommandLine';
import type { CommandLineHandle } from '../components/CommandLine';
import QuickPanel from '../components/QuickPanel';
import Inventory from '../components/Inventory';
import QuestLog from '../components/QuestLog';
import SlideInPanel from '../components/SlideInPanel';
import WorldMapOverlay from '../components/WorldMapOverlay';
import ConnectionOverlay from '../components/ConnectionOverlay';
import ContextPanel from '../components/ContextPanel';
import Hotbar from '../components/Hotbar';
import CombatPanel from '../components/CombatPanel';
import PulsePanel from '../components/PulsePanel';
import type { HotbarHandle } from '../components/Hotbar';
import type { ContextEntity } from '../components/ContextPanel';
import useMUD from '../hooks/useMUD';

type PanelType = 'none' | 'inventory' | 'equipment' | 'quests' | 'character' | 'map';

const Play: React.FC = () => {
  const { logs, attributes, quests, inventory, equipment, effects, targets, pulse, room, isConnected, areaMap, visitedRooms, sendCommand, addLog, tickData } = useMUD(`ws://${window.location.hostname}:4001/ws`);
  const [activePanel, setActivePanel] = useState<PanelType>('none');
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLifting, setIsLifting] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<ContextEntity | null>(null);
  const commandLineRef = useRef<CommandLineHandle>(null);
  const hotbarRef = useRef<HotbarHandle>(null);

  const handleCommand = useCallback((cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim();
    if (lowerCmd.startsWith('slot ') || lowerCmd === 'slot') {
      const parts = cmd.split(/\s+/);
      const num = parseInt(parts[1]);
      if (isNaN(num) || num < 1 || num > 10) {
        addLog('system', 'Uso: slot [1-10] [comando] o slot [1-10] clear', false);
        return;
      }
      if (parts[2]?.toLowerCase() === 'clear') {
        hotbarRef.current?.clearSlot(num);
        addLog('system', `Slot ${num} limpiado.`, false);
      } else {
        const action = parts.slice(2).join(' ');
        if (!action) {
          addLog('system', 'Falta el comando para asignar al slot.', false);
          return;
        }
        hotbarRef.current?.setSlot(num, action);
        addLog('system', `Slot ${num} asignado a: "${action}"`, false);
      }
      return;
    }
    sendCommand(cmd);
  }, [sendCommand, addLog]);

  React.useEffect(() => {
    if (!selectedEntity) return;
    const roomChanged = room?.id !== (selectedEntity as any)._roomId;
    if (roomChanged) {
      setSelectedEntity(null);
      return;
    }
    const allRoomEntities = [...(room?.npcs || []), ...(room?.items || [])];
    const match = selectedEntity.uuid 
      ? allRoomEntities.find(ent => ent.uuid === selectedEntity.uuid)
      : allRoomEntities.find(ent => ent.name.toLowerCase().trim() === selectedEntity.name.toLowerCase().trim());
    if (!match) {
      if (!(selectedEntity as any).isInventoryItem) setSelectedEntity(null);
    } else {
      (selectedEntity as any).liveData = match;
      (selectedEntity as any).isRoomItem = true;
    }
  }, [room, selectedEntity]);

  const handleEntityClick = useCallback((entity: ContextEntity) => {
    const enriched = { ...entity };
    const allRoomEntities = [...(room?.npcs || []), ...(room?.items || [])];
    const match = allRoomEntities.find(ent => ent.name.toLowerCase().trim() === entity.name.toLowerCase().trim());
    if (match) {
      (enriched as any).liveData = match;
      (enriched as any).isRoomItem = true;
      enriched.uuid = match.uuid;
    }
    (enriched as any)._roomId = room?.id;
    setSelectedEntity(enriched);

    // Default command logic
    let defaultCmd = `look ${entity.keyword}`;
    if (entity.type === 'npc') {
      const isMob = (enriched as any).liveData?.isMob || entity.raw?.toLowerCase().includes('[mob]');
      if (!isMob) {
        const isVendor = (enriched as any).liveData?.behaviors?.shop || 
                        (enriched as any).liveData?.behaviors?.vendor ||
                        entity.name.toLowerCase().includes('vendedor') ||
                        entity.name.toLowerCase().includes('mercader');
        
        defaultCmd = isVendor ? `list ${entity.keyword}` : `talk ${entity.keyword}`;
      } else {
        defaultCmd = `kill ${entity.keyword}`; // Default for mobs could be kill? Or stay as look.
        // Let's keep it as look for mobs to be safe, or just use what the user asked.
        // User only mentioned NPCs vs Vendors.
      }
    }

    handleCommand(defaultCmd);
    setTimeout(() => commandLineRef.current?.focus(), 50);
  }, [handleCommand, room]);

  const handlePasswordSent = useCallback(() => setIsLifting(true), []);
  const isCharacterLoaded = !!attributes?.name;

  React.useEffect(() => {
    if (isCharacterLoaded) {
      setShowOverlay(false);
      setIsLifting(false);
      setTimeout(() => commandLineRef.current?.focus(), 100);
    }
  }, [isCharacterLoaded]);

  const inCombat = targets && targets.length > 0;

  return (
    <div className="play-root-layout">
      {showOverlay && (
        <ConnectionOverlay 
          isConnected={isConnected} 
          onCommand={handleCommand} 
          logs={logs}
          onPasswordSent={handlePasswordSent}
          isLifting={isLifting}
        />
      )}

      <div className="left-panel">
        {isCharacterLoaded && (
          <CharacterSheet 
            attributes={attributes} 
            effects={attributes.activeEffects?.filter((e: any) => (e.duration || 0) >= 60000)} 
          />
        )}
        {inCombat ? (
          <CombatPanel targets={targets} effects={attributes.activeEffects} onCommand={handleCommand} />
        ) : (
          <ContextPanel
            entity={selectedEntity}
            onCommand={(cmd) => { handleCommand(cmd); commandLineRef.current?.focus(); }}
            onClose={() => setSelectedEntity(null)}
          />
        )}
      </div>

      <div className="center-panel glass-panel" style={{ padding: 0 }}>
        <Viewport 
          logs={logs} 
          onEntityClick={handleEntityClick} 
          onCommand={handleCommand} 
          npcs={room?.npcs}
        />
        <Hotbar 
          ref={hotbarRef} 
          onCommand={handleCommand} 
          inCombat={inCombat} 
          pulse={pulse} 
          effects={attributes.activeEffects?.filter((e: any) => (e.duration || 0) < 60000)} 
        />
        <PulsePanel 
          options={pulse} 
          onOptionClick={(idx) => handleCommand(`pulso ${idx}`)} 
          inCombat={inCombat} 
          activeEffects={attributes.activeEffects}
          targets={targets}
        />
        <CommandLine ref={commandLineRef} onCommand={handleCommand} attributes={attributes} />
      </div>

      <div className="right-panel">
        <QuickPanel 
          onCommand={handleCommand} 
          onOpenPanel={setActivePanel} 
          room={room} 
          inCombat={inCombat} 
          pulse={pulse}
          areaMap={areaMap}
          visitedRooms={visitedRooms}
        />
      </div>

      <SlideInPanel title="⬡ Inventario" isOpen={activePanel === 'inventory'} onClose={() => setActivePanel('none')}>
        <Inventory inventory={inventory} onCommand={handleCommand} />
      </SlideInPanel>
      <SlideInPanel title="⛊ Equipo" isOpen={activePanel === 'equipment'} onClose={() => setActivePanel('none')}>
        <Equipment equipment={equipment} onCommand={handleCommand} />
      </SlideInPanel>

      <WorldMapOverlay 
        isOpen={activePanel === 'map'} 
        onClose={() => setActivePanel('none')} 
        areaMap={areaMap} 
        visitedRooms={visitedRooms} 
        currentRoomId={room?.room?.id || room?.id}
      />

      <SlideInPanel title="📜 Diario de Misiones" isOpen={activePanel === 'quests'} onClose={() => setActivePanel('none')}>
        <QuestLog quests={quests} onCommand={handleCommand} />
      </SlideInPanel>
    </div>
  );
};

export default Play;
