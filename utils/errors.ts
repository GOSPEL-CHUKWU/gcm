// utils/errors.ts
export function handleError(err: any): never {
  if (err?.status === 401 || err?.status === 403)
    throw new Error('invalid_key');
  if (err?.status === 429) throw new Error('rate_limited');
  if (err?.status >= 500) throw new Error('server_error');
  if (
    ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'Connection error.'].includes(
      err || err?.code || err?.message,
    )
  )
    throw new Error('network_error');
  if (err?.message.includes('fetch failed')) throw new Error('network_error');
  throw new Error('unknown_error');
}
