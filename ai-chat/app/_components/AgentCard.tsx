import { memo, useRef } from "react"
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { Agent } from "../_types"

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: (agent: Agent) => void
  className?: string
}

// エージェント名に対応するスタイルマップ
const agentStyles: Record<string, string> = {
  小学生: "bg-yellow-100 text-yellow-800",
  厨二病: "bg-purple-100 text-purple-800",
  悪魔: "bg-red-100 text-red-800",
  資産家: "bg-green-100 text-green-800",
  プロダクトマネージャー: "bg-blue-100 text-blue-800",
  デザイナー: "bg-pink-100 text-pink-800",
  高齢者: "bg-gray-100 text-gray-800",
  開発者: "bg-indigo-100 text-indigo-800",
  QAエンジニア: "bg-orange-100 text-orange-800",
  インフラエンジニア: "bg-cyan-100 text-cyan-800",
  データエンジニア: "bg-emerald-100 text-emerald-800",
}

const AgentCard = memo(
  ({
    agent,
    isSelected,
    onSelect,
    className = "",
  }: AgentCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null)
    
    const { contextSafe } = useGSAP(() => {
      // 選択状態のアニメーション
      gsap.to(cardRef.current, {
        scale: isSelected ? 1.05 : 1,
        boxShadow: isSelected 
          ? "0 10px 30px rgba(59, 130, 246, 0.3)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      })
    }, { 
      scope: cardRef,
      dependencies: [isSelected] // 選択状態変更時に再実行
    })
    
    // contextSafeでホバーアニメーション
    const handleMouseEnter = contextSafe(() => {
      if (!isSelected) {
        gsap.to(cardRef.current, { 
          y: -5, 
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out"
        })
      }
    })
    
    const handleMouseLeave = contextSafe(() => {
      if (!isSelected) {
        gsap.to(cardRef.current, { 
          y: 2, 
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        })
      }
    })
    
    const handleClick = contextSafe(() => {
      onSelect(agent)
    })

    return (
      <div
        ref={cardRef}
        className={`agent-card-glass p-6 cursor-pointer ${
          isSelected ? "ring-2 ring-blue-400 ring-opacity-50" : ""
        } ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                agentStyles[agent.name] || "bg-rose-100 text-rose-800"
              }`}
            >
              {agent.name}
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              {agent.description}
            </h3>
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
)

AgentCard.displayName = "AgentCard"

export default AgentCard
