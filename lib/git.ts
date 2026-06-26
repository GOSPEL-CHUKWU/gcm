import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import type { GitContext } from '../types/types.git.js';

export type { GitContext };

// Runs a shell command and returns the output as a string.
// Returns empty string if the command fails instead of crashing.
function run(command: string): string {
  try {
    return execSync(command, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return '';
  }
}

function isGitRepo(): boolean {
  return run('git rev-parse --is-inside-work-tree') === 'true';
}

function hasStagedChanges(): boolean {
  const diff = run('git diff --staged --name-only');
  return diff.length > 0;
}

// The actual diff — what the AI reads to understand what changed
function getStagedDiff(): string {
  return run('git diff --staged');
}

// File-level summary e.g. "src/auth.ts | 12 ++-"
function getDiffStat(): string {
  return run('git diff --staged --stat');
}

// Last 10 commits — used for codebase context only, not style matching
function getRecentCommits(): string {
  return run('git log --oneline -10');
}

// Reads package.json at the project root for name and description
function getProjectInfo(): { projectName: string; projectDescription: string } {
  try {
    const root = run('git rev-parse --show-toplevel');
    const pkgPath = path.join(root, 'package.json');

    if (!fs.existsSync(pkgPath)) {
      return { projectName: '', projectDescription: '' };
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return {
      projectName: pkg.name ?? '',
      projectDescription: pkg.description ?? '',
    };
  } catch {
    return { projectName: '', projectDescription: '' };
  }
}

// Validates everything then returns all context the AI needs
export function getGitContext(): GitContext {
  if (!isGitRepo()) {
    throw new Error('Not a git repository. Run this inside a git project.');
  }

  if (!hasStagedChanges()) {
    throw new Error('No staged changes found. Run "git add <files>" first.');
  }

  const diff = getStagedDiff();
  const stat = getDiffStat();
  const recentCommits = getRecentCommits();
  const { projectName, projectDescription } = getProjectInfo();

  return {
    diff,
    stat,
    recentCommits,
    projectName,
    projectDescription,
  };
}
