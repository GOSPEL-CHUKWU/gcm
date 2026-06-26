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
