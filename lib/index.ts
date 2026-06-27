#!/usr/bin/env node
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { runInit } from './init.js';
import { getConfig, configExists, resetConfig } from './config.js';
import { getGitContext } from './git.js';
import { buildPrompt } from './prompt.js';
import { generate } from './providers/index.js';
import { displayMessage, promptAction } from './ui.js';
import { showHelp } from './help.js';

async function main() {
  const command = process.argv[2];

  if (command === '--help' || command === '-h') {
    showHelp();
    process.exit(0);
  }

  // gcm init — re-run setup
  if (command === 'init') {
    await runInit();
    process.exit(0);
  }

  // gcm config — show current config
  if (command === 'config') {
    if (!configExists()) {
      console.log(chalk.red('No config found. Run "gcm init" to get started.'));
      process.exit(1);
    }

    const subcommand = process.argv[3];

    if (subcommand === '--reset') {
      resetConfig();
      console.log();
      console.log(
        chalk.green('✔') + ' Config reset. Run "gcm init" to set up again.',
      );
      console.log();
      process.exit(0);
    }

    const config = getConfig();
    console.log();
    console.log(chalk.bold('Current config:'));
    console.log(chalk.dim(`  Provider : `) + config.provider);
    console.log(chalk.dim(`  Model    : `) + config.model);
    console.log(
      chalk.dim(`  API Key  : `) +
        (config.apiKey ? '••••••••' + config.apiKey.slice(-4) : 'none'),
    );
    console.log();
    process.exit(0);
  }

  // gcm — main generate flow
  // If no config exists, run init first automatically
  if (!configExists()) {
    await runInit();
  }

  const config = getConfig();

  // Gather git context — fails early if not a repo or nothing staged
  let context;
  try {
    context = getGitContext(config.provider);
    if (context.diffTruncated) {
      console.log();
      console.log(
        chalk.yellow('⚠  Large diff detected — truncated for AI processing.'),
      );
      console.log(
        chalk.dim('   Consider splitting this into smaller focused commits:'),
      );
      console.log(
        chalk.dim('   1. Unstage everything    git restore --staged .'),
      );
      console.log(
        chalk.dim('   2. Stage one concern     git add <specific files>'),
      );
      console.log(chalk.dim('   3. Commit it             gcm'));
      console.log(chalk.dim('   4. Repeat for each concern'));
      console.log();
    }
  } catch (err: any) {
    console.log();
    console.log(chalk.red('✘ ') + err.message);
    console.log();
    process.exit(1);
  }

  // Build the prompt
  const prompt = buildPrompt(context);

  // Generate loop — keeps regenerating until user commits or quits
  let message = '';
  let generating = true;

  while (generating) {
    const spinner = p.spinner();
    spinner.start('Generating commit message...');

    try {
      message = await generate(
        config.provider,
        prompt,
        config.apiKey ?? '',
        config.model,
    );

      spinner.stop('Done.');
    } catch (err: any) {
      const messages: Record<string, string> = {
        invalid_key: 'Your API key was rejected. Run "gcm init" to update it.',
        rate_limited: 'Rate limit hit. Wait a moment and try again.',
        server_error: 'Provider servers are down. Try again later.',
        network_error:
          'No internet connection. Check your network and try again.',
        invalid_request: 'Invalid request. Check your model name or config.',
        unknown_error: 'Something went wrong. Try again.',
      };
      const msg = messages[err?.message] ?? messages.unknown_error;
      spinner.stop(chalk.red('✘ ' + msg));
      console.log();
      await new Promise(resolve => setTimeout(resolve, 150));
      process.exit(1);
    }

    // Show the message and ask what to do
    displayMessage(message);
    const { action } = await promptAction(message);

    if (action === 'commit') {
      console.log();
      console.log(chalk.green('✔') + ' Committed.');
      generating = false;
    } else if (action === 'quit') {
      console.log();
      console.log(chalk.dim('Exited without committing.'));
      generating = false;
    }
    // action === 'regenerate' — loop continues
  }
}

main().catch(err => {
  console.error(chalk.red('Error:'), err);
  process.exit(1);
});
