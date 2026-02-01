import WebSocket, { WebSocketServer } from "ws";
import { verifyToken } from "./auth/jwt";
import { ServerModel } from "./models/server.model";
import url from "url";

type AuthedSocket = WebSocket & {
  user?: { userId: string; email: string };
  serverIds?: Set<string>;
};

type ClientMessage =
  | { type: "subscribe"; payload: { serverId: string } }
  | { type: "unsubscribe"; payload: { serverId: string } };

export const wss = new WebSocketServer({
  port: 8081,
  verifyClient: (info, done) => {
    try {
      const parsed = url.parse(info.req.url!, true);
      const token = parsed.query.token as string;

      const user = verifyToken(token);
      (info.req as any).user = user;

      done(true);
    } catch {
      done(false, 401, "Unauthorized");
    }
  },
});

wss.on("connection", (ws: AuthedSocket, req: any) => {
  ws.user = req.user;
  ws.serverIds = new Set();

  ws.on("message", async (raw) => {
    const msg = JSON.parse(raw.toString());

    if (msg.type === "subscribe") {
      const { serverId } = msg.payload;

      if(serverId !== "all") {
        // ownership check
        const server = await ServerModel.findOne({
          _id: serverId,
          ownerId: ws.user!.userId,
        });
  
        if (!server) {
          ws.send(JSON.stringify({
            type: "error",
            payload: { message: "Access denied" },
          }));
          return;
        }
  
        ws.serverIds!.add(serverId);
      } else {
        const servers = await ServerModel.find({
          ownerId: ws.user!.userId
        });

        servers.map((s) => ws.serverIds!.add(s._id.toString()));
      }
    }

    if (msg.type === "unsubscribe") {
      ws.serverIds!.delete(msg.payload.serverId);
    }
  });
});

export function broadcastToServer(
  serverId: string,
  msg: any
) {
  const data = JSON.stringify({ ...msg, event: true });

  wss.clients.forEach((client) => {
    const ws = client as AuthedSocket;

    if (
      ws.readyState === WebSocket.OPEN &&
      ws.serverIds?.has(serverId)
    ) {
      ws.send(data);
    }
  });
}

