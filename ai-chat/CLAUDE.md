# AI Team Chat

複数のAIエージェントが協働してユーザーの質問に答える、グループチャット風のWebアプリケーションです。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Google Gemini API
- Vercel (デプロイ)
- Biome (TypeScriptの静的解析ツール)
- Vercel-AI SDK (Gemini APIのラッパー)
- Mastra (https://github.com/mastra-ai/mastra)

## プロジェクト構造

```
 app/
    ├── layout.tsx
    ├── page.tsx
    ├── globals.css
    └── api/chat/route.ts
    ├── _components/
    ├── _lib/
    ├── agents.ts
    ├── gemini.ts
    └── mockData.ts
    └── _types/index.ts
```

## 環境変数

`.env.local` に以下を設定:
```
GEMINI_API_KEY=your_google_ai_studio_api_key
```

## コードスタイル

- TypeScript strict mode使用
- ESLintルール遵守
- Tailwind CSS優先、カスタムCSS最小限
- コンポーネントは関数宣言でdefault export
- propsの型定義は必須
- async/awaitでPromise処理

## 機能仕様

### エージェント
以下のエージェントが使用できます。
- 小学生
- 厨二病
- 悪魔
- 資産家
- プロダクトマネージャー
- デザイナー
- 高齢者
- 開発者
- QAエンジニア
- インフラエンジニア
- データエンジニア
- 頓珍漢なおじさん

### 会話フロー
1. ユーザーがエージェント選択（1-3体）
2. 質問入力
3. 各エージェントが3ラウンドでランダム順に議論
4. 最終結論を表示

### UI/UX
- グループチャット風のメッセージ表示
- リアルタイムでの議論進行
- ローディング状態表示
- エージェント別の色分け

## ワークフロー

- 開発時はモックデータ使用（APIキーなしでも動作）
- APIエラーはシンプルなアラート表示
- コンポーネント作成後は型チェック実行
- レスポンシブデザイン対応必須
- Vercel環境変数設定後にデプロイ