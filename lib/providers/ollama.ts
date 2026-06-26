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
