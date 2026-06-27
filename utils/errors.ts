// export function handleError(err: any): never {
//   if (err?.status === 401 || err?.status === 403)
//     throw new Error('invalid_key');
//   if (err?.status === 429) throw new Error('rate_limited');
//   if (err?.status >= 500) throw new Error('server_error');
//   if (
//     ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'Connection error.'].includes(
//       err || err?.code || err?.message,
//     )
//   )
//     throw new Error('network_error');
//   if (err?.message.includes('fetch failed')) throw new Error('network_error');
//   throw new Error('unknown_error');
// }

export function handleError(err: any): never {
  // Some SDKs throw plain strings
  if (typeof err === 'string') {
    if (
      err.toLowerCase().includes('connection') ||
      err.toLowerCase().includes('network')
    ) {
      throw new Error('network_error');
    }
    throw new Error('unknown_error');
  }

  const status = err?.status ?? err?.statusCode;
  const code = err?.code ?? '';
  const message = err?.message ?? '';

  if (status === 401 || status === 403) throw new Error('invalid_key');
  if (status === 429) throw new Error('rate_limited');
  if (status >= 500) throw new Error('server_error');
  if (status === 400) throw new Error('invalid_request');

  const networkCodes = [
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT',
    'ECONNRESET',
    'ECONNABORTED',
  ];
  if (networkCodes.includes(code)) throw new Error('network_error');

  const networkMessages = [
    'fetch failed',
    'connection error',
    'network',
    'socket hang up',
    'ECONNREFUSED',
  ];
  if (
    networkMessages.some(m => message.toLowerCase().includes(m.toLowerCase()))
  ) {
    throw new Error('network_error');
  }

  throw new Error('unknown_error');
}
