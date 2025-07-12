import { memo, useRef, useEffect, useState } from "react"
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import type { ChatSession as ChatSessionType, Agent } from "../_types"
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaRegCircleCheck } from "react-icons/fa6";

interface ChatSessionProps {
  chatSession: ChatSessionType
  isLoading: boolean
  onReset: () => void
  currentTypingAgent?: Agent | null
}

const ChatSession = memo(({
  chatSession,
  isLoading,
  onReset,
  currentTypingAgent
}: ChatSessionProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [displayedMessages, setDisplayedMessages] = useState<typeof chatSession.messages>([])

  const { contextSafe } = useGSAP(() => {
    // 初期エントランスアニメーション
    gsap.set([headerRef.current, messagesRef.current, footerRef.current], { 
      opacity: 0, 
      y: 30 
    })
    
    const tl = gsap.timeline()
    tl.to(headerRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      ease: "power3.out" 
    })
    .to(messagesRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      ease: "power3.out" 
    }, "-=0.3")
    .to(footerRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 0.4, 
      ease: "power3.out" 
    }, "-=0.2")
  }, { scope: containerRef })

  // メッセージの段階的表示
  useEffect(() => {
    if (chatSession.messages.length > displayedMessages.length) {
      const newMessage = chatSession.messages[displayedMessages.length]
      
      // 少し遅延してからメッセージを表示
      const timer = setTimeout(() => {
        setDisplayedMessages(prev => [...prev, newMessage])
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [chatSession.messages.length, displayedMessages.length])

  // リセット時の処理
  useEffect(() => {
    if (chatSession.messages.length === 0) {
      setDisplayedMessages([])
    }
  }, [chatSession.messages.length])

  const handleReset = contextSafe(() => {
    // リセットアニメーション
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        onReset()
        // リセット後に初期状態を復元
        gsap.set([headerRef.current, messagesRef.current, footerRef.current], {
          opacity: 1,
          y: 0,
          scale: 1
        })
      }
    })
  })

  const getRoundProgress = () => {
    return Math.min((chatSession.currentRound / chatSession.maxRounds) * 100, 100)
  }

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* 左側カラム: 質問と結論 */}
        <div className="w-full lg:w-2/5 space-y-6">
          {/* 質問エリア */}
          <div ref={headerRef} className="glass-morphism rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AiOutlineQuestionCircle color="blue" size={20}/>
              あなたの質問
            </h2>
            <div className="bg-white/50 rounded-xl p-4">
              <p className="text-gray-800 font-medium leading-relaxed">
                {chatSession.question}
              </p>
            </div>
          </div>

          {/* 最終結論エリア */}
          {chatSession.status === "completed" && chatSession.finalSummary && (
            <div className="glass-morphism rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                <div className="w-5 h-5 text-gray-800 rounded-full flex items-center justify-center">
                  <FaRegCircleCheck color="blue" size={25}/>
                </div>
                結論
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200/50">
                <p className="text-blue-800 whitespace-pre-line leading-relaxed font-medium">
                  {chatSession.finalSummary}
                </p>
              </div>
            </div>
          )}

          {/* 新しい質問ボタン */}
          <div ref={footerRef} className="glass-morphism rounded-3xl p-6 shadow-2xl">
            <Button
              onClick={handleReset}
              variant="secondary"
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              size="lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              新しい質問をする
            </Button>
          </div>
        </div>

        {/* 右側カラム: ディスカッションエリア */}
        <div className="w-full lg:w-3/5 space-y-6">
          {/* ディスカッションヘッダー */}
          <div className="glass-morphism rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="pulse-dot" />
                ディスカッション進行中
              </h2>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white/50">
                  Round {chatSession.currentRound}/{chatSession.maxRounds}
                </Badge>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${getRoundProgress()}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {chatSession.selectedAgents.map((agent, index) => (
                <Badge
                  key={agent.id}
                  variant="secondary"
                  className={`${agent.color} transform transition-all duration-300 hover:scale-105`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {agent.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* メッセージエリア */}
          <div ref={messagesRef} className="glass-morphism rounded-3xl p-6 shadow-2xl">
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
              {displayedMessages.map((message, index) => (
                <MessageBubble 
                  key={message.id} 
                  message={message}
                  animationDelay={index * 200}
                />
              ))}
              
              {currentTypingAgent && isLoading && (
                <TypingIndicator agent={currentTypingAgent} />
              )}
              
              {isLoading && !currentTypingAgent && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    <span className="text-gray-600 font-medium">
                      次のエージェントを準備中...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 完了時の表示 */}
            {chatSession.status === "completed" && (
              <div className="mt-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-green-800 text-lg">
                        ディスカッション完了！
                      </h3>
                    </div>
                    <p className="text-green-700">
                      {chatSession.maxRounds}ラウンドのディスカッションが完了しました。左側に最終結論が表示されています。
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

ChatSession.displayName = "ChatSession"

export default ChatSession