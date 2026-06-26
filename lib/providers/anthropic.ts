import Anthropic from '@anthropic-ai/sdk';
import { handleError } from '../../utils/errors.js';

export async function validateKey(apiKey: string): Promise<boolean> {
  try {
    const client = new Anthropic({ apiKey });
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
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });
  const block = response.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}
