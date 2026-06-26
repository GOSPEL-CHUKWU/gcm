import type { GitContext } from '../types/types.git.js';

export function buildPrompt(ctx: GitContext): string {
  const projectInfo = ctx.projectName
    ? `Project: ${ctx.projectName}${ctx.projectDescription ? ` — ${ctx.projectDescription}` : ''}`
    : '';

  const recentCommitsSection = ctx.recentCommits
    ? `Recent commits (for codebase context only — do NOT copy their style or format):
${ctx.recentCommits}`
    : '';

  return `You are a senior software engineer writing a git commit message.

Your job is to deeply analyze the diff and understand the intent behind the change — not just describe what lines changed, but what the developer was trying to accomplish and why.

${projectInfo}

${recentCommitsSection}

Changed files:
${ctx.stat}

Full diff:
${ctx.diff}

---

INSTRUCTIONS:

1. CLASSIFY the change correctly using conventional commits:
   - feat:     a new capability, feature, or behavior that didn't exist before
   - fix:      corrects a bug, broken behavior, or wrong output
   - refactor: restructures existing code without changing behavior (renames, extracts, simplifies)
   - style:    formatting only — whitespace, semicolons, quotes, indentation (zero logic change)
   - perf:     improves performance without changing behavior
   - docs:     documentation only
   - test:     adds or updates tests
   - chore:    tooling, config, dependencies, build scripts
   - ci:       CI/CD pipeline changes

2. SUBJECT LINE rules:
   - Format: type(optional scope): subject
   - Imperative mood — "add", not "added" or "adds"
   - Max 72 characters
   - No period at the end
   - Never use a filename as the subject — describe the intent, not the file
   - Never be vague ("update code", "fix stuff", "make changes")

3. BODY rules (add a body when the subject alone isn't enough):
   - Explain WHY the change was made, not what — the diff already shows what
   - If the commit touches multiple concerns, list each one clearly:
     - use a dash (-) per concern
     - be specific about what changed and why
   - Separate subject from body with a blank line

4. SCOPE (optional but encouraged):
   - Use the affected module, feature, or layer e.g. feat(auth):, fix(api):, refactor(ui):

5. CRITICAL — do NOT:
   - Copy or mirror the style of recent commits if they are low quality
   - Use the filename or folder name as the commit subject
   - Write "update X file" or "change X function"
   - Add a body if the subject is already fully self-explanatory

EXAMPLES of bad vs good:

bad:  feat: update auth.ts
good: feat(auth): add token refresh on 401 response

bad:  fix: fixed the bug in the loop
good: fix(parser): prevent infinite loop when input ends without delimiter

bad:  refactor: refactored utils
good: refactor(utils): extract date formatting into reusable helper

bad:  feat: implement userService.ts
good: feat(users): add endpoint to fetch paginated user list

---

Respond with ONLY the commit message — no explanation, no markdown, no code blocks, no preamble.
If the change is simple and self-explanatory, just the subject line is fine.
If it has multiple concerns or needs context, include a body.`;
}
