export type Provider = 'gemini' | 'groq' | 'ollama' | 'openai' | 'anthropic';

export interface GcmConfig {
  provider: Provider;
  apiKey?: string; // optional because ollama doesn't need one
  model: string;
}
