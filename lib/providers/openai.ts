import OpenAI from 'openai';
import { handleError } from '../../utils/errors.js';

export async function validateKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({ apiKey });
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
  try {
    const client = new OpenAI({ apiKey });
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });
    return response.choices[0]?.message?.content?.trim() ?? '';
  } catch (err: any) {
    handleError(err);
  }
}
