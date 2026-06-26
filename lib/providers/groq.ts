import Groq from 'groq-sdk';
import { handleError } from '../../utils/errors.js';

export async function validateKey(apiKey: string): Promise<boolean> {
  try {
    const client = new Groq({ apiKey });
    await client.models.list();
    return true;
  } catch (err: any) {
    handleError(err);
  }
}

export async function generate(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  const client = new Groq({ apiKey });
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3, // lower = more focused, less creative
  });
  return response.choices[0]?.message?.content?.trim() ?? '';
}