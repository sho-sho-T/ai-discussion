export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Team Chat
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            複数のAIエージェントがチームで協力して、あなたの質問に答えます
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="text-center text-gray-500">
            環境構築完了！開発を開始してください。
          </div>
        </div>
      </div>
    </div>
  )
}