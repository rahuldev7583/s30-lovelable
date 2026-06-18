import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import OpenAI from 'openai';

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL ?? 'gemini-3.5-flash';
const openai_key = process.env.OPENAI_API_KEY;

export async function generateWithGemini(prompt: string): Promise<string> {
  if (!apiKey) {
    return 'Mock mode: GEMINI_API_KEY is not configured, so no files were changed.';
  }

  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
  });

  return result.text ?? '';
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateWithGPT(
  files: any,
  message: any,
  systemPrompt: any,
) {
  console.log({ files, message });

  try {
    const input_req = { files, message };
    const response = await openai.responses.create({
      model: 'gpt-4.1',
      input: JSON.stringify(input_req),
      instructions: systemPrompt,
    });
    console.log({ rawRes: response });

    //console.log(response.output_text);

    const parsed_res = JSON.parse(response.output_text);

    console.log({ parsed_res });

    return parsed_res;
  } catch (error: any) {
    console.error('Error communicating with OpenAI:', error.message);
  }
}
