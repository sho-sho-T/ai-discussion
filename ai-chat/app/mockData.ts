import type { Agent, ChatSession, Message } from "./_types"
import { agents } from "./agents"

export const mockMessages: Message[] = [
  {
    id: "1",
    agentId: "elementary",
    content:
      "うーん、これってどういうことなんだろう？みんなで一緒に考えてみよう！",
    timestamp: new Date("2024-01-01T10:00:00"),
    round: 1,
  },
  {
    id: "2",
    agentId: "developer",
    content:
      "技術的な観点から分析すると、まずはアーキテクチャの設計が重要ですね。スケーラビリティを考慮した実装が必要です。",
    timestamp: new Date("2024-01-01T10:01:00"),
    round: 1,
  },
  {
    id: "3",
    agentId: "chuuni",
    content:
      "フッ...この程度の問題など、我が深淵なる知識の前では些細なことに過ぎない。真の解決策を教えてやろう。",
    timestamp: new Date("2024-01-01T10:02:00"),
    round: 1,
  },
  {
    id: "4",
    agentId: "elementary",
    content: "あ、そうか！それって○○みたいな感じなんだね。分かりやすい！",
    timestamp: new Date("2024-01-01T10:03:00"),
    round: 2,
  },
  {
    id: "5",
    agentId: "pm",
    content:
      "ユーザーのニーズを考えると、MVPとして最小限の機能から始めるのが良いでしょう。データを見ながら段階的に改善していきます。",
    timestamp: new Date("2024-01-01T10:04:00"),
    round: 2,
  },
  {
    id: "6",
    agentId: "devil",
    content:
      "ちょっと待て、そんな甘い考えで大丈夫か？リスクを見落としてないか？失敗したときのことも考えろよ。",
    timestamp: new Date("2024-01-01T10:05:00"),
    round: 2,
  },
]

export const mockChatSession: ChatSession = {
  id: "session-1",
  question: "AIを活用したチャットアプリケーションを作る際の注意点は？",
  selectedAgents: [
    agents.find(a => a.id === "elementary")!,
    agents.find(a => a.id === "developer")!,
    agents.find(a => a.id === "chuuni")!,
    agents.find(a => a.id === "pm")!,
    agents.find(a => a.id === "devil")!,
  ],
  messages: mockMessages,
  status: "discussing",
  currentRound: 2,
  maxRounds: 3,
}

export const mockCompletedSession: ChatSession = {
  id: "session-2",
  question: "リモートワークを効率化するためのツールは？",
  selectedAgents: [
    agents.find(a => a.id === "pm")!,
    agents.find(a => a.id === "designer")!,
    agents.find(a => a.id === "developer")!,
  ],
  messages: [
    {
      id: "10",
      agentId: "pm",
      content:
        "リモートワークの効率化は、コミュニケーションとタスク管理が鍵になります。",
      timestamp: new Date("2024-01-01T09:00:00"),
      round: 1,
    },
    {
      id: "11",
      agentId: "designer",
      content: "ユーザー体験を考えると、直感的なインターフェースが重要ですね。",
      timestamp: new Date("2024-01-01T09:01:00"),
      round: 1,
    },
    {
      id: "12",
      agentId: "developer",
      content: "SlackやNotionなどの既存ツールの連携も重要な要素です。",
      timestamp: new Date("2024-01-01T09:02:00"),
      round: 1,
    },
  ],
  status: "completed",
  currentRound: 3,
  maxRounds: 3,
}

export const getRandomAgents = (count: number): Agent[] => {
  const shuffled = [...agents].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const generateMockResponse = (
  agentId: string,
  question: string
): string => {
  const responses: Record<string, string[]> = {
    elementary: [
      "えーっと、これってどういうことなんだろう？",
      "わかった！つまり○○ってことなんだね！",
      "みんなで一緒に考えてみよう！",
      "そうか、なるほど〜！",
      "これって難しいけど、がんばって考えてみるね！",
    ],
    chuuni: [
      "フッ...この程度の問題など、我が深淵なる知識の前では些細なことに過ぎない。",
      "愚かな...真の解決策を教えてやろう。",
      "この禁断の知識を使えば、すべてが解決する。",
      "ククク...面白い、実に面白い問題だ。",
      "我が知識の結晶を披露する時が来たようだな。",
    ],
    devil: [
      "ちょっと待て、そんな甘い考えで大丈夫か？",
      "リスクを見落としてないか？",
      "失敗したときのことも考えろよ。",
      "そんなうまい話があるわけないだろう。",
      "ほら、やっぱり問題が出てきたじゃないか。",
    ],
    rich: [
      "これは投資として見ると面白いね。",
      "ROIを考えると...",
      "コストと収益のバランスが重要だ。",
      "マーケットの動向を見極めよう。",
    ],
    pm: [
      "ユーザーのニーズを考えると...",
      "データを見ながら段階的に改善していきます。",
      "KPIを設定して効果測定しましょう。",
      "MVPとして最小限の機能から始めるのが良いでしょう。",
      "ステークホルダーとの合意形成が重要ですね。",
    ],
    designer: [
      "ユーザビリティの観点から見ると...",
      "直感的なインターフェースが必要ですね。",
      "ユーザージャーニーを考慮して設計しましょう。",
      "美しく使いやすいデザインを心がけます。",
    ],
    elderly: [
      "私の経験から言うと...",
      "昔からよく言われることですが...",
      "若い頃はよく分からなかったが、今思えば...",
      "人生経験から学んだことがあります。",
    ],
    developer: [
      "技術的な観点から分析すると...",
      "アーキテクチャの設計が重要ですね。",
      "パフォーマンスを考慮した実装が必要です。",
      "セキュリティも忘れずに考慮しましょう。",
      "テストの自動化も重要な要素です。",
    ],
    qa: [
      "品質の観点から見ると...",
      "このケースでバグが発生する可能性があります。",
      "テストケースを追加する必要がありますね。",
      "品質基準を満たしているか確認しましょう。",
    ],
    infra: [
      "システムの安定性を考えると...",
      "スケーラビリティが重要ですね。",
      "パフォーマンスの監視が必要です。",
      "障害対応の準備も忘れずに。",
    ],
    data: [
      "データから見えてくるのは...",
      "統計的に分析すると...",
      "データドリブンな意思決定が重要です。",
      "メトリクスを定義して測定しましょう。",
    ],
    confused: [
      "えーっと、つまりどういうことかなあ？",
      "ちょっとよく分からないけど...",
      "あー、それってあれのことかな？",
      "むずかしいねえ、でも面白そう！",
      "そういえば昔似たようなことがあったような...",
    ],
  }

  const agentResponses = responses[agentId] || ["興味深い質問ですね。"]
  return agentResponses[Math.floor(Math.random() * agentResponses.length)]
}

export function generateMockSummary(question: string, messages: any[]): string {
  const summaries = [
    `「${question}」について議論した結果、多角的な視点から検討することが重要であることが分かりました。技術的な実装、ユーザー体験、コスト、リスクなどを総合的に判断し、段階的なアプローチで進めることをお勧めします。`,
    `各エージェントの議論を総合すると、「${question}」に対する答えは一つではありません。様々な観点を考慮し、バランスの取れた解決策を見つけることが大切です。まずは小さく始めて、徐々に改善していく方針が良いでしょう。`,
    `「${question}」についての議論を通じて、問題の複雑さと解決策の多様性が明らかになりました。リスクを適切に管理しながら、ユーザーのニーズに応える実用的なアプローチを取ることが成功の鍵となります。`,
  ]

  return summaries[Math.floor(Math.random() * summaries.length)]
}
