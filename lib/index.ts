#!/usr/bin/env node
import * as p from '@clack/prompts';
import chalk from 'chalk';
import { runInit } from './init.js';
import { getConfig, configExists } from './config.js';
import { getGitContext } from './git.js';
import { buildPrompt } from './prompt.js';
import { generate } from './providers/index.js';
import { displayMessage, promptAction } from './ui.js';

const command = process.argv[2];

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
  context = getGitContext();
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
    spinner.stop(chalk.red('Failed to generate message.'));
    console.log(chalk.dim(err?.message ?? 'Unknown error'));
    console.log();
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

process.exit(0);
