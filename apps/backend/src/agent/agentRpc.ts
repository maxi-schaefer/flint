import { v4 as uuid } from "uuid";
import { agent } from "../agentClient"

type Resolver = {
    resolve: (value: any) => void;
    reject: (value: any) => void;
};

const pending = new Map<string, Resolver>();

agent.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    if(msg.requestId && pending.has(msg.requestId)) {
        const { resolve, reject } = pending.get(msg.requestId)!;
        pending.delete(msg.requestId);

        if(msg.error) reject(new Error(msg.error));
        else resolve(msg.payload)
    }
});

export function agentRequest<T = any> (
    type: string,
    payload?: any,
    timeoutMs = 5000
): Promise<T> {
    return new Promise((resolve, reject) => {
        const requestId = uuid();

        pending.set(requestId, { resolve, reject });

        agent.send(
            JSON.stringify({
                requestId,
                type,
                payload
            })
        );

        setTimeout(() => {
            if(pending.has(requestId)) {
                pending.delete(requestId);
                reject(new Error("Agent request timeout"));
            }
        }, timeoutMs)
    })
}