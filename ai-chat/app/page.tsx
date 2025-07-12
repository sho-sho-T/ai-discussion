"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useCallback, useRef, useState } from "react"
import AgentCard from "./_components/AgentCard"
import AnimatedButton from "./_components/AnimatedButton"
import ChatInput from "./_components/ChatInput"
import ChatSessionBoard from "./_components/ChatSession"
import { useAgentSelection } from "./_hooks/useAgentSelection"
import type { Agent, ChatSession, Message } from "./_types"
import { agents } from "./agents"

const Home = () => {
  const [question, setQuestion] = useState("")
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTypingAgent, setCurrentTypingAgent] = useState<Agent | null>(
    null
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const { selectedAgents, selectAgent } = useAgentSelection(3)

  const { contextSafe } = useGSAP(
    () => {
      // 初期アニメーション - セレクタ使用
      gsap.set("#header > *", { opacity: 0, y: -100 })
      gsap.set("#chatArea", { opacity: 0, y: 30, scale: 1.2 })
      gsap.set("#startButton", { opacity: 0, y: 20 })
      gsap.set(".agent-card", { opacity: 0, y: 50, scale: 1.5 })

      // ページロードアニメーション
      const tl = gsap.timeline()
      tl.to("#header > *", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
        .to(
          "#chatArea",
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          "#startButton",
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )

      // エージェントカードアニメーション（1秒後）
      gsap.to(".agent-card", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 1,
      })
    },
    { scope: containerRef }
  ) //スコープ設定

  // contextSafeでイベントハンドラ作成
  const handleStartDiscussion = contextSafe(async () => {
    await gsap.to("#startButton", { scale: 0.95, duration: 0.1 })
    gsap.to("#startButton", { scale: 1, duration: 0.2, ease: "back.out(1.7)" })

    // 画面遷移アニメーション
    const tl = gsap.timeline()
    tl.to("#chatArea", {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: "power2.inOut",
    })
      .to(
        "#agentGrid .agent-card",
        {
          opacity: 0,
          y: -20,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "-=0.3"
      )
      .to(
        "#startButton",
        {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "-=0.2"
      )

    await new Promise(resolve => setTimeout(resolve, 500))
    await startDiscussion()
  })

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
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
        // エージェントが話し始めることを示す
        setCurrentTypingAgent(agent)
        await new Promise(resolve => setTimeout(resolve, 1000))

        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-session-id": session.id,
            },
            body: JSON.stringify({
              question: session.question,
              selectedAgentIds: [agent.id],
              messages: session.messages,
              round,
              useMockData: false, // Mastraエージェントを使用
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

            // エージェントのタイピング状態をクリア
            setCurrentTypingAgent(null)

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
          } else {
            setCurrentTypingAgent(null)
          }
        } catch (error) {
          console.error("Discussion error:", error)
          setCurrentTypingAgent(null)
        }
      }
    }

    setChatSession(prev => (prev ? { ...prev, status: "completed" } : null))
    setCurrentTypingAgent(null)
    setIsLoading(false)
  }

  const resetChat = useCallback(() => {
    setChatSession(null)
    setQuestion("")
    setCurrentTypingAgent(null)

    // ホーム画面の要素を再表示するアニメーション
    setTimeout(() => {
      const tl = gsap.timeline()
      tl.set("#chatArea", { opacity: 0, scale: 0.9 })
        .set(".agent-card", { opacity: 0, y: 20 })
        .set("#startButton", { opacity: 0, y: 20 })
        .to("#chatArea", {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        })
        .to(
          ".agent-card",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        )
        .to(
          "#startButton",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.2"
        )
    }, 100)
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 text-center py-12" id="header">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 opacity-0">
          AI Team Chat
        </h1>
        <p className="text-gray-600 text-lg opacity-0">
          複数のAIエージェントが協働してあなたの質問に答えます
        </p>
        <div className="flex justify-center items-center gap-2 mt-4 opacity-0">
          <span className="pulse-dot" />
          <span className="text-sm text-gray-500">
            {selectedAgents.length}つのAIエージェントがアクティブ
          </span>
        </div>
      </header>

      {/* Main Container */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {!chatSession ? (
          <>
            {/* Discussion Card */}
            <div
              className="glass-morphism rounded-3xl p-8 mb-12 shadow-2xl opacity-0"
              id="chatArea"
            >
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  新しいディスカッション
                </h2>
                <div className="tag-badge relative overflow-hidden">
                  <span className="relative z-10">✨ インテリジェント</span>
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>

              <p className="text-gray-600 mb-8">
                質問を入力し、協働するAIエージェントを選択してください
              </p>

              {/* Chat Input */}
              <ChatInput
                value={question}
                onChange={setQuestion}
                placeholder="AIエージェントに相談したいことを入力してください..."
              />

              {/* Agent Selection */}
              <div className="mb-8">
                <p className="text-gray-700 font-medium mb-6 flex items-center gap-2">
                  エージェントを選択してください
                  <span className="text-sm text-gray-500">(1-3人)</span>
                </p>

                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  id="agentGrid"
                >
                  {agents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgents.some(a => a.id === agent.id)}
                      onSelect={selectAgent}
                      className="agent-card"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Start Discussion Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 glass-morphism">
              <div className="container mx-auto max-w-6xl">
                <AnimatedButton
                  onPress={startDiscussion}
                  disabled={
                    !question.trim() || selectedAgents.length === 0 || isLoading
                  }
                  className="w-full md:w-auto mx-auto block opacity-0"
                  id="startButton"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {isLoading
                    ? "ディスカッション開始中..."
                    : "ディスカッションを開始する"}
                </AnimatedButton>
              </div>
            </div>
          </>
        ) : (
          <ChatSessionBoard
            chatSession={chatSession}
            isLoading={isLoading}
            onReset={resetChat}
            currentTypingAgent={currentTypingAgent}
          />
        )}
      </div>
    </div>
  )
}

export default Home
