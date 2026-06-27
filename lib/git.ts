import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import type { GitContext } from '../types/types.git.js';
import type { Provider } from '../types/types.config.js';
import { MAX_CHARS_PER_PROVIDER } from '../utils/constants.js';

// Per-file limit is 1/6 of total budget so at least 6 files always get representation
function getPerFileLimit(totalLimit: number): number {
  return Math.floor(totalLimit / 6);
}

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

// Splits a full diff into per-file chunks and truncates each one
// so the AI gets a representative view of every changed file
function truncateDiff(
  diff: string,
  totalLimit: number,
): { diff: string; truncated: boolean } {
  const perFileLimit = getPerFileLimit(totalLimit);

  // Each file section in a diff starts with "diff --git"
  const fileSections = diff.split(/(?=^diff --git)/m).filter(Boolean);

  if (fileSections.length <= 1 && diff.length <= totalLimit) {
    return { diff, truncated: false };
  }

  let totalChars = 0;
  let truncated = false;
  const parts: string[] = [];

  for (const section of fileSections) {
    const chunk =
      section.length > perFileLimit
        ? section.slice(0, perFileLimit) + '\n... (truncated)'
        : section;

    if (totalChars + chunk.length > totalLimit) {
      truncated = true;
      break;
    }

    parts.push(chunk);
    totalChars += chunk.length;

    if (section.length > perFileLimit) {
      truncated = true;
    }
  }

  return { diff: parts.join('\n'), truncated };
}

// Validates everything then returns all context the AI needs
export function getGitContext(provider: Provider): GitContext {
  if (!isGitRepo()) {
    throw new Error('Not a git repository. Run this inside a git project.');
  }

  if (!hasStagedChanges()) {
    throw new Error('No staged changes found. Run "git add <files>" first.');
  }

  const totalLimit = MAX_CHARS_PER_PROVIDER[provider];
  const rawDiff = getStagedDiff();
  const { diff, truncated: diffTruncated } = truncateDiff(rawDiff, totalLimit);

  const stat = getDiffStat();
  const recentCommits = getRecentCommits();
  const { projectName, projectDescription } = getProjectInfo();

  return {
    diff,
    stat,
    recentCommits,
    projectName,
    projectDescription,
    diffTruncated,
  };
}
