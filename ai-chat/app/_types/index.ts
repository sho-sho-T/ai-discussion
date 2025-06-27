export interface Agent {
  id: string;
  name: string;
  personality: string;
  color: string;
  description: string;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  round: number;
}

export interface ChatSession {
  id: string;
  question: string;
  selectedAgents: Agent[];
  messages: Message[];
  status: 'idle' | 'discussing' | 'completed';
  currentRound: number;
  maxRounds: number;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}