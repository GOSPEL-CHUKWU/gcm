import { GoogleGenerativeAI } from '@google/generative-ai';
import { handleError } from '../../utils/errors.js';

export async function validateKey(apiKey: string): Promise<boolean> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    await model.generateContent('hi');
    return true;
  } catch (err: any) {
    // Gemini uses 400 for invalid keys instead of the standard 401
    if (err?.status === 400 && err?.message?.includes('API_KEY_INVALID')) {
      throw new Error('invalid_key');
    }
    handleError(err);
  }
}
