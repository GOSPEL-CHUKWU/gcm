# gcm - Generate Commit Message

AI-powered git commit message generator. Reads your staged diff, understands your changes, and writes a senior-level commit message.

## Install

```bash
npm install -g generate-commit-message
```

## First Run

The first time you run `gcm`, it will automatically walk you through setup right in the terminal — no manual config needed:

```
Welcome to gcm! Let's get you set up.

? Pick a provider:
  ❯ Gemini (free - recommended)
    Groq (free)
    Ollama (local, no key needed)
    OpenAI (paid)
    Anthropic (paid)

? Paste your Gemini API key: ________________
  (Get one free at aistudio.google.com)

✔ Config saved to ~/.gcm/config.json
```

After setup it goes straight into generating your commit message — no extra steps.

## Usage

```bash
git add .
gcm
```

The AI reads your staged changes and generates a commit message. You then choose:

- `y` — commit with the message
- `e` — open your editor to tweak it first
- `n` — regenerate
- `q` — quit

## Commands

```bash
gcm          # generate a commit message
gcm init     # re-run setup (switch provider or update API key)
gcm config   # view your current config
```

## Supported Providers

| Provider | Free | API Key |
|---|---|---|
| Groq | ✅ Yes | Yes (get one free at console.groq.com) |
| Gemini | ❌ Paid | Yes (get one free at aistudio.google.com) |
| Ollama | ✅ Local | No key needed |
| OpenAI | ❌ Paid | Yes |
| Anthropic | ❌ Paid | Yes |

## Switching Providers

Run `gcm init` at any time to switch providers or update your API key. Your config is saved at `~/.gcm-config.json` and managed automatically — you never need to edit it manually.