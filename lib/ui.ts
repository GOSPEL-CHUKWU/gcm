import * as p from '@clack/prompts';
import chalk from 'chalk';
import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { UIAction } from '../types/types.ui.js';

// Prints the generated commit message in a clean box
export function displayMessage(message: string): void {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length), 40);
  const border = '─'.repeat(maxLength + 2);

  console.log();
  console.log(chalk.dim('┌' + border + '┐'));
  lines.forEach(line => {
    const padding = ' '.repeat(maxLength - line.length);
    console.log(
      chalk.dim('│ ') + chalk.white(line) + padding + chalk.dim(' │'),
    );
  });
  console.log(chalk.dim('└' + border + '┘'));
  console.log();
}

// Opens the commit message in the user's default editor for tweaking
function openInEditor(message: string): string {
  const tmpFile = path.join(os.tmpdir(), 'gcm-commit-msg.txt');
  fs.writeFileSync(tmpFile, message, 'utf-8');

  const editor = process.env.EDITOR ?? process.env.VISUAL ?? 'notepad';
  execSync(`${editor} "${tmpFile}"`, { stdio: 'inherit' });

  const edited = fs.readFileSync(tmpFile, 'utf-8').trim();
  fs.unlinkSync(tmpFile);
  return edited;
}

// Commits with the given message
function commit(message: string): void {
  // Normalize: split on either \n\n or just \n between header and body
  const parts = message.split('\n');
  const subject = parts[0];
  const body = parts
    .slice(1)
    .filter(line => line.trim() !== '')
    .join('\n');

  if (body) {
    execSync(
      `git commit -m "${subject.replace(/"/g, '\\"')}" -m "${body.replace(/"/g, '\\"')}"`,
      {
        stdio: 'inherit',
      },
    );
  } else {
    execSync(`git commit -m "${subject.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    });
  }
}

// The main y/e/n prompt loop
// Returns 'commit', 'regenerate', or 'quit'
export async function promptAction(
  message: string,
): Promise<{ action: UIAction; message: string }> {
  const choice = await p.select({
    message: 'Use this commit message?',
    options: [
      { value: 'commit', label: 'Yes', hint: 'commit with this message' },
      { value: 'edit', label: 'Edit', hint: 'open in editor to tweak' },
      {
        value: 'regenerate',
        label: 'Regenerate',
        hint: 'generate a new message',
      },
      { value: 'quit', label: 'Quit', hint: 'exit without committing' },
    ],
  });

  if (p.isCancel(choice) || choice === 'quit') {
    return { action: 'quit', message };
  }

  if (choice === 'edit') {
    const edited = openInEditor(message);
    displayMessage(edited);

    // After editing, ask again with the edited message
    return promptAction(edited);
  }

  if (choice === 'commit') {
    commit(message);
    return { action: 'commit', message };
  }

  return { action: 'regenerate', message };
}
