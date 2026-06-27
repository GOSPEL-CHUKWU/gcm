import * as p from '@clack/prompts';
import chalk from 'chalk';
import { saveConfig } from './config.js';
import { validateKey } from './providers/index.js';
import {
  PROVIDERS,
  DEFAULT_MODELS,
  API_KEY_URLS,
  ERROR_MESSAGES,
} from '../utils/constants.js';
import type { GcmConfig, Provider } from '../types/types.config.js';

// Returns true if the error is recoverable by re-prompting for a key
function isRetryable(message: string): boolean {
  return message === 'invalid_key' || message === 'rate_limited';
}

export async function runInit(): Promise<void> {
  console.log();
  p.intro(chalk.bold("Welcome to gcm! Let's get you set up."));

  const provider = await p.select<Provider>({
    message: 'Pick a provider',
    options: PROVIDERS.map(prov => ({
      value: prov.value,
      label: prov.label,
      hint: prov.free ? 'free' : 'paid',
    })),
  });

  if (p.isCancel(provider)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }

  let apiKey: string | undefined;

  if (provider !== 'ollama') {
    const url = API_KEY_URLS[provider as Provider];
    let valid = false;

    while (!valid) {
      const key = await p.text({
        message: 'Paste your API key',
        placeholder: `Get one free at ${url}`,
        validate: value => {
          if (!value?.trim()) return 'API key cannot be empty.';
        },
      });

      if (p.isCancel(key)) {
        p.cancel('Setup cancelled.');
        process.exit(0);
      }

      const spinner = p.spinner();
      spinner.start('Validating API key...');

      try {
        await validateKey(provider as Provider, key as string);
        spinner.stop('API key validated.');
        apiKey = key as string;
        valid = true;
      } catch (err: any) {
        const message = err?.message ?? 'unknown_error';
        spinner.stop(
          chalk.red(ERROR_MESSAGES[message] ?? ERROR_MESSAGES.unknown_error),
        );

        if (!isRetryable(message)) {
          p.cancel('Setup cancelled.');
          process.exit(1);
        }
      }
    }
  } else {
    const spinner = p.spinner();
    spinner.start('Checking Ollama server...');

    try {
      await validateKey('ollama');
      spinner.stop('Ollama server found.');
    } catch {
      spinner.stop(
        chalk.red('Ollama server not found.\n\n') +
          '  Make sure Ollama is installed and running:\n' +
          '  1. Download it at ollama.com\n' +
          '  2. Open the Ollama app (or run: ollama serve)\n' +
          '  3. Run gcm init again',
      );
      p.cancel('Setup cancelled.');
      process.exit(1);
    }
  }

  const config: GcmConfig = {
    provider: provider as Provider,
    model: DEFAULT_MODELS[provider as Provider],
    ...(apiKey && { apiKey }),
  };

  saveConfig(config);

  p.outro(chalk.green('✔') + ' Config saved to ~/.gcm/config.json');

  // Small delay to allow clack/terminal cleanup on Windows before exit
  await new Promise(resolve => setTimeout(resolve, 200));
}
