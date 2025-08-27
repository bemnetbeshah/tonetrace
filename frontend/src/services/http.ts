import { CONFIG } from '../utils/config';

async function handle<T>(p: Promise<Response>): Promise<T> {
  const res = await p;
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const http = {
  get: <T>(path: string, init?: RequestInit) => handle<T>(fetch(`${CONFIG.BASE_URL}${path}`, { ...init, method: 'GET', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } })),
  post: <T>(path: string, body: unknown, init?: RequestInit) => handle<T>(fetch(`${CONFIG.BASE_URL}${path}`, { ...init, method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) } }))
};

