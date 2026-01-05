import type { RefObject } from "react";

export interface Message {
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  avatar?: string;
}

export interface ChatProps{
    wsRef: RefObject<WebSocket | null>;
}
