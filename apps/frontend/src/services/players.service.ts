import api from "@/lib/api";
import { Player } from "@/lib/types";

interface RawPlayer {
    uuid: string;
    name: string;
    reason?: string;
}

interface PlayersResponse {
    whitelist: RawPlayer[];
    ops: RawPlayer[];
    bans: RawPlayer[];
    online: RawPlayer[];
}

function mapPlayers(res: PlayersResponse): Player[] {
    const map = new Map<string, Player>();

    const ensure = (p: RawPlayer) => {
      if (!map.has(p.uuid)) {
        map.set(p.uuid, {
          uuid: p.uuid,
          username: p.name,

          isWhitelisted: false,
          isOp: false,
          isBanned: false,
          isOnline: false,
        });
      }

      return map.get(p.uuid)!;
    };

    for (const p of res.whitelist) {
      ensure(p).isWhitelisted = true;
    }

    for (const p of res.ops) {
      ensure(p).isOp = true;
    }

    for (const p of res.online) {
      ensure(p).isOnline = true;
    }

    for (const p of res.bans) {
      const player = ensure(p);
      player.isBanned = true;
      player.banReason = p.reason;
    }

    return Array.from(map.values());
}


/**
 * GET /servers/:id/players
 */
export async function getPlayers(serverId: string): Promise<Player[]> {
    const { data } = await api.get<PlayersResponse>(
      `/servers/${serverId}/players`
    );

    return mapPlayers(data);
}

/**
 * POST /servers/:id/players/ban
 */
export async function banPlayer(
  serverId: string,
  payload: {
    uuid: string;
    username: string;
    reason?: string;
  }
) {
  await api.post(`/servers/${serverId}/players/ban`, payload);
}

/**
 * POST /servers/:id/players/unban
 */
export async function unbanPlayer(serverId: string, uuid: string) {
  await api.post(`/servers/${serverId}/players/unban`, { uuid });
}

/**
 * POST /servers/:id/players/kick
 */
export async function kickPlayer(serverId: string, username: string) {
  await api.post(`/servers/${serverId}/players/kick`, { username });
}

/**
 * POST /servers/:id/players/op
 */
export async function setOp(
  serverId: string,
  payload: {
    uuid: string;
    username: string;
  }
) {
  await api.post(`/servers/${serverId}/players/op`, payload);
}

/**
 * POST /servers/:id/players/deop
 */
export async function removeOp(serverId: string, uuid: string) {
  await api.post(`/servers/${serverId}/players/deop`, { uuid });
}

/**
 * POST /servers/:id/players/whitelist
 */
export async function addToWhitelist(
  serverId: string,
  payload: {
    uuid: string;
    username: string;
  }
) {
  await api.post(`/servers/${serverId}/players/whitelist`, payload);
}

/**
 * DELETE /servers/:id/players/whitelist/:uuid
 */
export async function removeFromWhitelist(
  serverId: string,
  uuid: string
) {
  await api.delete(`/servers/${serverId}/players/whitelist/${uuid}`);
}
