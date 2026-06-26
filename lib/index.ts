#!/usr/bin/env node
import chalk from 'chalk';
import { runInit } from './init.js';
import { getConfig, configExists } from './config.js';

const command = process.argv[2];

if (command === 'init' || !configExists()) {
  await runInit();
} else if (command === 'config') {
  const config = getConfig();
  console.log();
  console.log(chalk.bold('Current config:'));
  console.log(JSON.stringify(config, null, 2));
  console.log();
} else {
  // placeholder — will be the main generate flow later
  console.log(chalk.dim('gcm generate flow coming soon...'));
}
