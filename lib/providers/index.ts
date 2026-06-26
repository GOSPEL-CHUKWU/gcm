import type { Provider } from '../../types/types.config.js';
import * as gemini from './gemini.js';
import * as openai from './openai.js';
import * as anthropic from './anthropic.js';
import * as groq from './groq.js';
import * as ollama from './ollama.js';

const providers = { gemini, openai, anthropic, groq, ollama };

// Errors bubble up to the caller — not caught here
export async function validateKey(
  provider: Provider,
  apiKey?: string,
): Promise<boolean> {
  if (provider === 'ollama') return ollama.validateKey();
  if (!apiKey) return false;
  return providers[provider].validateKey(apiKey);
}

export async function generate(
  provider: Provider,
  prompt: string,
  apiKey: string,
  model: string,
): Promise<string> {
  return providers[provider].generate(prompt, apiKey, model);
}
