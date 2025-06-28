import { type NextRequest, NextResponse } from "next/server"
import { agents } from "../../agents"
import { generateAgentResponse, generateFinalConclusion } from "../../gemini"
import { generateMockResponse, generateMockSummary } from "../../mockData"

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

    // 実際のGemini API使用
    const previousMessages =
      messages?.map((m: any) => `${m.agentName}: ${m.content}`) || []

    const responses = await Promise.all(
      selectedAgents.map(async agent => {
        try {
          const content = await generateAgentResponse(
            agent,
            question,
            previousMessages,
            round
          )
          return {
            agentId: agent.id,
            content,
            timestamp: new Date().toISOString(),
          }
        } catch (error) {
          console.error(
            `Error generating response for agent ${agent.id}:`,
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
        finalSummary = await generateFinalConclusion(question, allMessages)
      } catch (error) {
        console.error("Failed to generate summary:", error)
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
