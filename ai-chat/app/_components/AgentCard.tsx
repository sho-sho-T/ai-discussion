import type { Agent } from "../_types"

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: (agent: Agent) => void
  onHover?: (element: HTMLElement, isHover: boolean) => void
  className?: string
}

const AgentCard = ({ agent, isSelected, onSelect, onHover, className = "" }: AgentCardProps) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    onHover?.(e.currentTarget, true)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    onHover?.(e.currentTarget, false)
  }

  return (
    <div
      className={`agent-card-glass p-6 cursor-pointer ${
        isSelected ? "ring-2 ring-blue-400 ring-opacity-50" : ""
      } ${className}`}
      onClick={() => onSelect(agent)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
            agent.name === "小学生" ? "bg-yellow-100 text-yellow-800" :
            agent.name === "厨二病" ? "bg-purple-100 text-purple-800" :
            agent.name === "悪魔" ? "bg-red-100 text-red-800" :
            agent.name === "資産家" ? "bg-green-100 text-green-800" :
            agent.name === "プロダクトマネージャー" ? "bg-blue-100 text-blue-800" :
            agent.name === "デザイナー" ? "bg-pink-100 text-pink-800" :
            agent.name === "高齢者" ? "bg-gray-100 text-gray-800" :
            agent.name === "開発者" ? "bg-indigo-100 text-indigo-800" :
            agent.name === "QAエンジニア" ? "bg-orange-100 text-orange-800" :
            agent.name === "インフラエンジニア" ? "bg-cyan-100 text-cyan-800" :
            agent.name === "データエンジニア" ? "bg-emerald-100 text-emerald-800" :
            "bg-rose-100 text-rose-800"
          }`}>
            {agent.name}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{agent.description}</h3>
        </div>
        <input 
          type="checkbox" 
          className="radio-custom"
          checked={isSelected}
          onChange={() => {}}
        />
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {agent.personality}
      </p>
    </div>
  )
}

export default AgentCard
