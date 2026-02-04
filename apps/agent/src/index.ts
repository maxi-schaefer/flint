import WebSocket, { WebSocketServer } from "ws";
import { manager } from "./manager";
import { handleAgentMessage } from "./handlers/handleMessage";

const wss = new WebSocketServer({ port: 9001 });

console.log(`Agent started on ws://localhost:9001`);

// Manager Events
manager.on("log", (id, line) => {
    broadcast({
        type: "log",
        payload: { id, line }
    });
});

manager.on("status", (id, status) => {
    broadcast({
        type: "status",
        payload: { id, status }
    })
});

manager.on("stats", (payload) => {
    broadcast({
        type: "stats",
        payload
    });
});

/**
 * Websocket broadcast function
 * @param msg A message Object
 */
function broadcast(msg: any) {
    const data = JSON.stringify({ event: true, ...msg });
    wss.clients.forEach((client) => {
        if(client.readyState === WebSocket.OPEN) client.send(data);
    });
}

// Websocket start
wss.on("connection", (ws) => {
    console.log("[agent] Backend connected");

    ws.on("message", async (raw) => {
        const msg = JSON.parse(raw.toString());

        try {
            const result = await handleAgentMessage(msg);

            ws.send(JSON.stringify({
                requestId: msg.requestId,
                type: msg.type,
                payload: result
            }))
        } catch (error: any) {
            ws.send(JSON.stringify({
                requestId: msg.requestId,
                error: error.message
            }))
        }
    })
})