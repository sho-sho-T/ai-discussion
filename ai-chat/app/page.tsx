"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AgentCard from "./_components/AgentCard"
import MessageBubble from "./_components/MessageBubble"
import type { Agent, ChatSession, Message } from "./_types"
import { agents } from "./agents"
import { useGSAP } from "./_hooks/useGSAP"

const Home = () => {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [question, setQuestion] = useState("")
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const questionInputRef = useRef<HTMLTextAreaElement>(null)
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const gsapAnimations = useGSAP()

  useEffect(() => {
    gsapAnimations.animatePageLoad()
    
    const timer = setTimeout(() => {
      gsapAnimations.animateAgentCards()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgents(prev => {
      const isSelected = prev.some(a => a.id === agent.id)
      if (isSelected) {
        return prev.filter(a => a.id !== agent.id)
      }
      if (prev.length < 3) {
        return [...prev, agent]
      }
      return prev
    })
  }

  const handleAgentCardHover = (element: HTMLElement, isHover: boolean) => {
    gsapAnimations.animateCardHover(element, isHover)
  }

  const handleAgentCardSelect = (agent: Agent, element: HTMLElement) => {
    const isSelected = selectedAgents.some(a => a.id === agent.id)
    handleAgentSelect(agent)
    gsapAnimations.animateAgentSelection(element, !isSelected)
  }

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const handleStartDiscussion = async () => {
    if (startButtonRef.current) {
      gsapAnimations.animateButtonPress(startButtonRef.current)
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    startDiscussion()
  }

  const startDiscussion = async () => {
    if (!question.trim() || selectedAgents.length === 0) return

    setIsLoading(true)
    const session: ChatSession = {
      id: Date.now().toString(),
      question,
      selectedAgents,
      messages: [],
      status: "discussing",
      currentRound: 1,
      maxRounds: 3,
    }
    setChatSession(session)

    for (let round = 1; round <= 3; round++) {
      const shuffledAgents = shuffleArray(selectedAgents)

      for (const agent of shuffledAgents) {
        await new Promise(resolve => setTimeout(resolve, 1000))

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: session.question,
              selectedAgentIds: [agent.id],
              messages: session.messages,
              round,
              useMockData: true,
              generateSummary: round === 3,
            }),
          })

          const data = await response.json()

          if (data.success && data.data.responses[0]) {
            const newMessage: Message = {
              id: Date.now().toString(),
              agentId: agent.id,
              content: data.data.responses[0].content,
              timestamp: new Date(),
              round,
            }

            setChatSession(prev =>
              prev
                ? {
                    ...prev,
                    messages: [...prev.messages, newMessage],
                    currentRound: round,
                    finalSummary: data.data.finalSummary || prev.finalSummary,
                  }
                : null
            )
          }
        } catch (error) {
          console.error("Discussion error:", error)
        }
      }
    }

    setChatSession(prev => (prev ? { ...prev, status: "completed" } : null))
    setIsLoading(false)
  }

  const resetChat = () => {
    setChatSession(null)
    setQuestion("")
    setSelectedAgents([])
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Orbs */}
      <div className="floating-orb w-[300px] h-[300px] -top-[100px] -left-[100px]" />
      <div className="floating-orb w-[400px] h-[400px] -bottom-[200px] -right-[200px]" />
      <div className="floating-orb w-[250px] h-[250px] top-[50%] left-[70%]" />
      
      {/* Header */}
      <header className="relative z-10 text-center py-12" id="header">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 opacity-0">
          AI Team Chat
        </h1>
        <p className="text-gray-600 text-lg opacity-0">複数のAIエージェントが協働してあなたの質問に答えます</p>
        <div className="flex justify-center items-center gap-2 mt-4 opacity-0">
          <span className="pulse-dot"></span>
          <span className="text-sm text-gray-500">{selectedAgents.length}つのAIエージェントがアクティブ</span>
        </div>
      </header>
      
      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {!chatSession ? (
          <>
          {/* Discussion Card */}
          <div className="glass-morphism rounded-3xl p-8 mb-12 shadow-2xl opacity-0" id="chatArea">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">新しいディスカッション</h2>
              <div className="tag-badge relative overflow-hidden">
                <span className="relative z-10">✨ インテリジェント</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">質問を入力し、協働するAIエージェントを選択してください</p>
            
            {/* Chat Input */}
            <div className="chat-input-glass rounded-3xl p-6 mb-10 shadow-lg">
              <textarea 
                ref={questionInputRef}
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onFocus={() => gsapAnimations.animateInputFocus(questionInputRef.current!, true)}
                onBlur={() => gsapAnimations.animateInputFocus(questionInputRef.current!, false)}
                placeholder="AIエージェントに相談したいことを入力してください..."
                className="w-full bg-transparent outline-none resize-none text-gray-700 placeholder-gray-400"
                rows={3}
              />
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-3">
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-400">{question.length} / 1000</span>
              </div>
            </div>
            
            {/* Agent Selection */}
            <div className="mb-8">
              <p className="text-gray-700 font-medium mb-6 flex items-center gap-2">
                エージェントを選択してください
                <span className="text-sm text-gray-500">(1-3体)</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="agentGrid">
                {agents.map(agent => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    isSelected={selectedAgents.some(a => a.id === agent.id)}
                    onSelect={handleAgentSelect}
                    onHover={handleAgentCardHover}
                    className="agent-card gsap-stagger"
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Start Discussion Button */}
          <div className="fixed bottom-0 left-0 right-0 p-6 glass-morphism">
            <div className="container mx-auto max-w-6xl">
              <button 
                ref={startButtonRef}
                onClick={handleStartDiscussion}
                disabled={!question.trim() || selectedAgents.length === 0 || isLoading}
                className="w-full md:w-auto mx-auto block px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed opacity-0"
                id="startButton"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  {isLoading ? "ディスカッション開始中..." : "ディスカッションを開始する"}
                </span>
              </button>
            </div>
          </div>
          </>
        ) : (
          <Card className="glass-effect shadow-2xl rounded-3xl">
            <CardHeader>
              <CardTitle className="text-lg">
                質問: {chatSession.question}
              </CardTitle>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {chatSession.selectedAgents.map(agent => (
                    <Badge
                      key={agent.id}
                      variant="secondary"
                      className={agent.color}
                    >
                      {agent.name}
                    </Badge>
                  ))}
                </div>
                <Badge variant="outline">
                  Round {chatSession.currentRound}/3
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {chatSession.messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    <span className="ml-3 text-muted-foreground">
                      議論中...
                    </span>
                  </div>
                )}
              </div>

              {chatSession.status === "completed" && (
                <div className="space-y-4">
                  {chatSession.finalSummary && (
                    <Card className="bg-primary/5 border-primary/20">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-primary flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          総括回答
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-primary whitespace-pre-line leading-relaxed">
                          {chatSession.finalSummary}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-green-800 mb-2">
                        ディスカッション完了！
                      </h3>
                      <p className="text-green-700 text-sm">
                        3ラウンドのディスカッションが完了しました。上記の議論を参考にしてください。
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Button
                onClick={resetChat}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                新しい質問をする
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Home
