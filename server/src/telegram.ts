import { createHmac } from 'crypto';

function hmac(data: string, key: string | Buffer): Buffer {
    return createHmac('sha256', key).update(data).digest();
}

export function processTelegramData(qs: string, token: string): { ok: false } | { ok: true, data: Record<string, string> } {
    const sk = hmac(token, 'WebAppData')
    const parts = qs.split('&').map(p => p.split('='))
    const hashpart = parts.splice(parts.findIndex(p => p[0] === 'hash'), 1)[0]
    const dcs = parts.sort((a, b) => a[0] > b[0] ? 1 : -1).map(p => decodeURIComponent(p.join('='))).join('\n')
    if (hmac(dcs, sk).toString('hex') !== hashpart[1]) return { ok: false }
    const o: Record<string, string> = {}
    for (const part of parts) {
        o[part[0]] = decodeURIComponent(part[1])
    }
    return { ok: true, data: o }
}
