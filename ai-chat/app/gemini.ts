import { GoogleGenerativeAI } from '@google/generative-ai';
import { Agent } from './_types';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateAgentResponse(
  agent: Agent,
  question: string,
  previousMessages: string[],
  round: number
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const systemPrompt = `
あなたは「${agent.name}」として振る舞ってください。

キャラクター設定:
${agent.personality}

これまでの議論:
${previousMessages.join('\n')}

現在は第${round}ラウンドです。
質問: ${question}

${agent.name}として、この質問について議論に参加してください。
他の参加者の意見も踏まえて、あなたらしい視点で回答してください。
回答は200文字以内で簡潔にお願いします。
`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate response from Gemini API');
  }
}

export async function generateFinalConclusion(
  question: string,
  allMessages: string[]
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API key not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const systemPrompt = `
以下の議論を踏まえて、質問に対する最終的な結論をまとめてください。

質問: ${question}

議論の内容:
${allMessages.join('\n')}

各エージェントの意見を統合し、バランスの取れた結論を300文字程度でまとめてください。
実用的で具体的なアドバイスを含めてください。
`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate conclusion from Gemini API');
  }
}