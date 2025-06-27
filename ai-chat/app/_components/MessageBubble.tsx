import { Message } from '../_types';
import { agents } from '../agents';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const agent = agents.find(a => a.id === message.agentId);
  
  if (!agent) return null;

  return (
    <div className="flex items-start space-x-3 mb-4">
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${agent.color} flex-shrink-0`}>
        {agent.name}
      </div>
      <div className="flex-1">
        <div className="bg-white rounded-lg p-3 shadow-sm border">
          <p className="text-gray-800">{message.content}</p>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Round {message.round}</span>
            <span>{message.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}