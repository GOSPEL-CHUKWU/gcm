export async function validateKey(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:11434');
    if (res.ok) return true;
    throw new Error('server_error');
  } catch (err: any) {
    if (['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(err?.code)) {
      throw new Error('network_error');
    }
    throw new Error('server_error');
  }
}

export async function generate(
  prompt: string,
  _apiKey: string,
  model: string,
): Promise<string> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false }),
  });

  if (!res.ok) throw new Error('server_error');

  const data = (await res.json()) as { response: string };
  return data.response.trim();
}