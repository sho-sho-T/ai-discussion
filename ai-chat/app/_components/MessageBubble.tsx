import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Message } from "../_types"
import { agents } from "../agents"

interface MessageBubbleProps {
  message: Message
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const agent = agents.find(a => a.id === message.agentId)

  if (!agent) return null

  return (
    <div className="flex items-start space-x-3 mb-4">
      <Avatar className="mt-1">
        <AvatarFallback className={`text-xs font-medium ${agent.color}`}>
          {agent.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className={`${agent.color} text-xs`}>
            {agent.name}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Round {message.round}
          </span>
        </div>
        <Card className="shadow-sm">
          <CardContent className="pt-4">
            <p className="text-foreground leading-relaxed">{message.content}</p>
            <div className="mt-3 pt-2 border-t">
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default MessageBubble
