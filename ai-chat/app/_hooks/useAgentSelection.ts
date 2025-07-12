import { useCallback, useState } from "react"
import type { Agent } from "../_types"

const MAX_SELECTION = 3;

export const useAgentSelection = (maxSelection = MAX_SELECTION) => {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  
  const selectAgent = useCallback((agent: Agent) => {
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id)
      if (isSelected) {
        return prev.filter(a => a.id !== agent.id)
      }
      if (prev.length < maxSelection) {
        return [...prev, agent]
      }
      return prev
    })
  }, [maxSelection])
  
  return { selectedAgents, selectAgent, setSelectedAgents }
}