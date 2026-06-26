import type { Provider } from '../../types/types.config.js';
import * as gemini from './gemini.js';
import * as openai from './openai.js';
import * as anthropic from './anthropic.js';
import * as groq from './groq.js';
import * as ollama from './ollama.js';

const providers = { gemini, openai, anthropic, groq, ollama };

// Errors from each provider are intentionally not caught here.
// They bubble up to init.ts which handles them with the right message.
export async function validateKey(
  provider: Provider,
  apiKey?: string,
): Promise<boolean> {
  if (provider === 'ollama') {
    return ollama.validateKey();
  }
  if (!apiKey) return false;
  return providers[provider].validateKey(apiKey);
}
