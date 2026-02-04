import { agentRequest } from "../../agent/agentRpc";

export async function getPlayers(serverId: string) {
  return agentRequest("getPlayers", { id: serverId });
}

export function banPlayer(serverId: string, data: {
  uuid: string;
  username: string;
  reason: string;
}) {
    return agentRequest("banPlayer", { id: serverId, ...data });
}

export function unbanPlayer(serverId: string, uuid: string) {
    return agentRequest("unbanPlayer", { id: serverId, uuid });
}

export function kickPlayer(serverId: string, username: string) {
    return agentRequest("kickPlayer", { id: serverId, username });
}

export function addWhitelist(serverId: string, uuid: string, username: string) {
    return agentRequest("addWhitelist", { id: serverId, uuid, username });
}

export function removeWhitelist(serverId: string, uuid: string) {
    return agentRequest("removeWhitelist", { id: serverId, uuid });
}

export function setOp(serverId: string, uuid: string, username: string) {
    return agentRequest("setOp", { id: serverId, uuid, username });
}

export function removeOp(serverId: string, uuid: string) {
    return agentRequest("removeOp", { id: serverId, uuid });
}
