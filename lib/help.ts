import chalk from 'chalk';

export function showHelp(): void {
  console.log();
  console.log(chalk.bold('gcm') + chalk.dim(' — Generate Commit Message'));
  console.log();
  console.log(chalk.bold('USAGE'));
  console.log(
    '  ' +
      chalk.cyan('gcm') +
      chalk.dim('              generate a commit message from staged changes'),
  );
  console.log(
    '  ' +
      chalk.cyan('gcm init') +
      chalk.dim('         set up your AI provider and API key'),
  );
  console.log(
    '  ' + chalk.cyan('gcm config') + chalk.dim('       show current config'),
  );
  console.log(
    '  ' +
      chalk.cyan('gcm --help (-h)') +
      chalk.dim('  show this help message'),
  );
  console.log();
  console.log(chalk.bold('WORKFLOW'));
  console.log(
    '  ' +
      chalk.dim('1.') +
      ' Stage your changes   ' +
      chalk.yellow('git add <files>'),
  );
  console.log(
    '  ' + chalk.dim('2.') + ' Generate a message   ' + chalk.yellow('gcm'),
  );
  console.log(
    '  ' +
      chalk.dim('3.') +
      ' Pick an action       ' +
      chalk.yellow('Yes / Edit / Regenerate / Quit'),
  );
  console.log();
  console.log(chalk.bold('PROVIDERS'));
  console.log(
    '  ' + chalk.green('Groq') + chalk.dim('      free — console.groq.com'),
  );
  console.log('  ' + chalk.dim('Ollama    local, no key needed'));
  console.log('  ' + chalk.dim('OpenAI    paid — platform.openai.com'));
  console.log('  ' + chalk.dim('Anthropic paid — console.anthropic.com'));
  console.log('  ' + chalk.dim('Gemini    paid — aistudio.google.com'));
  console.log();
}
