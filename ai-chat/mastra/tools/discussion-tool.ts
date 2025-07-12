import { createTool } from "@mastra/core/tools"
import { z } from "zod"

export const discussionTool = createTool({
  id: "analyze-discussion",
  description: "議論の内容を分析し、要点をまとめるツール",
  inputSchema: z.object({
    question: z.string().describe("議論のテーマとなる質問"),
    previousMessages: z.array(z.string()).describe("これまでの議論内容"),
    round: z.number().describe("現在のラウンド数"),
  }),
  outputSchema: z.object({
    summary: z.string().describe("議論の要点"),
    keyPoints: z.array(z.string()).describe("重要なポイント"),
    nextActions: z.array(z.string()).describe("次に議論すべき点"),
  }),
  execute: async ({ context: { question, previousMessages, round } }) => {
    // 議論内容の分析ロジック
    const summary = `第${round}ラウンドまでの議論では、「${question}」について様々な視点から検討されています。`

    const keyPoints = [
      "複数の専門的視点からの意見",
      "実装面での課題と解決策",
      "ユーザー体験への配慮",
      "リスクと対策の検討",
    ]

    const nextActions = [
      "具体的な実装方法の検討",
      "コストと効果の分析",
      "スケジュールの策定",
    ]

    return {
      summary,
      keyPoints,
      nextActions,
    }
  },
})

export const questionAnalysisTool = createTool({
  id: "analyze-question",
  description: "質問を分析し、議論のポイントを特定するツール",
  inputSchema: z.object({
    question: z.string().describe("分析対象の質問"),
  }),
  outputSchema: z.object({
    category: z.string().describe("質問のカテゴリ"),
    complexity: z
      .enum(["simple", "medium", "complex"])
      .describe("質問の複雑さ"),
    suggestedAgents: z
      .array(z.string())
      .describe("この質問に適したエージェント"),
    keyTopics: z.array(z.string()).describe("議論すべき主要トピック"),
  }),
  execute: async ({ context: { question } }) => {
    // 質問分析ロジック
    let category = "general"
    let complexity: "simple" | "medium" | "complex" = "medium"
    let suggestedAgents: string[] = []
    let keyTopics: string[] = []

    if (
      question.includes("技術") ||
      question.includes("開発") ||
      question.includes("システム")
    ) {
      category = "technical"
      suggestedAgents = ["developer", "infra", "qa"]
      keyTopics = ["技術選定", "実装方法", "パフォーマンス", "セキュリティ"]
    } else if (
      question.includes("ビジネス") ||
      question.includes("収益") ||
      question.includes("投資")
    ) {
      category = "business"
      suggestedAgents = ["rich", "pm"]
      keyTopics = ["収益性", "コスト", "ROI", "マーケット"]
    } else if (
      question.includes("デザイン") ||
      question.includes("UI") ||
      question.includes("UX")
    ) {
      category = "design"
      suggestedAgents = ["designer", "pm"]
      keyTopics = ["ユーザビリティ", "視覚的魅力", "アクセシビリティ"]
    }

    if (
      question.length > 100 ||
      question.includes("複数") ||
      question.includes("複雑")
    ) {
      complexity = "complex"
    } else if (question.length < 30) {
      complexity = "simple"
    }

    return {
      category,
      complexity,
      suggestedAgents,
      keyTopics,
    }
  },
})
