import { Agent } from '../_types';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: (agent: Agent) => void;
}

const AgentCard = ({ agent, isSelected, onSelect }: AgentCardProps) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
      onClick={() => onSelect(agent)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${agent.color}`}>
          {agent.name}
        </span>
        {isSelected && (
          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
      <p className="text-xs text-gray-500">{agent.personality}</p>
    </div>
  );
}

export default AgentCard;