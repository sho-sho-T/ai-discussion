"use client"

import { useState } from "react"
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

const Home = () => {
  const [selectedAgents, setSelectedAgents] = useState<Agent[]>([])
  const [question, setQuestion] = useState("")
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI Team Chat
          </h1>
          <p className="text-muted-foreground text-lg">
            複数のAIエージェントが協働してあなたの質問に答えます
          </p>
        </header>

        {!chatSession ? (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>新しいディスカッション</CardTitle>
              <CardDescription>
                質問を入力し、協働するAIエージェントを選択してください
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  質問を入力してください
                </label>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  className="w-full p-4 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                  rows={3}
                  placeholder="AIエージェントに相談したいことを入力してください..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  エージェントを選択してください（1-3体）
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgents.some(a => a.id === agent.id)}
                      onSelect={handleAgentSelect}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  選択済み: {selectedAgents.length}/3
                </p>
              </div>

              <Button
                onClick={startDiscussion}
                disabled={
                  !question.trim() || selectedAgents.length === 0 || isLoading
                }
                className="w-full"
                size="lg"
              >
                {isLoading
                  ? "ディスカッション開始中..."
                  : "ディスカッションを開始"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
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
