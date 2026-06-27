import fs from 'fs';
import path from 'path';
import os from 'os';
import type { GcmConfig } from '../types/types.config.js';

// ~/.gcm/config.json
const GCM_DIR = path.join(os.homedir(), '.gcm');
const CONFIG_PATH = path.join(GCM_DIR, 'config.json');

export function configExists(): boolean {
  return fs.existsSync(CONFIG_PATH);
}

export function getConfig(): GcmConfig {
  if (!configExists()) {
    throw new Error('No config found. Run "gcm init" to get started.');
  }

  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw) as GcmConfig;
}

export function saveConfig(config: GcmConfig): void {
  // Create ~/.gcm/ if it doesn't exist yet
  if (!fs.existsSync(GCM_DIR)) {
    fs.mkdirSync(GCM_DIR, { recursive: true });
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function resetConfig(): void {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
  }
}