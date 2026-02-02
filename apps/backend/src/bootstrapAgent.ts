import { agentRequest } from "./agent/agentRpc";
import { ServerModel } from "./models/server.model";

export async function bootstrapAgent() {
    const servers = await ServerModel.find({}, "_id path"); // only _id and path
    const payload = servers.map(s => ({ id: s._id.toString(), path: s.path }));

    // Send to agent
    await Promise.all(payload.map(s => 
        agentRequest("registerServerPath", { id: s.id, path: s.path })
    ));

    return { ok: true, count: payload.length };
}