import { GameEngine } from './game-engine';
import { Database } from '../data/database';

export class ChatManager {
  private engine: GameEngine;

  constructor(engine: GameEngine) {
    this.engine = engine;
  }

  say(playerId: string, message: string): any {
    const player = this.engine.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const room = this.engine.getRoom(player.roomId);
    if (!room) return { success: false, message: 'Sala no encontrada.' };

    // Broadcast to room
    this.engine.emit('chat_message', {
      type: 'say',
      sourceId: playerId,
      sourceName: player.name,
      roomId: room.id,
      message
    });

    // Notify NPCs in the room
    const npcs = this.engine.entities.getNPCsInRoom(room.id);
    npcs.forEach(npc => {
      // NPC behavior hook
      if (npc.metadata?.listenRules) {
        // TODO: complex NPC listen logic based on behaviorId
      }
    });

    return { success: true, message: `Dices: "${message}"` };
  }

  tell(playerId: string, targetName: string, message: string): any {
    const player = this.engine.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const targetPlayer = this.engine.entities.getPlayers().find(p => p.name.toLowerCase() === targetName.toLowerCase());
    
    if (targetPlayer) {
      this.engine.emit('chat_message', {
        type: 'tell',
        sourceId: playerId,
        sourceName: player.name,
        targetId: targetPlayer.id,
        message
      });
      return { success: true, message: `Susurras a ${targetPlayer.name}: "${message}"` };
    }

    // Check NPCs in the room
    const npcs = this.engine.entities.getNPCsInRoom(player.roomId);
    const targetNpc = npcs.find(n => n.name.toLowerCase().includes(targetName.toLowerCase()));

    if (targetNpc) {
      this.engine.emit('chat_message', {
        type: 'tell_npc',
        sourceId: playerId,
        sourceName: player.name,
        targetId: targetNpc.id,
        message
      });
      return { success: true, message: `Dices a ${targetNpc.name}: "${message}"` };
    }

    return { success: false, message: `No encuentras a nadie llamado ${targetName}.` };
  }

  yell(playerId: string, message: string): any {
    const player = this.engine.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    // Ideally restrict yell to same area, for now broadcast as a general yell
    this.engine.emit('chat_message', {
      type: 'yell',
      sourceId: playerId,
      sourceName: player.name,
      message
    });

    return { success: true, message: `Gritas: "${message}"` };
  }

  async processAdminCommand(playerId: string, args: string[]): Promise<any> {
    const player = this.engine.getPlayer(playerId);
    if (!player || player.role !== 'ADMIN') {
      return { success: false, message: 'No tienes permisos para usar este comando.' };
    }

    const subcmd = args[0];
    const channelName = args[1];

    if (!subcmd || !channelName) {
      return { success: false, message: 'Uso: channel [create|delete|mute|kick|op] [canal] [jugador?]' };
    }

    const prisma = Database.getInstance();

    if (subcmd === 'create') {
      const existing = await prisma.channel.findUnique({ where: { name: channelName } });
      if (existing) return { success: false, message: 'El canal ya existe.' };

      await prisma.channel.create({
        data: {
          name: channelName,
          ownerId: playerId,
          admins: JSON.stringify([playerId])
        }
      });
      return { success: true, message: `Canal ${channelName} creado.` };
    }

    if (subcmd === 'delete') {
      await prisma.channel.delete({ where: { name: channelName } }).catch(() => {});
      return { success: true, message: `Canal ${channelName} borrado.` };
    }

    const targetName = args[2];
    if (!targetName) return { success: false, message: 'Debes especificar un jugador.' };

    const targetPlayer = this.engine.entities.getPlayers().find(p => p.name.toLowerCase() === targetName.toLowerCase());
    if (!targetPlayer) return { success: false, message: 'Jugador no encontrado.' };

    const channel = await prisma.channel.findUnique({ where: { name: channelName } });
    if (!channel) return { success: false, message: 'Canal no encontrado.' };

    if (subcmd === 'mute') {
      const muted = JSON.parse(channel.muted);
      if (!muted.includes(targetPlayer.id)) muted.push(targetPlayer.id);
      await prisma.channel.update({ where: { name: channelName }, data: { muted: JSON.stringify(muted) } });
      return { success: true, message: `${targetPlayer.name} ha sido silenciado en ${channelName}.` };
    }

    if (subcmd === 'kick') {
      const banned = JSON.parse(channel.banned);
      if (!banned.includes(targetPlayer.id)) banned.push(targetPlayer.id);
      await prisma.channel.update({ where: { name: channelName }, data: { banned: JSON.stringify(banned) } });
      return { success: true, message: `${targetPlayer.name} ha sido expulsado de ${channelName}.` };
    }

    if (subcmd === 'op') {
      const admins = JSON.parse(channel.admins);
      if (!admins.includes(targetPlayer.id)) admins.push(targetPlayer.id);
      await prisma.channel.update({ where: { name: channelName }, data: { admins: JSON.stringify(admins) } });
      return { success: true, message: `${targetPlayer.name} ahora es administrador de ${channelName}.` };
    }

    return { success: false, message: 'Comando no reconocido.' };
  }

  async channelMessage(playerId: string, channelName: string, message: string): Promise<any> {
    const player = this.engine.getPlayer(playerId);
    if (!player) return { success: false, message: 'Jugador no encontrado.' };

    const prisma = Database.getInstance();
    const channel = await prisma.channel.findUnique({ where: { name: channelName } });
    
    if (!channel) return { success: false, message: 'Canal no encontrado.' };

    const banned = JSON.parse(channel.banned);
    if (banned.includes(playerId)) return { success: false, message: 'Estás expulsado de este canal.' };

    const muted = JSON.parse(channel.muted);
    if (muted.includes(playerId)) return { success: false, message: 'Estás silenciado en este canal.' };

    this.engine.emit('chat_message', {
      type: 'channel',
      sourceId: playerId,
      sourceName: player.name,
      channelId: channelName,
      message
    });

    return { success: true, message: `[${channelName}] Tú: ${message}` };
  }
}
