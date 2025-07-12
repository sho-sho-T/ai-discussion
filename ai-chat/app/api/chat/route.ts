import { type NextRequest, NextResponse } from "next/server"
import { mastra } from "../../../mastra"
import { agents } from "../../agents"
import { generateMockResponse, generateMockSummary } from "../../mockData"
import { MastraAgentName } from "@/mastra/agents/agents"

// エージェントIDとMastraエージェントのマッピング
const agentMapping: Record<string, MastraAgentName> = {
  elementary: "elementaryAgent",
  chuuni: "chuuniAgent",
  devil: "devilAgent",
  rich: "richAgent",
  pm: "pmAgent",
  designer: "designerAgent",
  elderly: "elderlyAgent",
  developer: "developerAgent",
  qa: "qaAgent",
  infra: "infraAgent",
  data: "dataAgent",
  confused: "confusedAgent",
}

async function generateMastraAgentResponse(
  agentId: string,
  question: string,
  previousMessages: string[],
  round: number,
  sessionId: string
): Promise<string> {
  const mastraAgentName = agentMapping[agentId]
  if (!mastraAgentName) {
    throw new Error(`Unknown agent ID: ${agentId}`)
  }

  const agent = mastra.getAgent(mastraAgentName)
  if (!agent) {
    throw new Error(`Mastra agent not found: ${mastraAgentName}`)
  }

  const contextMessage = `
質問: ${question}

これまでの議論:
${previousMessages.join("\n")}

現在は第${round}ラウンドです。
他の参加者の意見も踏まえて、あなたらしい視点で回答してください。
`

  try {
    const response = await agent.generate(
      [{ role: "user", content: contextMessage }],
      {
        resourceId: "chat-session",
        threadId: sessionId,
        maxSteps: 1,
      }
    )

    return response.text
  } catch (error) {
    console.error(
      `Error generating Mastra response for agent ${agentId}:`,
      error
    )
    throw error
  }
}

async function generateMastraFinalSummary(
  question: string,
  allMessages: string[],
  sessionId: string
): Promise<string> {
  // 適当なエージェント（例：PM）を使って最終まとめを生成
  const agent = mastra.getAgent("pmAgent")
  if (!agent) {
    throw new Error("PM agent not found for summary generation")
  }

  const summaryPrompt = `
以下の議論を踏まえて、質問に対する最終的な結論をまとめてください。

質問: ${question}

議論の内容:
${allMessages.join("\n")}

各エージェントの意見を統合し、バランスの取れた結論を300文字程度でまとめてください。
実用的で具体的なアドバイスを含めてください。
`

  try {
    const response = await agent.generate(
      [{ role: "user", content: summaryPrompt }],
      {
        resourceId: "chat-session",
        threadId: `${sessionId}-summary`,
        maxSteps: 1,
      }
    )

    return response.text
  } catch (error) {
    console.error("Error generating Mastra summary:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      question,
      selectedAgentIds,
      messages,
      round,
      useMockData,
      generateSummary,
    } = await request.json()

    if (!question || !selectedAgentIds || !Array.isArray(selectedAgentIds)) {
      return NextResponse.json(
        { success: false, error: "Invalid request parameters" },
        { status: 400 }
      )
    }

    const selectedAgents = agents.filter(agent =>
      selectedAgentIds.includes(agent.id)
    )

    if (selectedAgents.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid agents selected" },
        { status: 400 }
      )
    }

    // モックデータ使用モードの場合
    if (useMockData) {
      const responses = selectedAgents.map(agent => ({
        agentId: agent.id,
        content: generateMockResponse(agent.id, question),
        timestamp: new Date().toISOString(),
      }))

      let finalSummary = null
      if (generateSummary && round >= 3) {
        finalSummary = generateMockSummary(question, messages || [])
      }

      return NextResponse.json({
        success: true,
        data: {
          responses,
          round,
          isComplete: round >= 3,
          finalSummary,
        },
      })
    }

    // 実際のMastra API使用
    const previousMessages =
      messages?.map(
        (m: any) =>
          `${agents.find(a => a.id === m.agentId)?.name || "Agent"}: ${m.content}`
      ) || []

    const responses = await Promise.all(
      selectedAgents.map(async agent => {
        try {
          const content = await generateMastraAgentResponse(
            agent.id,
            question,
            previousMessages,
            round,
            request.headers.get("x-session-id") || Date.now().toString()
          )
          return {
            agentId: agent.id,
            content,
            timestamp: new Date().toISOString(),
          }
        } catch (error) {
          console.error(
            `Error generating Mastra response for agent ${agent.id}:`,
            error
          )
          return {
            agentId: agent.id,
            content: `申し訳ありません。${agent.name}からの回答を生成できませんでした。`,
            timestamp: new Date().toISOString(),
          }
        }
      })
    )

    let finalSummary = null
    if (generateSummary && round >= 3) {
      const allMessages =
        messages?.map(
          (m: any) =>
            `${agents.find(a => a.id === m.agentId)?.name || "Agent"}: ${m.content}`
        ) || []
      try {
        finalSummary = await generateMastraFinalSummary(
          question,
          allMessages,
          request.headers.get("x-session-id") || Date.now().toString()
        )
      } catch (error) {
        console.error("Failed to generate Mastra summary:", error)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        responses,
        round,
        isComplete: round >= 3,
        finalSummary,
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      message: "AI Team Chat API is running",
      availableAgents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
      })),
    },
  })
}
