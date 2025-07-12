import { memo, useRef } from "react"
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Message } from "../_types"
import { agents } from "../agents"

interface MessageBubbleProps {
  message: Message
  animationDelay?: number
}

const MessageBubble = memo(({ message, animationDelay = 0 }: MessageBubbleProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const agent = agents.find(a => a.id === message.agentId)

  useGSAP(() => {
    // メッセージのエントランスアニメーション
    gsap.fromTo(containerRef.current, 
      { 
        opacity: 0, 
        y: 30, 
        scale: 0.95 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: animationDelay / 1000 // ms to seconds
      }
    )
  }, { scope: containerRef })

  if (!agent) return null

  return (
    <div ref={containerRef} className="flex items-start space-x-3 mb-4 message-bubble">
      <Avatar className="mt-1 avatar-bounce">
        <AvatarFallback className={`text-xs font-medium ${agent.color}`}>
          {agent.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className={`${agent.color} text-xs badge-glow`}>
            {agent.name}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            Round {message.round}
          </span>
        </div>
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 chat-card">
          <CardContent className="pt-4">
            <p className="text-foreground leading-relaxed">{message.content}</p>
            <div className="mt-3 pt-2 border-t border-gray-100">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

MessageBubble.displayName = "MessageBubble"

export default MessageBubble
