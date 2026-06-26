import { Provider } from './../types/types.config.js';

// Default models for each provider
export const DEFAULT_MODELS: Record<Provider, string> = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  ollama: 'llama3',
  openai: 'gpt-4o-mini',
  anthropic: 'claude-haiku-4-5',
};

// Where to get API keys
export const API_KEY_URLS: Partial<Record<Provider, string>> = {
  gemini: 'aistudio.google.com',
  groq: 'console.groq.com',
  openai: 'platform.openai.com',
  anthropic: 'console.anthropic.com',
};

export const PROVIDERS: { label: string; value: Provider; free: boolean }[] = [
  { label: 'Gemini', value: 'gemini', free: true },
  { label: 'Groq', value: 'groq', free: true },
  { label: 'Ollama (local, no key needed)', value: 'ollama', free: true },
  { label: 'OpenAI', value: 'openai', free: false },
  { label: 'Anthropic', value: 'anthropic', free: false },
];

export const ERROR_MESSAGES: Record<string, string> = {
  invalid_key: 'Invalid API key. Please check it and try again.',
  rate_limited: 'Rate limit hit. Wait a moment and try again.',
  server_error: 'Provider servers are down. Try again later.',
  network_error: 'No internet connection. Check your network and try again.',
  unknown_error: 'Something went wrong. Try again.',
};