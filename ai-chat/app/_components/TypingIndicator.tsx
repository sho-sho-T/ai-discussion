import { memo, useRef } from "react"
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Agent } from "../_types"

interface TypingIndicatorProps {
  agent: Agent
  className?: string
}

const TypingIndicator = memo(({ agent, className = "" }: TypingIndicatorProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // エントランスアニメーション
    gsap.fromTo(containerRef.current, 
      { 
        opacity: 0, 
        y: 20, 
        scale: 0.95 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
      }
    )

    // タイピングドットのアニメーション
    const dots = dotsRef.current?.children
    if (dots) {
      gsap.to(dots, {
        y: -4,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.1,
        repeat: -1,
        yoyo: true
      })
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={`flex items-start space-x-3 mb-4 ${className}`}>
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
          <span className="text-xs text-muted-foreground animate-pulse">
            考え中...
          </span>
        </div>
        <Card className="shadow-sm bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200/50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-1">
              <div ref={dotsRef} className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              </div>
              <span className="text-sm text-blue-600 ml-2">議論中...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

TypingIndicator.displayName = "TypingIndicator"

export default TypingIndicator