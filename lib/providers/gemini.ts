import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleError } from '../../utils/errors.js';

export async function validateKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      throw new Error('invalid_key');
    }
    if (res.status === 429) throw new Error('rate_limited');
    if (res.status >= 500) throw new Error('server_error');
    if (!res.ok) throw new Error('unknown_error');

    return true;
  } catch (err: any) {
    if (
      ['invalid_key', 'rate_limited', 'server_error', 'unknown_error'].includes(
        err?.message,
      )
    ) {
      throw err;
    }
    handleError(err);
  }
}

export async function generate(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const genModel = genAI.getGenerativeModel({ model });
  const result = await genModel.generateContent(prompt);
  return result.response.text();
}
