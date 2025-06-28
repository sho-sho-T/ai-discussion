import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Agent } from "../_types"

interface AgentCardProps {
  agent: Agent
  isSelected: boolean
  onSelect: (agent: Agent) => void
}

const AgentCard = ({ agent, isSelected, onSelect }: AgentCardProps) => {
  return (
    <Card
      className={`cursor-pointer transition-all border-2 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-primary/50 hover:shadow-sm"
      }`}
      onClick={() => onSelect(agent)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge
            variant={isSelected ? "default" : "secondary"}
            className={agent.color}
          >
            {agent.name}
          </Badge>
          {isSelected && (
            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-2">
          {agent.description}
        </p>
        <p className="text-xs text-muted-foreground/80">{agent.personality}</p>
      </CardContent>
    </Card>
  )
}

export default AgentCard
