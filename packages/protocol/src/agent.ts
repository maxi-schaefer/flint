export interface AgentMessage<T = any> {
    requestId?: string;
    type: string;
    payload?: T;
    error?: string;
}