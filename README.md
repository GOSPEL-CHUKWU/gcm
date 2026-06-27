# gcm — Generate Commit Message

AI-powered git commit message generator. Reads your staged diff, understands your changes, and writes a senior-level conventional commit message — not just the filename, the actual intent.

## Install

```bash
npm install -g git-gcm
```

## First Run

The first time you run `gcm`, it automatically walks you through setup in the terminal — no manual config needed:

```
┌  Welcome to gcm! Let's get you set up.
│
◆  Pick a provider
│  ● Groq          (free)
│  ○ Ollama        (local, no key needed)
│  ○ OpenAI        (paid)
│  ○ Anthropic     (paid)
│  ○ Gemini        (paid)
│
◆  Paste your API key
│  Get one free at console.groq.com
│  › ________________
│
└  ✔ Config saved to ~/.gcm/config.json
```

After setup it goes straight into generating your commit message.

## Usage

```bash
git add .
gcm
```

The AI reads your staged diff, understands what changed and why, and generates a commit message. You then choose:

- **Yes** — commit with the message
- **Edit** — open in your editor to tweak first
- **Regenerate** — generate a new message
- **Quit** — exit without committing

## Example Output

```
┌──────────────────────────────────────────────────────┐
│ refactor(auth): simplify token validation logic      │
│                                                      │
│ - replace manual JWT decode with jose library        │
│ - remove redundant session check in middleware       │
│ - fix edge case where expired tokens weren't caught  │
└──────────────────────────────────────────────────────┘
```

## Commands

```bash
gcm                  # generate a commit message from staged changes
gcm init             # re-run setup (switch provider or update API key)
gcm config           # view your current config
gcm config --reset   # delete config and start over
gcm --help (or -h)   # show help
```

## Supported Providers

| Provider | Free | API Key |
|---|---|---|
| Groq | ✅ Yes | Yes — [console.groq.com](https://console.groq.com) |
| Ollama | ✅ Local | No key needed |
| OpenAI | ❌ Paid | Yes — [platform.openai.com](https://platform.openai.com) |
| Anthropic | ❌ Paid | Yes — [console.anthropic.com](https://console.anthropic.com) |
| Gemini | ❌ Paid | Yes — [aistudio.google.com](https://aistudio.google.com) |

## Large Commits

If you stage too many files at once, gcm will warn you and suggest splitting:

```
⚠  Large diff detected — truncated for AI processing.
   Consider splitting this into smaller focused commits:
   1. Unstage everything    git restore --staged .
   2. Stage one concern     git add <specific files>
   3. Commit it             gcm
   4. Repeat for each concern
```

One commit should have one reason to exist. If you can't describe it in a single subject line without using "and" — split it.

## Config

Config is saved at `~/.gcm/config.json` and managed automatically. You never need to edit it manually.

To switch providers or update your API key at any time:

```bash
gcm init
```